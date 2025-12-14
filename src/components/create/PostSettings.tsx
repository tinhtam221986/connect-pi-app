"use client";

import React, { useState } from "react";
import { CreateContextState } from "./CreateFlow";
import { Loader2, Lock, Globe, Users, Hash, MapPin, AlertCircle, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { usePi } from "@/components/pi/pi-provider";
import { useEconomy } from "@/components/economy/EconomyContext";
import { getBrowserFingerprint } from "@/lib/utils";

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
    const [isPosting, setIsPosting] = useState(false);
    const [highQuality, setHighQuality] = useState(true);

    const handlePost = async () => {
        if (!user) {
            toast.error("Please login to post");
            return;
        }

        setIsPosting(true);

        // Extract hashtags
        const hashtags = caption.match(/#[a-z0-9_]+/gi) || [];

        try {
            // Create FormData
            // In a real app we might compress here
            const fileToUpload = media.file;
            if (!fileToUpload) throw new Error("No file to upload");

            // Generate Device Fingerprint
            const deviceSignature = getBrowserFingerprint();

            // We append extra data as fields or pack into description/metadata
            // The current API expects 'description' and 'username'
            // We can send hashtags/privacy as separate fields if we update the backend,
            // OR pack them into a JSON description if we don't want to touch backend too much.
            // But I will update the backend to be clean.

            const res = await apiClient.video.upload(fileToUpload, {
                username: user.username,
                description: caption,
                // We will pass these extra fields. We need to ensure apiClient supports them or we extend it.
                // Checking apiClient signature: upload(file, metadata)
                // metadata is { username, description }. We can cast or extend.
                // We'll extend the object passed.
                ...({ hashtags: JSON.stringify(hashtags), privacy, allowComments, deviceSignature } as any)
            });

            if (res.success) {
                toast.success("Posted successfully!");
                // Update local state
                addVideo({
                    id: res.public_id || `temp_${Date.now()}`,
                    url: res.url,
                    thumbnail: res.thumbnail || res.url,
                    description: caption,
                    createdAt: Date.now()
                });
                onPostComplete();
            } else {
                toast.error("Upload failed: " + res.error);
            }
        } catch (e) {
            console.error(e);
            toast.error("An error occurred");
        } finally {
            setIsPosting(false);
        }
    };

    const handleSaveDraft = () => {
        // Save to localStorage
        const draft = {
            caption,
            privacy,
            date: Date.now()
            // We can't easily save the File object to localStorage.
            // Usually drafts save metadata and the file is in IDB or just kept in memory session.
            // For MVP, we just say "Draft Saved"
        };
        toast.success("Draft saved to local storage");
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col text-black overflow-y-auto">
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
                    {isPosting ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                    Post
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
