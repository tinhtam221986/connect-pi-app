"use client";

import React, { useState } from "react";
import { CreateContextState } from "./CreateFlow";
import { Loader2, Lock, Globe, Users, Hash, MapPin, AlertCircle, Save, Upload, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { usePi } from "@/components/pi/pi-provider";
import { useEconomy } from "@/components/economy/EconomyContext";
import { getBrowserFingerprint } from "@/lib/utils";
import { saveDraft } from "@/lib/drafts";
import { Progress } from "@/components/ui/progress";

interface PostSettingsProps {
    media: CreateContextState;
    onPostComplete: () => void;
}

export function PostSettings({ media, onPostComplete }: PostSettingsProps) {
    const { user } = usePi();
    const { addVideo } = useEconomy();
    const [caption, setCaption] = useState("");
    const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
    const [allowComments, setAllowComments] = useState(true);
    const [highQuality, setHighQuality] = useState(true);

    // Upload State
    const [isPosting, setIsPosting] = useState(false);
    const [uploadStep, setUploadStep] = useState<string>(""); // Description
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handlePost = async () => {
        if (!user) {
            toast.error("Please login to post");
            return;
        }

        setIsPosting(true);
        setUploadStatus('uploading');
        setErrorMessage(null);
        setUploadProgress(0);

        // Extract hashtags
        const hashtags = caption.match(/#[a-z0-9_]+/gi) || [];

        try {
            const fileToUpload = media.file;
            if (!fileToUpload) throw new Error("No file to upload");

            const deviceSignature = getBrowserFingerprint();

            // STEP 1: Get Presigned URL
            setUploadStep("Step 1/3: Requesting permission...");
            setUploadProgress(10);

            const presignedRes = await apiClient.video.getPresignedUrl(
                fileToUpload.name,
                fileToUpload.type,
                user.username
            );

            if (!presignedRes.url) {
                throw new Error(presignedRes.error || "Failed to get upload URL");
            }

            // STEP 2: Upload to R2
            setUploadStep("Step 2/3: Uploading video...");
            await apiClient.video.uploadToR2(presignedRes.url, fileToUpload, (percent) => {
                // Map 0-100 to 20-90 range for overall progress
                setUploadProgress(20 + (percent * 0.7));
            });

            // STEP 3: Finalize
            setUploadStep("Step 3/3: Saving metadata...");
            setUploadProgress(95);

            const res = await apiClient.video.finalizeUpload({
                key: presignedRes.key,
                username: user.username,
                description: caption,
                hashtags: JSON.stringify(hashtags),
                privacy,
                // allowComments, // API might not support yet, but good to have in client
                deviceSignature,
                metadata: { size: fileToUpload.size, type: fileToUpload.type }
            });

            if (res.success) {
                setUploadStatus('success');
                setUploadProgress(100);
                setUploadStep("Upload Complete!");
                toast.success("Posted successfully!");

                // Update local state
                addVideo({
                    id: res.public_id || `temp_${Date.now()}`,
                    url: res.url,
                    thumbnail: res.thumbnail || res.url,
                    description: caption,
                    createdAt: Date.now()
                });

                // Wait a moment before closing
                setTimeout(() => {
                    setIsPosting(false);
                    onPostComplete();
                }, 1500);
            } else {
                throw new Error(res.error || "Finalize failed");
            }

        } catch (e: any) {
            console.error(e);
            setUploadStatus('error');
            setErrorMessage(e.message || "An unknown error occurred");
            toast.error("Upload failed");
        }
    };

    const handleCloseError = () => {
        setIsPosting(false);
        setUploadStatus('idle');
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

    return (
        <div className="h-full bg-gray-50 flex flex-col text-black overflow-y-auto relative">

            {/* Upload Overlay */}
            {isPosting && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">

                        {uploadStatus === 'uploading' && (
                            <>
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                <div className="text-center w-full space-y-2">
                                    <h3 className="font-bold text-lg">Uploading...</h3>
                                    <p className="text-sm text-gray-500">{uploadStep}</p>
                                    <Progress value={uploadProgress} className="h-2" />
                                    <p className="text-xs text-gray-400 text-right">{Math.round(uploadProgress)}%</p>
                                </div>
                            </>
                        )}

                        {uploadStatus === 'success' && (
                            <>
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                                <div className="text-center">
                                    <h3 className="font-bold text-lg text-green-600">Success!</h3>
                                    <p className="text-sm text-gray-500">Your video is live.</p>
                                </div>
                            </>
                        )}

                        {uploadStatus === 'error' && (
                            <>
                                <XCircle className="w-16 h-16 text-red-500" />
                                <div className="text-center w-full">
                                    <h3 className="font-bold text-lg text-red-600">Upload Failed</h3>
                                    <p className="text-sm text-red-500 bg-red-50 p-2 rounded my-2 break-words">
                                        {errorMessage}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Note: If using Pi Browser, this may be a CORS issue.
                                    </p>
                                </div>
                                <button
                                    onClick={handleCloseError}
                                    className="w-full py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </>
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
                        placeholder="Describe your video... #Hashtags @Friends"
                        className="w-full h-full resize-none outline-none text-sm p-2"
                     />
                 </div>
            </div>

            {/* Settings Group - Added margin-bottom to ensure content is not hidden by fixed footer */}
            <div className="bg-white p-4 space-y-6 mb-32">

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
