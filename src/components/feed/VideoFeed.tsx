"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Bookmark, Music2, VolumeX, ShoppingCart, Store, User, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePi } from '@/components/pi/pi-provider';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { CommentsDrawer } from './CommentsDrawer';
import { DraggableAI } from './DraggableAI';

export function VideoFeed({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const { user } = usePi();

  useEffect(() => {
    loadFeed();

    // Listen for global refresh event (from PostSettings)
    const handleRefresh = () => {
        console.log("Feed refresh triggered");
        loadFeed();
    };
    window.addEventListener('feed-refresh', handleRefresh);
    return () => window.removeEventListener('feed-refresh', handleRefresh);
  }, []);

  const loadFeed = async () => {
    try {
      // Don't set loading to true if we are just refreshing to avoid flash
      if (videos.length === 0) setLoading(true);
      const data = await apiClient.feed.get();
      if (Array.isArray(data)) setVideos(data);
    } catch (error) {
      console.error("Feed load failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.getAttribute('data-index')));
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = document.querySelectorAll('.video-snap-item');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [videos]);

  if (loading) return (
    <div className="flex h-[100dvh] items-center justify-center bg-black text-white flex-col gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse text-sm">Loading Feed...</p>
    </div>
  );

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden">
      <DraggableAI />

      {/* --- GLOBAL OVERLAY (Top) --- */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-safe p-4 flex justify-between items-start pointer-events-none">
          {/* Left: Brand/Logo (Optional) */}
          <div className="pointer-events-auto">
             {/* Can place live/search here */}
          </div>

          {/* Right: Profile Toggle (Watcher vs Author is handled in VideoItem, this is just Main App Nav) */}
          <button
             onClick={() => onNavigate?.('profile')}
             className="pointer-events-auto bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10"
          >
             {user?.avatar ? (
                 <img src={user.avatar} className="w-8 h-8 rounded-full" alt="Me" />
             ) : (
                 <User className="w-6 h-6 text-white" />
             )}
          </button>
      </div>

      {/* --- GLOBAL OVERLAY (Bottom Nav Replacement) --- */}
      {/* We place Home/Market/Create access here directly on the feed if we want "Overlay" style
          But since MainAppView handles tabs, we just ensure these buttons call onNavigate correctly
          and sit on top of the video.
      */}

      <div
        ref={feedRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
      >
        {videos.map((video, index) => (
          <VideoItem
            key={video.id || index}
            video={video}
            isActive={index === activeIndex}
            index={index}
            onNavigate={onNavigate}
          />
        ))}
        {videos.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white/50">
                <p>No videos available.</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                    Refresh
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

function VideoItem({ video, isActive, index, onNavigate }: { video: any, isActive: boolean, index: number, onNavigate?: (tab: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true); // Default muted for autoplay policy
  const [likes, setLikes] = useState(video.likes?.length || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { user } = usePi();

  const isLongCaption = video.description && video.description.length > 30;

  // Ensure we handle both resource_type (API) and resourceType (DB) if mixed
  const isImage = (video.resource_type === 'image' || video.resourceType === 'image');

  useEffect(() => {
    if (user && video.likes?.includes(user.uid)) {
      setHasLiked(true);
    }
  }, [user, video.likes]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.muted = muted;
      videoRef.current.playsInline = true;
      videoRef.current.currentTime = 0;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Auto-play policy failure is common. Mute and try again is the standard fix.
          if (!videoRef.current!.muted) {
               videoRef.current!.muted = true;
               setMuted(true);
               videoRef.current!.play().catch(e => console.error("Force mute play failed", e));
          }
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuteState = !muted;
      videoRef.current.muted = newMuteState;
      setMuted(newMuteState);
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like");

    // Optimistic Update
    const newHasLiked = !hasLiked;
    setHasLiked(newHasLiked);
    setLikes(prev => newHasLiked ? prev + 1 : prev - 1);

    try {
      await apiClient.video.like(video.id || video._id, user.uid);
    } catch (error) {
      // Revert if failed
      setHasLiked(!newHasLiked);
      setLikes(prev => !newHasLiked ? prev + 1 : prev - 1);
      toast.error("Like failed");
    }
  };

  return (
    <div className="video-snap-item w-full h-[100dvh] snap-start relative bg-black shrink-0" data-index={index}>
      {/* Media */}
      {isImage ? (
        <img src={video.url} className="w-full h-full object-contain bg-black" alt="content" />
      ) : (
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted={muted}
          onClick={toggleMute}
          // Ensure autoPlay is NOT set here to avoid conflict with IntersectionObserver,
          // but 'playsInline' is critical for iOS/Android WebViews
        />
      )}

      {/* Mute Indicator */}
      {muted && isActive && !isImage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full pointer-events-none animate-pulse z-10">
           <VolumeX className="w-8 h-8 text-white" />
        </div>
      )}

      {/* --- RIGHT SIDEBAR --- */}
      <div className="absolute right-2 bottom-40 flex flex-col items-center gap-6 z-20 pb-safe">
        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Heart className={cn("w-8 h-8 drop-shadow-lg transition-colors", hasLiked ? "fill-red-500 text-red-500" : "text-white")} />
          <span className="text-white text-xs font-bold drop-shadow-md">{likes}</span>
        </button>

        {/* Comment */}
        <button onClick={() => setCommentsOpen(true)} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <MessageCircle className="w-8 h-8 text-white drop-shadow-lg" />
          <span className="text-white text-xs font-bold drop-shadow-md">{video.comments?.length || 0}</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Share2 className="w-8 h-8 text-white drop-shadow-lg" />
        </button>

        {/* Save */}
        <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Bookmark className="w-8 h-8 text-white drop-shadow-lg" />
        </button>
      </div>

      {/* Upload Button (Position 1) - Separate for distinct styling */}
      <div className="absolute right-3 bottom-24 z-20 pb-safe">
        <button
          onClick={() => onNavigate?.('create')}
          className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-white bg-transparent active:bg-white/20 transition-all transform active:scale-90"
          aria-label="Upload Video"
        >
          <Plus className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* --- LEFT SIDEBAR (Info) --- */}
      <div className="absolute left-3 bottom-28 flex flex-col items-start gap-3 z-20 pb-safe max-w-[75%]">
        {/* Personal Store Icon (Position 8) */}
        <button className="flex flex-col items-center active:scale-90 transition-transform mb-2">
          <div className="bg-yellow-400/20 p-2 rounded-full border-2 border-yellow-500 backdrop-blur-sm">
             <ShoppingCart className="w-7 h-7 text-yellow-400" />
          </div>
        </button>

        {/* Author Avatar & Name */}
        <Link href={`/profile/${video.username || 'user'}`} className="relative group flex items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-700 shadow-lg cursor-pointer group-active:scale-90 transition-transform">
                {video.avatar ? (
                    <img src={video.avatar} className="w-full h-full object-cover" alt="avatar" />
                ) : video.username ? (
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`} className="w-full h-full" alt="avatar" />
                ) : (
                    <User className="w-full h-full p-2 text-white/50" />
                )}
            </div>
            <span className="font-bold text-white text-md drop-shadow-md">@{video.username}</span>
        </Link>

        {/* Caption (Position 7) */}
        <div
          className="text-white/95 text-sm drop-shadow-md pointer-events-auto p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10"
          onClick={() => setExpanded(prev => !prev)}
        >
            {isLongCaption && !expanded ? (
               <>
                  {video.description.substring(0, 30)}...
                  <span className="font-bold text-white/80 ml-2 cursor-pointer hover:underline">xem thêm</span>
               </>
            ) : (
               video.description
            )}
         </div>

        {/* Spinning Music Disc & Info (Position 5) */}
        <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 bg-gray-900/70 rounded-full flex items-center justify-center animate-spin-slow border-2 border-gray-600">
                <Music2 className="text-white w-3 h-3"/>
            </div>
            <span className="text-white text-sm font-light drop-shadow-md truncate">Original Sound - @{video.username}</span>
        </div>
      </div>

      <CommentsDrawer
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        videoId={video.id || video._id}
        comments={video.comments || []}
        currentUser={user}
        onCommentAdded={(c) => {
             // Local update for comments can be added here if we want immediate feedback
             // Currently relying on re-fetch or just visual append if we had the state lifted
        }}
      />
    </div>
  );
}
