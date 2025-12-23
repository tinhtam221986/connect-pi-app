"use client";

import React, { useState, useEffect } from "react";
import { X, Send, User } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Comment {
    text: string;
    user: {
        username: string;
        avatar?: string;
    };
    createdAt: string;
}

interface CommentsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
    comments: Comment[];
    currentUser: any;
    onCommentAdded: (newComment: Comment) => void;
}

export function CommentsDrawer({ isOpen, onClose, videoId, comments, currentUser, onCommentAdded }: CommentsDrawerProps) {
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localComments, setLocalComments] = useState<Comment[]>(comments);

    useEffect(() => {
        setLocalComments(comments);
    }, [comments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser) return;

        setIsSubmitting(true);
        try {
            await apiClient.video.comment(
                videoId,
                commentText,
                currentUser.uid,
                currentUser.username,
                currentUser.avatar
            );

            const newComment: Comment = {
                text: commentText,
                user: {
                    username: currentUser.username,
                    avatar: currentUser.avatar
                },
                createdAt: new Date().toISOString()
            };

            onCommentAdded(newComment);
            setLocalComments(prev => [...prev, newComment]);
            setCommentText("");
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-md bg-zinc-900 border-t border-white/10 sm:rounded-xl sm:border flex flex-col h-[70vh] sm:h-[600px] shadow-2xl animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="font-bold text-white text-lg">Comments ({localComments.length})</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {localComments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                            <User size={48} strokeWidth={1} />
                            <p>No comments yet. Be the first!</p>
                        </div>
                    ) : (
                        localComments.map((comment, index) => (
                            <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0 border border-white/10">
                                    {comment.user.avatar ? (
                                        <img src={comment.user.avatar} alt={comment.user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-purple-500 to-pink-500">
                                            {comment.user.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-semibold text-gray-200">@{comment.user.username}</span>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 break-words leading-relaxed">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-zinc-900 pb-safe">
                    <div className="flex gap-2 items-center bg-zinc-800/50 rounded-full px-4 py-2 border border-white/5 focus-within:border-purple-500/50 transition-colors">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
                            disabled={!currentUser}
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim() || isSubmitting || !currentUser}
                            className={cn(
                                "p-2 rounded-full text-purple-500 transition-all",
                                commentText.trim() && !isSubmitting ? "hover:bg-purple-500/20 opacity-100 scale-110" : "opacity-50"
                            )}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
