"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export function CommentsDrawer({ isOpen, onClose, videoId, comments: initialComments, currentUser, onCommentAdded }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight });
      }, 100);
    }
  }, [isOpen, comments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) return toast.error("Please login to comment.");

    setIsPosting(true);
    try {
      const commentData = {
        videoId,
        userId: currentUser.uid,
        username: currentUser.username,
        text: newComment,
        avatar: currentUser.avatar
      };

      const savedComment = await apiClient.video.comment(commentData);

      setComments(prev => [...prev, savedComment]);
      onCommentAdded(savedComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[75dvh] bg-white/20 backdrop-blur-xl border-t-2 border-white/30 text-black flex flex-col rounded-t-2xl"
      >
        <SheetHeader className="text-center relative py-4">
          <SheetTitle className="text-black font-bold text-lg">Comments ({comments.length})</SheetTitle>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full text-black hover:bg-white/20" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </SheetHeader>

        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-4 no-scrollbar">
          {comments.length > 0 ? comments.map((comment, index) => (
            <div key={comment._id || index} className="flex items-start gap-3">
              <Avatar className="w-10 h-10 border-2 border-gray-500/50">
                <AvatarImage src={comment.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`} />
                <AvatarFallback>{comment.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-black/10 p-3 rounded-lg">
                <p className="font-bold text-sm text-gray-800">@{comment.username}</p>
                <p className="text-black/90 text-base">{comment.text}</p>
              </div>
            </div>
          )) : (
            <div className="text-center text-gray-700 pt-10">
              <p>No comments yet.</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          )}
        </div>

        <SheetFooter className="p-4 bg-white/10 border-t border-white/20">
          <div className="flex items-center gap-2 w-full">
            <Avatar className="w-10 h-10">
              <AvatarImage src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`} />
              <AvatarFallback>{currentUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/30 border-2 border-gray-500/50 rounded-full resize-none text-black placeholder:text-gray-700 focus:ring-purple-500 focus:border-purple-500"
              rows={1}
            />
            <button
              onClick={handleSubmitComment}
              disabled={isPosting}
              className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
