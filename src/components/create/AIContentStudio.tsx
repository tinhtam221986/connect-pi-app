"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Check, Music2 } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { CameraRecorder } from "./CameraRecorder";

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

            // 1. Upload Video
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await apiClient.video.upload(formData);

            if (uploadRes.success) {
                // 2. Create Post
                await apiClient.feed.create({
                    videoUrl: uploadRes.url,
                    description: script || "Check out my new video on Connect! #PiNetwork #Web3",
                    thumbnail: uploadRes.thumbnail || uploadRes.url,
                    author: "Me",
                });

                toast.success("Video uploaded successfully!");
                router.push('/'); // Go to feed
            } else {
                toast.error(uploadRes.error || "Upload failed");
            }

        } catch (error) {
            console.error(error);
            toast.error("An error occurred during upload.");
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
