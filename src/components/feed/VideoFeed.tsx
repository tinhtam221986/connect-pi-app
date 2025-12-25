"use client";

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { Heart, MessageCircle, Share2, Bookmark, Plus, Volume2, VolumeX, Play, Search, User, ChevronLeft, Music2, Disc, Globe, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { usePi } from '@/components/pi/pi-provider';
import { cn } from '@/lib/utils';
import { CommentsDrawer } from './CommentsDrawer';
import { DraggableAI } from './DraggableAI';
import { ReactionPicker } from './ReactionPicker';
import { useRouter } from 'next/navigation';

interface VideoFeedProps {
    onNavigate?: (tab: string) => void;
}

export function VideoFeed({ onNavigate }: VideoFeedProps) {
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
                    onNavigate={onNavigate}
                />
            ))}
        </div>
    </div>
  );
}

function VideoItem({ video, isActive, index, onNavigate }: { video: any, isActive: boolean, index: number, onNavigate?: (tab: string) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const { user } = usePi();

    // Safety check for array type
    const likesArray = Array.isArray(video.likes) ? video.likes : [];

    // Audio State: "Sound First" Strategy
    // Start unmuted (false). If autoplay fails, we set to true.
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showUnmuteOverlay, setShowUnmuteOverlay] = useState(false);

    // Interaction State
    const [likes, setLikes] = useState(likesArray.length);
    const [hasLiked, setHasLiked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false); // Local state for follow button

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

    // Auto Play/Pause based on active state with Sound First logic
    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            // Attempt to play with sound first
            videoRef.current.muted = false;
            setIsMuted(false);

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                    setShowUnmuteOverlay(false);
                }).catch((error) => {
                    console.log("Autoplay with sound blocked, falling back to muted:", error);
                    // Fallback: Mute and try again
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        setIsMuted(true);
                        setShowUnmuteOverlay(true);
                        videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Muted autoplay failed", e));
                    }
                });
            }
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Reset
            setIsPlaying(false);
            setShowUnmuteOverlay(false); // Reset overlay
        }
    }, [isActive]);

    // Update muted state on video element when state changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Single Tap: Toggle Play/Pause (User Requirement)
    const handleVideoClick = () => {
        if (isImage) return;
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleDiscClick = () => {
        // Tier 1 (Disc): spins, links to /create
        router.push('/create');
    };

    const handleCreateClick = () => {
         router.push('/create');
    };

    // Mute Toggle (Overlay or Button)
    const toggleMute = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsMuted(!isMuted);
        if (isMuted) setShowUnmuteOverlay(false);
    };

    // Double Tap: Like
    const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        handleLike('like');
        toast("❤️ Liked!", { position: 'top-center', duration: 800 });
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
            setLikes((prev: number) => hasLiked ? prev : prev + 1); // Increment only if not already liked
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

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? "Unfollowed" : "Following!");
    };

    const handleNavigate = (path: string) => {
        if (path === 'create') {
            router.push('/create');
        } else if (onNavigate) {
            onNavigate(path);
        }
    };

    const onCommentAdded = (newComment: any) => {
        setCommentCount((prev: number) => prev + 1);
        setCommentsList(prev => [...prev, newComment]);
    };

    return (
        <div
            className="video-item-container w-full h-[100dvh] snap-start relative flex items-center justify-center bg-black shrink-0"
            data-index={index}
            onDoubleClick={handleDoubleTap}
        >
            {/* --- TOP HEADER (ABSOLUTE OVERLAY) --- */}
            <div className="absolute top-0 left-0 right-0 z-40 pt-safe px-4 flex items-center justify-between pointer-events-none">
                {/* Left: Back Button (Reload) */}
                <button
                    onClick={() => window.location.reload()}
                    className="pointer-events-auto p-2 active:scale-90 transition-transform"
                >
                    <ChevronLeft className="w-8 h-8 text-white drop-shadow-md" />
                </button>

                {/* Center: Tabs */}
                <div className="flex items-center gap-4 pointer-events-auto">
                    <button className="text-white font-bold text-base border-b-2 border-white drop-shadow-md">
                        Dành cho bạn
                    </button>
                    <button className="text-white/70 font-medium text-base drop-shadow-md hover:text-white transition-colors">
                        Khám phá
                    </button>
                </div>

                {/* Right: Search & Profile */}
                <div className="flex items-center gap-3 pointer-events-auto">
                     <button className="p-2 active:scale-90 transition-transform">
                        <Search className="w-6 h-6 text-white drop-shadow-md" />
                     </button>
                     <button
                        onClick={() => handleNavigate('profile')}
                        className="p-2 active:scale-90 transition-transform"
                     >
                         {/* Using user avatar if available, else standard icon */}
                         {user?.avatar ? (
                             <img src={user.avatar} className="w-8 h-8 rounded-full border border-white" alt="Profile" />
                         ) : (
                             <User className="w-7 h-7 text-white drop-shadow-md" />
                         )}
                     </button>
                </div>
            </div>

            {/* --- MEDIA PLAYER --- */}
            {isImage ? (
                <img
                    src={video.url}
                    className="w-full h-full object-contain bg-black"
                    alt={video.description}
                    onDoubleClick={handleDoubleTap}
                />
            ) : (
                <video
                    ref={videoRef}
                    src={video.url}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    onClick={handleVideoClick}
                    onDoubleClick={handleDoubleTap}
                    className="w-full h-full object-cover"
                    poster={video.thumbnail}
                />
            )}

            {/* Tap to Unmute Overlay */}
            {showUnmuteOverlay && isActive && !isImage && (
                 <div
                    onClick={toggleMute}
                    className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-[1px] cursor-pointer"
                 >
                    <div className="bg-black/60 px-4 py-2 rounded-full flex items-center gap-2 animate-bounce">
                        <VolumeX className="w-5 h-5 text-white" />
                        <span className="text-white font-bold text-sm">TAP TO UNMUTE</span>
                    </div>
                 </div>
            )}

            {/* Play/Pause Indicator (Overlay) */}
            {!isPlaying && !isImage && !showUnmuteOverlay && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-8 h-8 text-white/90 ml-1 drop-shadow-lg" fill="currentColor" />
                    </div>
                </div>
            )}

            {/* --- RIGHT SIDEBAR STACK (Vertical) --- */}
            <div className="absolute right-2 bottom-32 flex flex-col items-center gap-5 z-30 pb-safe">
                 {/* 1. Like */}
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
                        className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
                    >
                        <Heart
                            className={cn(
                                "w-8 h-8 text-white stroke-[2px] drop-shadow-lg filter",
                                hasLiked && "fill-red-500 text-red-500"
                            )}
                        />
                        <span className="text-[12px] font-bold text-white drop-shadow-md">{likes}</span>
                    </button>
                </div>

                {/* 2. Comment */}
                <button onClick={handleComment} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
                    <MessageCircle className="w-8 h-8 text-white stroke-[2px] drop-shadow-lg" />
                    <span className="text-[12px] font-bold text-white drop-shadow-md">{commentCount}</span>
                </button>

                {/* 3. Share */}
                <button className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
                    <Share2 className="w-8 h-8 text-white stroke-[2px] drop-shadow-lg" />
                    <span className="text-[12px] font-bold text-white drop-shadow-md">Share</span>
                </button>

                {/* 4. Save */}
                <button className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
                    <Bookmark className="w-8 h-8 text-white stroke-[2px] drop-shadow-lg" />
                    <span className="text-[12px] font-bold text-white drop-shadow-md">Save</span>
                </button>

                {/* 5. Create Button (+) - Bottom of Right Stack */}
                <button
                    onClick={handleCreateClick}
                    className="mt-2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 active:scale-90 transition-transform"
                >
                    <Plus className="w-6 h-6 text-white drop-shadow-md" />
                </button>
            </div>

            {/* --- BOTTOM RIGHT: Spinning Disc --- */}
            <div className="absolute right-3 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-30">
                 <button
                    onClick={handleDiscClick}
                    className="w-12 h-12 rounded-full overflow-hidden border-[3px] border-black/50 animate-[spin_5s_linear_infinite]"
                 >
                    <div className="w-full h-full bg-gradient-to-tr from-gray-800 to-black flex items-center justify-center">
                        <Disc className="w-8 h-8 text-white/80" />
                    </div>
                 </button>
                 <div className="absolute -bottom-2 -right-1">
                      <Music2 className="w-4 h-4 text-white drop-shadow-md animate-bounce" />
                 </div>
            </div>

            {/* --- BOTTOM LEFT: 3-Tier Cluster --- */}
            <div className="absolute left-3 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20 text-left pointer-events-none pb-safe max-w-[70%]">

                {/* Tier 1: Username */}
                 <div className="flex items-center gap-2 mb-1 pointer-events-auto">
                     <h3 className="font-bold text-white text-lg drop-shadow-md leading-tight">
                         @{video.username || 'User'}
                     </h3>
                     {/* Follow Button (Small Pill) */}
                     <button
                        onClick={handleFollow}
                        className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border",
                            isFollowing
                                ? "bg-transparent text-white border-white/50"
                                : "bg-transparent text-red-500 border-red-500 hover:bg-red-500/10"
                        )}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                 </div>

                {/* Tier 2: Description/Caption */}
                <p className="text-sm text-white/95 line-clamp-2 drop-shadow-md mb-3 leading-relaxed pointer-events-auto">
                    {video.description || video.caption}
                    <span className="font-bold text-white/80 ml-2">#connectpi</span>
                </p>

                {/* Tier 3: Action Buttons (Private Shop & Global Market) */}
                <div className="flex items-center gap-3 pointer-events-auto">
                     {/* Private Shop */}
                     <button
                        onClick={() => onNavigate?.('market') || toast.success(`Visiting @${video.username}'s shop...`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg backdrop-blur-sm transition-colors"
                     >
                        <ShoppingBag className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-100">Shop</span>
                     </button>

                     {/* Global Market */}
                     <button
                        onClick={() => onNavigate?.('market')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg backdrop-blur-sm transition-colors"
                     >
                        <Globe className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-purple-100">Market</span>
                     </button>
                </div>
            </div>

            {/* Note: Bottom Input Bar REMOVED per directive */}

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
