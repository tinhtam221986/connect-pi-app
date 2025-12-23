"use client";

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { Heart, MessageCircle, Share2, Bookmark, Plus, ShoppingCart, Send, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { usePi } from '@/components/pi/pi-provider';
import { cn } from '@/lib/utils';
import { CommentsDrawer } from './CommentsDrawer';
import { DraggableAI } from './DraggableAI';
import { ReactionPicker } from './ReactionPicker';
import { TopNav } from './TopNav';
import { useRouter } from 'next/navigation';

export function VideoFeed() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await apiClient.feed.get();
        if (Array.isArray(data)) {
            setVideos(data);
        }
      } catch (e) {
        console.error("Feed load error", e);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  // Intersection Observer to detect current video
  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute('data-index'));
                    setCurrentVideoIndex(index);
                }
            });
        },
        {
            root: feedRef.current,
            threshold: 0.6 // 60% visibility required to be "active"
        }
    );

    const videoElements = document.querySelectorAll('.video-item-container');
    videoElements.forEach((el) => observer.observe(el));

    return () => {
        videoElements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
    };
  }, [videos]);

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center h-[100dvh] bg-background text-foreground">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
              <p className="mt-4 text-primary font-bold animate-pulse">Loading Cyber Feed...</p>
          </div>
      );
  }

  if (videos.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[100dvh] bg-background text-muted-foreground">
              <p>No videos found in the Matrix.</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary/20 text-primary border border-primary/50 rounded-lg hover:bg-primary/40 transition-colors">
                  Refresh Signal
              </button>
          </div>
      );
  }

  return (
    // Fixed: h-[100dvh] ensures full viewport height without gap
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden">
        {/* Absolute Top Navigation */}
        <TopNav />

        {/* Draggable AI Widget */}
        <DraggableAI />

        {/* Scrollable Feed */}
        <div
            ref={feedRef}
            className="w-full h-full flex flex-col items-center overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
        >
            {videos.map((video, i) => (
                <VideoItem
                    key={video.id || i}
                    video={video}
                    isActive={i === currentVideoIndex}
                    index={i}
                />
            ))}
        </div>
    </div>
  );
}

function VideoItem({ video, isActive, index }: { video: any, isActive: boolean, index: number }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const { user } = usePi();

    // Safety check for array type
    const likesArray = Array.isArray(video.likes) ? video.likes : [];

    const [isMuted, setIsMuted] = useState(true);
    const [likes, setLikes] = useState(likesArray.length);
    const [hasLiked, setHasLiked] = useState(false);

    // Comments state
    const [commentsOpen, setCommentsOpen] = useState(false);
    const commentsArray = Array.isArray(video.comments) ? video.comments : [];
    const [commentCount, setCommentCount] = useState(commentsArray.length);
    const [commentsList, setCommentsList] = useState<any[]>(commentsArray);

    // Reaction Picker State
    const [showReactions, setShowReactions] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const isImage = video.resource_type === 'image';

    // Initialize Like State on mount or when user changes
    useEffect(() => {
        if (user && user.uid && Array.isArray(video.likes)) {
            setHasLiked(video.likes.includes(user.uid));
        }
    }, [user, video.likes]);

    // Auto Play/Pause based on active state
    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            // Mobile browsers require mute for autoplay usually, but we start muted
            videoRef.current.muted = isMuted;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playing
                }).catch((error) => {
                    console.log("Autoplay blocked:", error);
                });
            }
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Reset
        }
    }, [isActive, isMuted]);

    const handleVideoClick = () => {
        if (isImage) return;
        if (!videoRef.current) return;

        const newMutedState = !isMuted;
        videoRef.current.muted = newMutedState;
        setIsMuted(newMutedState);

        // Visual feedback could be added here (big mute icon fade in/out)
        toast(newMutedState ? "Muted" : "Unmuted", {
            duration: 1000,
            position: 'top-center',
            icon: newMutedState ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />
        });
    };

    const handleLike = async (reactionType: string = 'like') => {
        if (!user) {
            toast.error("Please login to like");
            return;
        }

        // If simple toggle (standard like)
        if (reactionType === 'like' && !showReactions) {
             // Optimistic UI update
            if (hasLiked) {
                setLikes((prev: number) => prev - 1);
                setHasLiked(false);
            } else {
                setLikes((prev: number) => prev + 1);
                setHasLiked(true);
            }

            try {
                await apiClient.video.like(video.id || video._id, user.uid);
            } catch (error) {
                console.error("Like failed", error);
                // Revert
                if (hasLiked) {
                    setLikes((prev: number) => prev + 1);
                    setHasLiked(true);
                } else {
                    setLikes((prev: number) => prev - 1);
                    setHasLiked(false);
                }
            }
        } else {
            // Reaction picked
            setHasLiked(true); // Always set to liked if reaction picked
            setLikes(prev => hasLiked ? prev : prev + 1); // Increment only if not already liked
            setShowReactions(false);
            try {
                 await apiClient.video.like(video.id || video._id, user.uid);
            } catch (e) { console.error(e) }
        }
    };

    // Long Press Handlers
    const handleLikePressStart = () => {
        longPressTimer.current = setTimeout(() => {
            setShowReactions(true);
        }, 500); // 500ms for long press
    };

    const handleLikePressEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    const handleComment = () => {
         setCommentsOpen(true);
    };

    const handleShopClick = () => {
        const products = video.products || [];
        if (products.length > 0) {
            toast.success(`Found ${products.length} tagged products!`);
            // Future: Open Product Drawer
        } else {
            toast.info("No products tagged in this video.");
        }
    };

    const handleCreatePost = () => {
        router.push('/create');
    };

    const onCommentAdded = (newComment: any) => {
        setCommentCount((prev: number) => prev + 1);
        setCommentsList(prev => [...prev, newComment]);
    };

    return (
        <div
            className="video-item-container w-full h-[100dvh] snap-start relative flex items-center justify-center bg-black shrink-0"
            data-index={index}
        >
            {/* Media Player */}
            {isImage ? (
                <img
                    src={video.url}
                    className="w-full h-full object-contain bg-black"
                    alt={video.description}
                />
            ) : (
                <video
                    ref={videoRef}
                    src={video.url}
                    loop
                    playsInline
                    muted={isMuted} // Initial state
                    onClick={handleVideoClick}
                    className="w-full h-full object-cover"
                    poster={video.thumbnail}
                />
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

            {/* Left Action: Shop */}
            <div className="absolute left-4 bottom-40 z-20 pb-safe">
                <button
                    onClick={handleShopClick}
                    className="flex flex-col items-center gap-1 group"
                >
                    <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-yellow-500/50 flex items-center justify-center animate-pulse">
                         <ShoppingCart className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow-md bg-black/30 px-2 rounded-full">Shop</span>
                </button>
            </div>

            {/* Right Action Bar (Vertical) */}
            <div className="absolute right-2 bottom-32 flex flex-col items-center gap-5 z-20 pb-safe">
                {/* 1. Avatar */}
                <div className="flex flex-col items-center relative">
                     <div className="w-12 h-12 rounded-full border-2 border-white p-[1px]">
                        <img src={video.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`} className="w-full h-full rounded-full bg-black object-cover" alt="avatar" />
                    </div>
                    {/* Follow Plus (moved to Avatar as standard, but user asked for Create Button at bottom. Usually Follow is here) */}
                    <div className="w-5 h-5 bg-red-500 rounded-full -mt-3 flex items-center justify-center text-white font-bold text-xs border border-black">+</div>
                </div>

                {/* 2. Like (with Reaction Picker) */}
                <div className="relative flex flex-col items-center gap-1">
                    <ReactionPicker
                        isVisible={showReactions}
                        onSelect={(id) => handleLike(id)}
                        onClose={() => setShowReactions(false)}
                    />
                    <button
                        onMouseDown={handleLikePressStart}
                        onMouseUp={handleLikePressEnd}
                        onTouchStart={handleLikePressStart}
                        onTouchEnd={handleLikePressEnd}
                        onClick={() => handleLike('like')}
                        className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                    >
                        <Heart
                            className={cn(
                                "w-8 h-8 text-white stroke-[2px] drop-shadow-lg filter",
                                hasLiked && "fill-red-500 text-red-500"
                            )}
                        />
                        <span className="text-[11px] font-bold text-white drop-shadow-md">{likes}</span>
                    </button>
                </div>

                {/* 3. Comment */}
                <button onClick={handleComment} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
                    <MessageCircle className="w-8 h-8 text-white stroke-[2px] drop-shadow-lg" />
                    <span className="text-[11px] font-bold text-white drop-shadow-md">{commentCount}</span>
                </button>

                {/* 4. Share */}
                <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
                    <Share2 className="w-8 h-8 text-white stroke-[2px] drop-shadow-lg" />
                    <span className="text-[11px] font-bold text-white drop-shadow-md">Share</span>
                </button>

                {/* 5. Save */}
                <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
                    <Bookmark className="w-8 h-8 text-white stroke-[2px] drop-shadow-lg" />
                    <span className="text-[11px] font-bold text-white drop-shadow-md">Save</span>
                </button>

                {/* 6. Create Post Button (Requested Location) */}
                <button
                    onClick={handleCreatePost}
                    className="mt-2 w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 active:scale-90 transition-transform"
                >
                    <Plus className="w-6 h-6 text-white" />
                </button>

                {/* Disc Animation (Bottom of stack) */}
                <div className="mt-2 w-10 h-10 bg-black rounded-full border-[3px] border-zinc-800 flex items-center justify-center animate-spin-slow overflow-hidden">
                     <img
                        src={video.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`}
                        className="w-full h-full object-cover opacity-80"
                     />
                </div>
            </div>

            {/* Bottom Info Area */}
            <div className="absolute left-4 bottom-24 right-20 z-10 text-left pointer-events-none pb-safe">
                <h3 className="font-bold text-white text-base drop-shadow-md mb-1">@{video.username || 'User'}</h3>
                <p className="text-sm text-white/90 line-clamp-2 drop-shadow-md mb-2">{video.description || video.caption}</p>

                {/* Music Scroller */}
                <div className="flex items-center gap-2">
                     <div className="text-xs text-white/80 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <Volume2 className="w-3 h-3" />
                        <span>Original Sound - {video.username}</span>
                     </div>
                </div>
            </div>

            {/* Persistent Bottom Comment Bar */}
            <div
                className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pb-[calc(env(safe-area-inset-bottom)+4rem)]" // Padding bottom to clear Nav
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 w-full max-w-md mx-auto">
                    <button
                        onClick={handleComment}
                        className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full h-10 px-4 flex items-center text-white/60 text-sm transition-colors border border-white/10"
                    >
                        Bình luận...
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        @
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        🙂
                    </button>
                </div>
            </div>

            <CommentsDrawer
                isOpen={commentsOpen}
                onClose={() => setCommentsOpen(false)}
                videoId={video.id || video._id}
                comments={commentsList}
                currentUser={user}
                onCommentAdded={onCommentAdded}
            />
        </div>
    );
}
