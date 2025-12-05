"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Check, Music2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { CameraRecorder } from "./CameraRecorder";
import { saveVideoToDB } from "@/lib/video-storage";

export default function AIContentStudio() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [script, setScript] = useState("");

    const handleVideoRecorded = (blob: Blob) => {
        setRecordedBlob(blob);
    };

    const handleUpload = async () => {
        if (!recordedBlob) return;
        setIsUploading(true);

        try {
            const file = new File([recordedBlob], `recording_${Date.now()}.webm`, { type: 'video/webm' });
            const formData = new FormData();
            formData.append('file', file);

            // 1. Attempt Server Upload
            let uploadRes;
            try {
                 uploadRes = await apiClient.video.upload(formData);
            } catch (e) {
                 console.warn("Server unreachable, forcing local fallback");
                 uploadRes = { success: false, useLocalFallback: true };
            }

            let finalVideoUrl = "";
            let finalThumbnail = "";
            let fileId = uploadRes.fileId || `local_${Date.now()}`;
            let isLocal = false;

            if (uploadRes.success) {
                finalVideoUrl = uploadRes.url;
                finalThumbnail = uploadRes.thumbnail;
                fileId = uploadRes.fileId;
            } else if (uploadRes.useLocalFallback) {
                // Fallback: Save to IndexedDB
                console.log("Using Local IndexedDB Fallback for Video");
                await saveVideoToDB(fileId, recordedBlob);

                // We store a special URL prefix to indicate it needs to be loaded from DB
                finalVideoUrl = `localdb://${fileId}`;
                finalThumbnail = ""; // Generate placeholder or grab frame later? For now empty.
                isLocal = true;

                toast.info("Uploaded locally (Offline Mode)", {
                    description: "Video saved to device storage."
                });
            } else {
                throw new Error(uploadRes.error || "Upload failed");
            }

            // 2. Create Post Metadata Object
            const newPost = {
                id: fileId,
                videoUrl: finalVideoUrl,
                description: script || "Check out my new video on Connect! #PiNetwork #Web3",
                thumbnail: finalThumbnail,
                author: "Me",
                likes: 0,
                comments: 0,
                shares: 0,
                songName: "Original Sound",
                isLocal: true, // Always true for "my" posts in this demo context
                timestamp: Date.now()
            };

            // 3. Save Metadata to LocalStorage (for Feed to find it)
            try {
                const savedUploads = JSON.parse(localStorage.getItem('connect_uploads') || '[]');
                // Limit local storage items to prevent overflow
                const updatedUploads = [newPost, ...savedUploads].slice(0, 20);
                localStorage.setItem('connect_uploads', JSON.stringify(updatedUploads));
            } catch (e) {
                console.error("Failed to save metadata to local storage", e);
                toast.error("Storage Full: Could not save post metadata.");
            }

            toast.success("Video posted!");
            router.push('/'); // Go to feed

        } catch (error: any) {
            console.error(error);
            toast.error(`Upload Error: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRetake = () => {
        setRecordedBlob(null);
    };

    return (
        <div className="h-full w-full bg-black relative overflow-hidden flex flex-col">
            {/* Header / Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                 <button onClick={() => router.back()} className="text-white p-2 rounded-full bg-black/20 backdrop-blur-md pointer-events-auto">
                     <X size={24} />
                 </button>

                 {/* Only show upload button if we have a recording */}
                 {recordedBlob && (
                     <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="bg-pink-600 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-pink-500/50 flex items-center gap-2 pointer-events-auto animate-in fade-in zoom-in"
                    >
                         {isUploading ? (
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         ) : (
                             <Check size={16} />
                         )}
                         {isUploading ? 'Posting...' : 'Post'}
                     </button>
                 )}
            </div>

            {/* Main Camera View */}
            <div className="flex-1 bg-gray-900 overflow-hidden relative">
                {recordedBlob ? (
                    <div className="w-full h-full relative">
                        <video
                            src={URL.createObjectURL(recordedBlob)}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            loop
                        />
                         <button
                            onClick={handleRetake}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full font-bold shadow-lg pointer-events-auto"
                        >
                            Retake
                        </button>
                    </div>
                ) : (
                    <CameraRecorder
                        onVideoRecorded={handleVideoRecorded}
                        script={script}
                    />
                )}
            </div>
        </div>
    );
}
