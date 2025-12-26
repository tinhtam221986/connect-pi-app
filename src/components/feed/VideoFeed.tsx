"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Bookmark, Music2, VolumeX, ShoppingCart, User, Plus, Save, Home, Mail, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { usePi } from '@/components/pi/pi-provider';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { CommentsDrawer } from './CommentsDrawer';
import { DraggableAI } from './DraggableAI';

export function VideoFeed() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const { user } = usePi();

  useEffect(() => {
    loadFeed();

    const handleRefresh = () => {
        console.log("Feed refresh triggered");
        loadFeed();
    };
    window.addEventListener('feed-refresh', handleRefresh);
    return () => window.removeEventListener('feed-refresh', handleRefresh);
  }, []);

  const loadFeed = async () => {
    try {
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

function VideoItem({ video, isActive, index }: { video: any, isActive: boolean, index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [likes, setLikes] = useState(video.likes?.length || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const { user } = usePi();

  // State for new UI elements
  const [navVisible, setNavVisible] = useState(true);
  const [captionExpanded, setCaptionExpanded] = useState(false);

  const isLongCaption = video.description && video.description.length > 30;
  const isImage = (video.resource_type === 'image' || video.resourceType === 'image');
  const authorUsername = video.username || 'unknown';

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
    const newHasLiked = !hasLiked;
    setHasLiked(newHasLiked);
    setLikes(prev => newHasLiked ? prev + 1 : prev - 1);
    try {
      await apiClient.video.like(video.id || video._id, user.uid);
    } catch (error) {
      setHasLiked(!newHasLiked);
      setLikes(prev => !newHasLiked ? prev + 1 : prev - 1);
      toast.error("Like failed");
    }
  };

  const renderCaption = () => {
    if (!video.description) return null;

    if (isLongCaption && !captionExpanded) {
      return (
        <p onClick={() => setCaptionExpanded(true)} className="text-white/95 text-sm drop-shadow-md">
          {video.description.substring(0, 30)}...
          <span className="font-bold text-white/80 ml-2 cursor-pointer hover:underline">xem thêm</span>
        </p>
      );
    }
    return <p className="text-white/95 text-sm drop-shadow-md">{video.description}</p>;
  };

  const router = useRouter();

  const handleNavigate = (path: string) => router.push(path);

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
        />
      )}

      {/* Mute Indicator */}
      {muted && isActive && !isImage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full pointer-events-none animate-pulse z-10">
           <VolumeX className="w-8 h-8 text-white" />
        </div>
      )}

      {/* --- UI Overlay --- */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 pt-safe pb-safe">
        {/* Top Section is empty for immersive view */}
        <div></div>

        {/* Bottom Section */}
        <div className="flex justify-between items-end">
          {/* Left Info Cluster */}
          <div className="flex flex-col gap-3 text-white max-w-[75%]">
            <Link href={`/profile/${authorUsername}`} className="flex items-center gap-3 active:scale-95 transition-transform">
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-700 shadow-lg">
                    <img src={video.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorUsername}`} className="w-full h-full object-cover" alt="avatar" />
                </div>
                <span className="font-bold text-lg drop-shadow-md">@{authorUsername}</span>
            </Link>

            {/* CORRECTED CAPTION LOGIC */}
            <div className="pointer-events-auto">
              <p className="text-white/95 text-sm drop-shadow-md">
                {isLongCaption && !captionExpanded
                  ? <>{video.description.substring(0, 30)}... <span onClick={() => setCaptionExpanded(true)} className="font-bold text-white/80 cursor-pointer hover:underline">xem thêm</span></>
                  : video.description
                }
              </p>
            </div>

            {/* Horizontal Nav buttons & Music */}
            <div className={cn("flex items-center gap-4 transition-all duration-300", navVisible ? "opacity-100" : "opacity-0 -translate-x-4 pointer-events-none")}>
                <Link href="/" className="flex items-center gap-2 p-2 rounded-lg bg-black/20 backdrop-blur-sm">
                    <Home className="w-5 h-5" />
                </Link>
                 <Link href="/market" className="flex items-center gap-2 p-2 rounded-lg bg-black/20 backdrop-blur-sm">
                    <ShoppingCart className="w-5 h-5" />
                </Link>
                 <Link href="/inbox" className="flex items-center gap-2 p-2 rounded-lg bg-black/20 backdrop-blur-sm relative">
                    <Mail className="w-5 h-5" />
                    {/* Notification Dot */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></div>
                </Link>
            </div>

             {/* Spinning Music Disc */}
            <div className="flex items-center gap-2 mt-1">
                <div className="w-8 h-8 bg-gray-900/70 rounded-full flex items-center justify-center animate-spin-slow border-2 border-gray-600">
                    <Music2 className="text-white w-4 h-4"/>
                </div>
                <span className="text-white text-sm font-light drop-shadow-md truncate">Original Sound - @{authorUsername}</span>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex flex-col items-center gap-5">
            <Link href={`/profile/${authorUsername}/shop`} className="bg-yellow-400/20 p-3 rounded-full border-2 border-yellow-500 backdrop-blur-sm active:scale-90 transition-transform">
                <ShoppingCart className="w-8 h-8 text-yellow-400" />
            </Link>
            <button onClick={handleLike} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
              <Heart className={cn("w-9 h-9 drop-shadow-lg", hasLiked ? "fill-red-500 text-red-500" : "text-white")} />
              <span className="text-xs font-bold">{likes}</span>
            </button>
            <button onClick={() => setCommentsOpen(true)} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
              <MessageCircle className="w-9 h-9 text-white drop-shadow-lg" />
              <span className="text-xs font-bold">{video.comments?.length || 0}</span>
            </button>
            <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
              <Share2 className="w-9 h-9 text-white drop-shadow-lg" />
            </button>

            {/* New Bottom Nav - Combined */}
            <div className="flex items-end gap-2">
                <Link href="/upload" aria-label="Upload Video" className="w-[4.5rem] h-[4.5rem] flex items-center justify-center rounded-full bg-white active:bg-gray-200 transition-all transform active:scale-90 shadow-lg">
                  <Plus className="w-12 h-12 text-black" />
                </Link>
                <button onClick={() => setNavVisible(!navVisible)} className="p-2">
                    <ChevronUp className={cn("w-6 h-6 text-white transition-transform duration-300", navVisible && "rotate-180")} />
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Drawer */}
      <CommentsDrawer
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        videoId={video.id || video._id}
        comments={video.comments || []}
        currentUser={user}
        onCommentAdded={(c) => {}}
      />
    </div>
  );
}
