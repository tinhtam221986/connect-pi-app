"use client";

import React, { useState } from "react";
import { CreateContextState } from "./CreateFlow";
import { Loader2, Lock, Globe, Users, Hash, MapPin, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { usePi } from "@/components/pi/pi-provider";
import { useEconomy } from "@/components/economy/EconomyContext";
import { getBrowserFingerprint } from "@/lib/utils";
import { saveDraft } from "@/lib/drafts";

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

            const res = await apiClient.video.upload(fileToUpload, {
                username: user.username,
                description: caption,
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
        <div className="h-full bg-background flex flex-col text-foreground overflow-y-auto">
            {/* Header */}
            <div className="pt-safe pb-4 px-4 bg-background/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center sticky top-0 z-50">
                <button onClick={onPostComplete} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium w-16 text-left">Cancel</button>
                <h2 className="font-bold text-lg neon-text flex-1 text-center truncate">Post</h2>
                <div className="w-16"></div> {/* Spacer for balance */}
            </div>

            <div className="p-4 flex gap-4 bg-card border border-white/5 rounded-lg mx-4 mt-4 mb-4">
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
                        className="w-full h-full resize-none outline-none bg-transparent text-sm p-2 text-foreground placeholder:text-muted-foreground"
                     />
                 </div>
            </div>

            {/* Settings Group - Added margin-bottom to ensure content is not hidden by fixed footer */}
            <div className="bg-card mx-4 rounded-lg border border-white/5 p-4 space-y-6 mb-32">

                <div className="flex items-center gap-3 text-sm text-muted-foreground hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
                    <Hash size={20} className="text-primary" />
                    <span className="flex-1">Hashtags</span>
                    <button onClick={() => setCaption(prev => prev + " #Trending")} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">#Trending</button>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
                    <Users size={20} className="text-secondary" />
                    <span className="flex-1">Tag People</span>
                    <ArrowIcon />
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
                    <MapPin size={20} className="text-accent" />
                    <span className="flex-1">Location</span>
                    <ArrowIcon />
                </div>

                <div className="border-t border-white/10 my-4"></div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        {privacy === 'public' && <Globe size={18} />}
                        {privacy === 'friends' && <Users size={18} />}
                        {privacy === 'private' && <Lock size={18} />}
                        Who can watch this video
                    </div>
                    <select
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value as any)}
                        className="bg-transparent text-sm text-muted-foreground outline-none text-right [&>option]:bg-black"
                    >
                        <option value="public">Everyone</option>
                        <option value="friends">Friends</option>
                        <option value="private">Only Me</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">Allow Comments</div>
                    <input
                        type="checkbox"
                        checked={allowComments}
                        onChange={(e) => setAllowComments(e.target.checked)}
                        className="toggle accent-primary"
                    />
                </div>

                <div className="flex items-center justify-between">
                     <div className="text-sm font-medium text-foreground">High Quality Upload</div>
                     <input
                        type="checkbox"
                        checked={highQuality}
                        onChange={(e) => setHighQuality(e.target.checked)}
                        className="toggle accent-primary"
                    />
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur border-t border-white/10 flex gap-4 items-center pb-safe">
                 <button
                    onClick={handleSaveDraft}
                    className="flex-1 py-3 bg-muted text-muted-foreground font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                    <Save size={18} /> Drafts
                </button>
                 <button
                    onClick={handlePost}
                    disabled={isPosting}
                    className="flex-[2] py-3 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
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
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
