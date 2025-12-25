"use client";

import React, { useState, useEffect } from "react";
import { CreateContextState } from "./CreateFlow";
import { Lock, Globe, Users, Hash, MapPin, Save, Upload, CheckCircle2, XCircle, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { usePi } from "@/components/pi/pi-provider";
import { useEconomy } from "@/components/economy/EconomyContext";
import { getBrowserFingerprint } from "@/lib/utils";
import { saveDraft } from "@/lib/drafts";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

interface PostSettingsProps {
    media: CreateContextState;
    onPostComplete: () => void;
}

type StepStatus = 'idle' | 'loading' | 'success' | 'error';

interface Step {
    id: number;
    label: string;
    status: StepStatus;
    progress: number; // 0-100
    error?: string;
    details?: string;
}

export function PostSettings({ media, onPostComplete }: PostSettingsProps) {
    const { user } = usePi();
    const { addVideo } = useEconomy();
    const router = useRouter(); // Initialize router for redirection
    const [caption, setCaption] = useState("");
    const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
    const [allowComments, setAllowComments] = useState(true);
    const [highQuality, setHighQuality] = useState(true);

    // Upload State
    const [isPosting, setIsPosting] = useState(false);
    const [steps, setSteps] = useState<Step[]>([
        { id: 1, label: "1. Getting Permission", status: 'idle', progress: 0 },
        { id: 2, label: "2. Uploading Video", status: 'idle', progress: 0 },
        { id: 3, label: "3. Finalizing", status: 'idle', progress: 0 },
    ]);
    const [canClose, setCanClose] = useState(true);

    const updateStep = (id: number, updates: Partial<Step>) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    /**
     * Runs a task with a visual progress bar.
     *
     * @param stepId The ID of the step to update
     * @param minDurationMs Minimum duration for the visual progress (only if progress isn't manually controlled)
     * @param task The async task to run
     * @param onProgressUpdate If provided, this function is responsible for updating progress. The internal timer will be disabled.
     */
    const runStepWithMinDuration = async (
        stepId: number,
        minDurationMs: number,
        task: () => Promise<any>,
        onProgressUpdate?: boolean // If true, disable the fake timer because the task will report real progress
    ) => {
        updateStep(stepId, { status: 'loading', progress: 0, error: undefined });

        // Timer Promise (only if we need fake progress)
        let timerPromise = Promise.resolve();

        if (!onProgressUpdate) {
            timerPromise = new Promise<void>((resolve) => {
                const interval = 100; // Update progress frequently
                const steps = minDurationMs / interval;
                let currentStep = 0;

                const timerId = setInterval(() => {
                    currentStep++;
                    const progress = Math.min((currentStep / steps) * 90, 90); // Cap at 90% until task is actually done

                    updateStep(stepId, { progress });

                    if (currentStep >= steps) {
                        clearInterval(timerId);
                        resolve();
                    }
                }, interval);
            });
        }

        // Task Promise
        let taskResult: any = null;
        let taskError: any = null;

        try {
            taskResult = await task();
        } catch (err) {
            taskError = err;
        }

        // Wait for both (if timer is active)
        await Promise.all([timerPromise]);

        if (taskError) {
             let errorMessage = taskError.message || "Unknown error";
             if (errorMessage.includes("Network")) errorMessage = "Network Error: Check internet";
             if (errorMessage.includes("Signature")) errorMessage = "Security Error: Auth failed";
             if (errorMessage.includes("timeout")) errorMessage = "Connection timed out (Slow Network)";

            updateStep(stepId, { status: 'error', error: errorMessage });
            throw taskError;
        }

        updateStep(stepId, { status: 'success', progress: 100 });
        return taskResult;
    };

    const handleSaveDraft = async () => {
        if (!media.file) return;
        try {
            await saveDraft({
                id: Date.now().toString(),
                videoFile: media.file,
                metadata: {
                    caption,
                    trimStart: media.editorState?.trim.start || 0,
                    trimEnd: media.editorState?.trim.end || 0,
                    music: media.editorState?.music || null,
                    effects: media.editorState?.overlays.map(o => o.content) || []
                },
                createdAt: Date.now()
            });
            toast.success("Draft saved to local storage");
        } catch (e) {
            console.error(e);
            toast.error("Failed to save draft");
        }
    };

    const handlePost = async () => {
        if (!user) {
            toast.error("Please login to post");
            return;
        }

        // REMOVED: Caption validation to make it optional

        setIsPosting(true);
        setCanClose(false);

        // Reset steps
        setSteps([
            { id: 1, label: "1. Getting Permission", status: 'idle', progress: 0 },
            { id: 2, label: "2. Uploading Video", status: 'idle', progress: 0 },
            { id: 3, label: "3. Finalizing", status: 'idle', progress: 0 },
        ]);

        const hashtags = caption.match(/#[a-z0-9_]+/gi) || [];

        try {
            const fileToUpload = media.file;
            if (!fileToUpload) throw new Error("No file to upload");
            const deviceSignature = getBrowserFingerprint();

            // --- STEP 1: Get Presigned URL ---
            const presignedRes = await runStepWithMinDuration(1, 2000, async () => {
                const contentType = fileToUpload.type || 'video/mp4';

                const res = await apiClient.video.getPresignedUrl(
                    fileToUpload.name,
                    contentType,
                    user.username,
                    60000
                );
                if (!res.url) throw new Error(res.error || "Failed to get upload URL");
                return res;
            });

            // --- STEP 2: Upload to R2 ---
            await runStepWithMinDuration(2, 5000, async () => {
                const contentType = fileToUpload.type || 'video/mp4';

                await apiClient.video.uploadToR2(
                    presignedRes.url,
                    fileToUpload,
                    contentType,
                    (percent) => updateStep(2, { progress: percent }),
                    600000
                );
            }, true);

            // --- STEP 3: Finalize ---
            const finalizeRes = await runStepWithMinDuration(3, 2000, async () => {
                const res = await apiClient.video.finalizeUpload({
                    key: presignedRes.key,
                    username: user.username,
                    description: caption, // Optional now
                    hashtags: JSON.stringify(hashtags),
                    privacy,
                    deviceSignature,
                    metadata: { size: fileToUpload.size, type: fileToUpload.type }
                }, 120000);

                if (!res.success) throw new Error(res.error || "Finalize failed");
                return res;
            });

            // Success!
            toast.success("Posted successfully!");
            addVideo({
                id: finalizeRes.public_id || `temp_${Date.now()}`,
                url: finalizeRes.url,
                thumbnail: finalizeRes.thumbnail || finalizeRes.url,
                description: caption,
                createdAt: Date.now()
            });

            // Wait briefly then close and redirect
            setTimeout(() => {
                setIsPosting(false);
                setCanClose(true);
                onPostComplete(); // Closes the modal/overlay
                router.push("/"); // CHANGED: Redirect to Home Feed ("/") instead of "/profile"
                router.refresh(); // Priority 1: Revalidate Data for immediate update

                // Fire a global event to ensure Feed re-fetches if router.refresh() is lazy
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('feed-refresh'));
                }
            }, 1500);

        } catch (e: any) {
            console.error(e);
            setCanClose(true);
        }
    };

    const handleClose = () => {
        if (canClose) {
            setIsPosting(false);
        }
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col text-black overflow-y-auto relative">

            {/* Detailed Upload Modal */}
            {isPosting && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm flex flex-col gap-6 animate-in fade-in zoom-in duration-300 shadow-2xl">

                        <div className="text-center border-b pb-4">
                            <h3 className="font-bold text-xl text-gray-900">Uploading Video</h3>
                            <p className="text-sm text-gray-500">Please keep this screen open</p>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step) => (
                                <div key={step.id} className="relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {step.status === 'idle' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                            {step.status === 'loading' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                                            {step.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                            {step.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}

                                            <span className={`font-medium ${step.status === 'idle' ? 'text-gray-400' : 'text-gray-900'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                        {step.status !== 'idle' && (
                                            <span className="text-xs font-mono text-gray-500">{Math.round(step.progress)}%</span>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ease-out ${
                                                step.status === 'error' ? 'bg-red-500' :
                                                step.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${step.progress}%` }}
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {step.status === 'error' && (
                                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded flex items-start gap-2">
                                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                            <span>{step.error}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Working Indicator */}
                        {!canClose && (
                            <div className="flex justify-center py-2">
                                <span className="text-xs text-gray-400 animate-pulse">Processing request...</span>
                            </div>
                        )}

                        {/* Footer / Close Button */}
                        {canClose && (
                            <div className="flex flex-col gap-2 mt-2">
                                <button
                                    onClick={handleSaveDraft}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Save to Drafts
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                                >
                                    Close Window
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                <button onClick={onPostComplete} className="text-gray-500 hover:text-black">Cancel</button>
                <h2 className="font-bold text-lg">Post</h2>
                <div className="w-8"></div>
            </div>

            <div className="p-4 flex gap-4 bg-white mb-4">
                 {/* Thumbnail */}
                 <div className="w-24 h-32 bg-black rounded-md overflow-hidden shrink-0 relative">
                     {media.type === 'video' ? (
                         <video src={media.previewUrl || ""} className="w-full h-full object-cover" />
                     ) : (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={media.previewUrl || ""} className="w-full h-full object-cover" alt="thumb" />
                     )}
                     <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">
                         Select Cover
                     </div>
                 </div>

                 {/* Caption Input */}
                 <div className="flex-1">
                     <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Describe your video... #Hashtags @Friends (Optional)"
                        className="w-full h-full resize-none outline-none text-sm p-2"
                     />
                 </div>
            </div>

            {/* Settings Group */}
            <div className="bg-white p-4 space-y-6 mb-32">
                {/* ... (Existing settings) ... */}
                <div className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                    <Hash size={20} />
                    <span className="flex-1">Hashtags</span>
                    <button onClick={() => setCaption(prev => prev + " #Trending")} className="text-xs bg-gray-200 px-2 py-1 rounded">#Trending</button>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                    <Users size={20} />
                    <span className="flex-1">Tag People</span>
                    <ArrowIcon />
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                    <MapPin size={20} />
                    <span className="flex-1">Location</span>
                    <ArrowIcon />
                </div>

                <div className="border-t border-gray-100 my-4"></div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {privacy === 'public' && <Globe size={18} />}
                        {privacy === 'friends' && <Users size={18} />}
                        {privacy === 'private' && <Lock size={18} />}
                        Who can watch this video
                    </div>
                    <select
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value as any)}
                        className="bg-transparent text-sm text-gray-500 outline-none text-right"
                    >
                        <option value="public">Everyone</option>
                        <option value="friends">Friends</option>
                        <option value="private">Only Me</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Allow Comments</div>
                    <input
                        type="checkbox"
                        checked={allowComments}
                        onChange={(e) => setAllowComments(e.target.checked)}
                        className="toggle"
                    />
                </div>

                <div className="flex items-center justify-between">
                     <div className="text-sm font-medium">High Quality Upload</div>
                     <input
                        type="checkbox"
                        checked={highQuality}
                        onChange={(e) => setHighQuality(e.target.checked)}
                        className="toggle"
                    />
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-4 items-center safe-pb">
                 <button
                    onClick={handleSaveDraft}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                >
                    <Save size={18} /> Drafts
                </button>
                 <button
                    onClick={handlePost}
                    disabled={isPosting}
                    className="flex-[2] py-3 bg-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {isPosting ? <span className="text-sm">Processing...</span> :
                        <span className="flex items-center justify-center gap-2"><Upload size={18} /> Post</span>
                    }
                </button>
            </div>
        </div>
    );
}

function ArrowIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
