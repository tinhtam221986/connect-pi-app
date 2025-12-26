"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Bookmark, Music2, VolumeX, ShoppingCart, User, Plus, Save } from 'lucide-react';
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
  const [muted, setMuted] = useState(true);
  const [likes, setLikes] = useState(video.likes?.length || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const { user } = usePi();

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

      {/* --- RIGHT SIDEBAR --- */}
      <div className="absolute right-2 bottom-[120px] flex flex-col items-center gap-6 z-20 pb-safe">
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

        {/* Upload Button - Floating */}
        <button
          onClick={() => onNavigate?.('create')}
          className="w-12 h-12 mt-2 flex items-center justify-center rounded-full border-2 border-white bg-black/20 backdrop-blur-sm shadow-lg active:bg-white/20 transition-all transform active:scale-90"
          aria-label="Upload Video"
        >
          <Plus className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* --- LEFT SIDEBAR (Info) --- */}
      <div className="absolute left-3 bottom-[120px] flex flex-col items-start gap-3 z-20 pb-safe max-w-[75%]">
        {/* Personal Store Icon */}
        <Link href={`/profile/${authorUsername}/shop`} className="flex flex-col items-center active:scale-90 transition-transform mb-2">
          <div className="bg-yellow-400/20 p-2 rounded-full border-2 border-yellow-500 backdrop-blur-sm">
             <ShoppingCart className="w-7 h-7 text-yellow-400" />
          </div>
        </Link>

        {/* Author Avatar & Name */}
        <Link href={`/profile/${authorUsername}`} className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-700 shadow-lg cursor-pointer group-active:scale-90 transition-transform">
                {video.avatar ? (
                    <img src={video.avatar} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authorUsername}`} className="w-full h-full" alt="avatar" />
                )}
            </div>
            <span className="font-bold text-white text-md drop-shadow-md">@{authorUsername}</span>
        </Link>

        {/* Caption */}
        <div className="pointer-events-auto">
          {renderCaption()}
        </div>

        {/* Spinning Music Disc */}
        <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 bg-gray-900/70 rounded-full flex items-center justify-center animate-spin-slow border-2 border-gray-600">
                <Music2 className="text-white w-3 h-3"/>
            </div>
            <span className="text-white text-sm font-light drop-shadow-md truncate">Original Sound - @{authorUsername}</span>
        </div>
      </div>

      {/* Expanded Caption Overlay */}
      {captionExpanded && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[rgba(245,210,147,0.7)] to-[rgba(255,255,255,0.4)] backdrop-blur-md z-30 p-4 pt-8 flex flex-col pb-safe"
          onClick={() => setCaptionExpanded(false)}
        >
          <div className="flex-grow overflow-y-auto text-black no-scrollbar p-2 rounded-lg bg-white/20">
            <p className="text-sm">{video.description}</p>
          </div>
          <button onClick={() => setCaptionExpanded(false)} className="mt-4 text-center text-sm font-bold text-black/70">
            Close
          </button>
        </div>
      )}

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
