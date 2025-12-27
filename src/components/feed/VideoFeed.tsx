"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Music2, VolumeX, ShoppingCart, User, Plus, Home, Mail, ChevronUp, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { usePi } from '@/components/pi/pi-provider';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { CommentsDrawer } from './CommentsDrawer';
import { DraggableAI } from './DraggableAI';

// Main Component: Renders the feed container and manages video data
export function VideoFeed() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    loadFeed();

    const handleRefresh = () => {
        console.log("Feed refresh triggered");
        loadFeed();
    };
    window.addEventListener('feed-refresh', handleRefresh);
    return () => window.removeEventListener('feed-refresh', handleRefresh);
  }, []);

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

  if (loading) return <FeedSkeleton />;

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden">
      <DraggableAI />
      <div
        ref={feedRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
      >
        {videos.map((video, index) => (
          <VideoItem
            key={video._id || index}
            video={video}
            isActive={index === activeIndex}
            index={index}
          />
        ))}
        {videos.length === 0 && <EmptyFeedState onRefresh={() => window.location.reload()} />}
      </div>
    </div>
  );
}

// Child Component: Renders a single video item with all its UI overlays
function VideoItem({ video, isActive, index }: { video: any, isActive: boolean, index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes?.length || 0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const { user } = usePi();

  const isLongCaption = video.description && video.description.length > 30;
  const isImage = video.resourceType === 'image';
  const authorUsername = video.username || 'unknown';

  useEffect(() => {
    setHasLiked(user && video.likes?.includes(user.uid));
  }, [user, video.likes]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (isActive) {
      videoEl.muted = muted;
      videoEl.currentTime = 0;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (!videoEl.muted) {
            videoEl.muted = true;
            setMuted(true);
            videoEl.play().catch(e => console.error("Forced mute play failed", e));
          }
        });
      }
    } else {
      videoEl.pause();
    }
  }, [isActive, muted]);

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like");
    const newHasLiked = !hasLiked;
    setHasLiked(newHasLiked);
    setLikes(prev => newHasLiked ? prev + 1 : prev - 1);
    try {
      await apiClient.video.like(video._id, user.uid);
    } catch (error) {
      setHasLiked(!newHasLiked);
      setLikes(prev => !newHasLiked ? prev + 1 : prev - 1);
      toast.error("Like action failed. Please try again.");
    }
  };

  // This is now handled by the global layout, so we don't need a specific handler here.
  // const handleNavigate = (path: string) => router.push(path);

  return (
    <div className="video-snap-item w-full h-[100dvh] snap-start relative bg-black shrink-0" data-index={index}>
      {/* Media Player */}
      <MediaPlayer isImage={isImage} src={video.url} videoRef={videoRef} muted={muted} onToggleMute={() => setMuted(!muted)} />
      {muted && isActive && !isImage && <MuteIndicator />}

      {/* UI Overlay - Stretches to fill, uses justify-between to push content to edges */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 pt-safe pb-[110px] sm:pb-[120px] pointer-events-none">
        <div></div> {/* Top Spacer */}
        <div className="flex justify-between items-end w-full">
          {/* Left Cluster */}
          <LeftCluster
            authorUsername={authorUsername}
            avatarUrl={video.avatar}
            description={video.description}
            isLongCaption={isLongCaption}
            captionExpanded={captionExpanded}
            setCaptionExpanded={setCaptionExpanded}
          />
          {/* Right Cluster */}
          <RightCluster
            authorUsername={authorUsername}
            hasLiked={hasLiked}
            likes={likes}
            commentsCount={video.comments?.length || 0}
            onLike={handleLike}
            onComment={() => setCommentsOpen(true)}
          />
        </div>
      </div>

      <CommentsDrawer
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        videoId={video._id}
        comments={video.comments || []}
        currentUser={user}
        onCommentAdded={() => { /* Can add optimistic update logic here */ }}
      />
    </div>
  );
}

// --- UI Subcomponents for Readability ---

const LeftCluster = ({ authorUsername, avatarUrl, description, isLongCaption, captionExpanded, setCaptionExpanded }) => (
  <div className="flex flex-col gap-3 text-white max-w-[70%] pointer-events-auto">
    {/* Author Avatar and Name */}
    <Link href={`/app/profile/${authorUsername}`} className="flex items-center gap-3 active:scale-95 transition-transform">
      <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-700 shadow-lg">
        <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorUsername}`} className="w-full h-full object-cover" alt="avatar" />
      </div>
      <span className="font-bold text-lg drop-shadow-md">@{authorUsername}</span>
    </Link>

    {/* Video Caption with "xem thêm" */}
    <div className="text-white/95 text-sm drop-shadow-md">
      {isLongCaption && !captionExpanded
        ? <>{description.substring(0, 30)}... <span onClick={() => setCaptionExpanded(true)} className="font-bold text-white/80 cursor-pointer hover:underline">xem thêm</span></>
        : description
      }
    </div>

    {/* Spinning Music Disc and Sound Info */}
    <div className="flex items-center gap-2 mt-1">
      <div className="w-8 h-8 bg-gray-900/70 rounded-full flex items-center justify-center animate-spin-slow border-2 border-gray-600"><Music2 className="text-white w-4 h-4"/></div>
      <span className="text-white text-sm font-light drop-shadow-md truncate">Original Sound - @{authorUsername}</span>
    </div>
  </div>
);

const RightCluster = ({ authorUsername, hasLiked, likes, commentsCount, onLike, onComment }) => (
  <div className="flex flex-col items-center gap-5 pointer-events-auto">
    {/* NEW ORDER: Heart is at the top */}
    <button onClick={onLike} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
      <Heart className={cn("w-9 h-9 drop-shadow-lg", hasLiked ? "fill-red-500 text-red-500" : "text-white")} />
      <span className="text-xs font-bold">{likes}</span>
    </button>

    <button onClick={onComment} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
      <MessageCircle className="w-9 h-9 text-white drop-shadow-lg" />
      <span className="text-xs font-bold">{commentsCount}</span>
    </button>

    <button onClick={() => toast.info("Share feature coming soon!")} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
      <Share2 className="w-9 h-9 text-white drop-shadow-lg" />
    </button>

    <button onClick={() => toast.info("Save feature coming soon!")} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
      <Bookmark className="w-9 h-9 text-white drop-shadow-lg" />
    </button>

    {/* NEW ORDER: Yellow cart is at the bottom */}
    <Link href={`/app/profile/${authorUsername}/shop`} className="bg-yellow-400/20 p-3 rounded-full border-2 border-yellow-500 backdrop-blur-sm active:scale-90 transition-transform">
      <ShoppingCart className="w-8 h-8 text-yellow-400" />
    </Link>
  </div>
);

const MediaPlayer = ({ isImage, src, videoRef, muted, onToggleMute }) => (
  isImage ? (
    <img src={src} className="w-full h-full object-contain bg-black" alt="content" />
  ) : (
    <video ref={videoRef} src={src} className="w-full h-full object-cover" loop playsInline muted={muted} onClick={onToggleMute} />
  )
);

const MuteIndicator = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full pointer-events-none animate-pulse z-10">
    <VolumeX className="w-8 h-8 text-white" />
  </div>
);

const FeedSkeleton = () => (
  <div className="flex h-[100dvh] items-center justify-center bg-black text-white flex-col gap-4">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="animate-pulse text-sm">Loading Feed...</p>
  </div>
);

const EmptyFeedState = ({ onRefresh }) => (
  <div className="h-full flex flex-col items-center justify-center text-white/50">
    <p>No videos available.</p>
    <button onClick={onRefresh} className="mt-4 px-4 py-2 bg-white/10 rounded-full text-white text-sm">Refresh</button>
  </div>
);
