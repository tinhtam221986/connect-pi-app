"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, PlusSquare, Upload } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/i18n/language-provider";

interface UploadViewProps {
    blob: Blob;
    onBack: () => void;
}

export function UploadView({ blob, onBack }: UploadViewProps) {
    const { t } = useLanguage();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleUpload = () => {
        setUploading(true);
        toast.info(t('create.uploading') || "Uploading...");

        // Simulate upload
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setUploading(false);
                toast.success(t('create.success') || "Uploaded successfully!");
                // In a real app, we would redirect or clear the form here
            }
        }, 100);
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    Back
                </button>
                <h2 className="font-bold">Post</h2>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            <div className="p-4 flex gap-4">
                 {/* Thumbnail Preview */}
                 <div className="w-24 h-32 bg-gray-800 rounded-md overflow-hidden relative">
                     {blob.type.startsWith("image/") ? (
                         <img
                            src={URL.createObjectURL(blob)}
                            className="w-full h-full object-cover"
                            alt="Preview"
                         />
                     ) : (
                         <video
                            src={URL.createObjectURL(blob)}
                            className="w-full h-full object-cover"
                            muted
                         />
                     )}
                 </div>

                 {/* Caption Input */}
                 <textarea
                    className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-sm"
                    placeholder="Describe your video... #hashtags @friends"
                    rows={4}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                 />
            </div>

            <div className="flex-1 p-4">
                {/* Additional Settings (Simulated) */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Who can watch this video</span>
                        <span className="text-xs text-gray-400">Everyone</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Allow comments</span>
                        <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                </div>
            </div>

            {/* Bottom Action */}
            <div className="p-4 bg-gray-900 border-t border-gray-800 safe-area-bottom pb-20">
                {uploading ? (
                     <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-500 transition-all" style={{width: `${progress}%`}} />
                        </div>
                        <span className="text-xs text-gray-400">{progress}%</span>
                     </div>
                ) : (
                    <div className="flex gap-2">
                        <button className="flex-1 py-3 bg-gray-800 rounded-lg font-bold text-sm text-gray-400">Drafts</button>
                        <button
                            onClick={handleUpload}
                            className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-bold text-sm text-white"
                        >
                            Post
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
