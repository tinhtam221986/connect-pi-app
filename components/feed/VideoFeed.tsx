"use client";

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { Heart, MessageCircle, Share2, Gift } from 'lucide-react';

export function VideoFeed() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center h-full bg-background text-foreground">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
              <p className="mt-4 text-primary font-bold animate-pulse">Loading Cyber Feed...</p>
          </div>
      );
  }

  if (videos.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full bg-background text-muted-foreground">
              <p>No videos found in the Matrix.</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary/20 text-primary border border-primary/50 rounded-lg hover:bg-primary/40 transition-colors">
                  Refresh Signal
              </button>
          </div>
      );
  }

  return (
    <div className="w-full h-full bg-black flex flex-col items-center relative overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
      {videos.map((video, i) => (
        <VideoItem key={video.id || i} video={video} />
      ))}
    </div>
  );
}

function VideoItem({ video }: { video: any }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const isImage = video.resource_type === 'image';

    const togglePlay = () => {
        if (isImage) return;
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="w-full h-[100dvh] snap-start relative flex items-center justify-center bg-black">
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
                    onClick={togglePlay}
                    className="w-full h-full object-cover"
                    poster={video.thumbnail}
                />
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

            {/* Play Indicator */}
            {!isImage && !isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                    </div>
                </div>
            )}

            {/* Right Action Bar (Modified as per requirements) */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-20">
                {/* Avatar (Part of actions now?) Usually Avatar is separate, but keeping here for alignment if desired.
                    User asked for: Heart, Comment, Gift, Share vertically.
                    Let's keep Avatar above Heart or separate. Typically Avatar is bottom-left or above Heart.
                    I'll place Avatar above Heart for standard feel, but distinct.
                */}

                <div className="flex flex-col items-center mb-4">
                     <div className="w-10 h-10 rounded-full border border-white p-[1px]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`} className="w-full h-full rounded-full bg-black" alt="avatar" />
                    </div>
                    {/* Plus Icon small */}
                    <div className="w-4 h-4 bg-pink-500 rounded-full -mt-2 flex items-center justify-center text-[10px] text-white font-bold">+</div>
                </div>

                {/* HEART */}
                <button className="flex flex-col items-center gap-1 group">
                    <Heart className="w-8 h-8 text-white stroke-[1.5px] group-active:text-red-500 group-active:fill-red-500 transition-colors drop-shadow-md" />
                    <span className="text-[10px] font-bold text-white drop-shadow-md">{video.likes || "1.2k"}</span>
                </button>

                {/* COMMENT */}
                <button className="flex flex-col items-center gap-1 group">
                    <MessageCircle className="w-8 h-8 text-white stroke-[1.5px] group-active:text-blue-400 transition-colors drop-shadow-md" />
                    <span className="text-[10px] font-bold text-white drop-shadow-md">{video.comments || "342"}</span>
                </button>

                 {/* GIFT (New) */}
                 <button className="flex flex-col items-center gap-1 group">
                    <Gift className="w-8 h-8 text-white stroke-[1.5px] group-active:text-yellow-400 transition-colors drop-shadow-md" />
                    <span className="text-[10px] font-bold text-white drop-shadow-md">Gift</span>
                </button>

                {/* SHARE */}
                <button className="flex flex-col items-center gap-1 group">
                    <Share2 className="w-8 h-8 text-white stroke-[1.5px] group-active:text-green-400 transition-colors drop-shadow-md" />
                    <span className="text-[10px] font-bold text-white drop-shadow-md">Share</span>
                </button>

                {/* Disc Animation (Bottom of stack) */}
                <div className="mt-4 w-10 h-10 bg-black rounded-full border-4 border-[#111] flex items-center justify-center animate-spin-slow">
                     <div className="w-5 h-5 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full" />
                </div>
            </div>

            {/* Bottom Info (Left aligned, clean) */}
            <div className="absolute left-4 bottom-20 right-20 z-10 text-left pointer-events-none">
                <h3 className="font-bold text-white text-base drop-shadow-md mb-1">@{video.username || 'User'}</h3>
                <p className="text-sm text-white/90 line-clamp-2 drop-shadow-md mb-2">{video.description}</p>

                {/* Music Scroller */}
                <div className="flex items-center gap-2">
                     <div className="text-xs text-white/80 flex items-center gap-2 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                        <span>🎵 Original Sound - {video.username}</span>
                     </div>
                </div>
            </div>
        </div>
    );
}
