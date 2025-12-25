"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const { user } = usePi();

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
      <div className="absolute right-2 bottom-32 flex flex-col items-center gap-6 z-20 pb-safe">

        {/* Author Avatar (Navigates to Author Profile) */}
        <div className="relative mb-2">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-700 shadow-lg cursor-pointer active:scale-90 transition-transform">
               {video.username ? (
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`} className="w-full h-full" alt="avatar" />
               ) : (
                  <User className="w-6 h-6 m-2 text-white" />
               )}
            </div>
             {/* Follow Plus Icon */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-0.5 shadow-md">
                <Plus className="w-3 h-3 text-white" />
            </div>
        </div>

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
          <span className="text-white text-xs font-bold drop-shadow-md">Share</span>
        </button>

        {/* Save */}
        <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
          <Bookmark className="w-8 h-8 text-white drop-shadow-lg" />
          <span className="text-white text-xs font-bold drop-shadow-md">Save</span>
        </button>
      </div>

      {/* --- BOTTOM RIGHT: Disc (Functions as Create Button) --- */}
      <div className="absolute right-3 bottom-8 z-20 pb-safe">
         <div
            onClick={() => onNavigate?.('create')}
            className="w-12 h-12 rounded-full border-[3px] border-gray-800 bg-black animate-[spin_4s_linear_infinite] overflow-hidden cursor-pointer active:scale-90 transition-transform shadow-xl"
         >
             <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-gray-900 to-gray-700">
                <Music2 className="w-6 h-6 text-white" />
             </div>
         </div>
         {/* Floating "+" badge to indicate action */}
         <div className="absolute -top-2 -left-2 bg-pink-500 rounded-full p-1 shadow-md pointer-events-none">
            <Plus className="w-3 h-3 text-white" />
         </div>
      </div>

      {/* --- SUPERMARKET ICON (Next to Disc) --- */}
      {/* Moved slightly left to accommodate the Disc */}
      <div className="absolute right-16 bottom-8 z-20 pb-safe">
         <button className="flex flex-col items-center active:scale-90 transition-transform" onClick={() => onNavigate?.('market')}>
            <Store className="w-10 h-10 text-blue-400 drop-shadow-lg" />
            <span className="text-[10px] font-bold text-white bg-blue-600/80 px-1 rounded backdrop-blur-sm">Shop</span>
         </button>
      </div>

      {/* --- FLOATING CART (Left Side) --- */}
      {/* This is redundant with Shop button but requested in design */}
      <div className="absolute left-3 bottom-48 z-20">
         <button
            onClick={() => onNavigate?.('market')}
            className="bg-yellow-500/20 p-2 rounded-full border border-yellow-400 backdrop-blur-sm animate-bounce active:scale-90 transition-transform"
         >
            <ShoppingCart className="w-6 h-6 text-yellow-400" />
         </button>
      </div>

      {/* --- BOTTOM LEFT INFO --- */}
      <div className="absolute left-3 bottom-8 right-16 z-10 pb-safe flex flex-col items-start text-left max-w-[75%] pointer-events-none">
         {/* User Name Only (Avatar moved to sidebar) */}
         <div className="flex items-center gap-2 mb-2 pointer-events-auto">
             <span className="font-bold text-white text-lg drop-shadow-md">@{video.username}</span>
         </div>

         {/* Caption */}
         <div className="text-white/95 text-sm mb-2 drop-shadow-md line-clamp-2 pointer-events-auto">
            {video.description}
            <span className="font-bold text-white/80 ml-2 cursor-pointer hover:underline">xem thêm</span>
         </div>

         {/* Music Scrolling */}
         <div className="flex items-center gap-2 text-white/90 text-xs pointer-events-auto bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
            <Music2 className="w-3 h-3" />
            <div className="w-32 overflow-hidden whitespace-nowrap">
               <span className="animate-marquee inline-block">Original Sound - {video.username} • Connect Pi Music</span>
            </div>
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
