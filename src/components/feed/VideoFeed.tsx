"use client";

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { Heart, MessageCircle, Share2, Music2 } from 'lucide-react';

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
    <div className="w-full h-full bg-background flex flex-col items-center relative overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {videos.map((video, i) => (
        <VideoItem key={video.id || i} video={video} />
      ))}
    </div>
  );
}

function VideoItem({ video }: { video: any }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Auto-play when in view using Intersection Observer could be added here
    // For now, simple tap to play

    return (
        <div className="w-full h-[100dvh] snap-start relative flex items-center justify-center bg-black border-b border-white/5">
            {/* Video Player */}
            <video
                ref={videoRef}
                src={video.url}
                loop
                playsInline
                onClick={togglePlay}
                className="w-full h-full object-cover"
                poster={video.thumbnail}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

            {/* Play Button (if paused) */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                    </div>
                </div>
            )}

            {/* Right Action Bar */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10 pb-safe">
                <button className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 group-hover:border-primary/50 group-hover:scale-110 transition-all">
                        <Heart className="w-8 h-8 text-white group-hover:text-primary group-hover:fill-primary transition-colors" />
                    </div>
                    <span className="text-xs font-bold shadow-black drop-shadow-md">{video.likes || 0}</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 group-hover:border-secondary/50 group-hover:scale-110 transition-all">
                        <MessageCircle className="w-8 h-8 text-white group-hover:text-secondary transition-colors" />
                    </div>
                    <span className="text-xs font-bold shadow-black drop-shadow-md">{video.comments || 0}</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 group-hover:bg-white/10 transition-all">
                        <Share2 className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-bold shadow-black drop-shadow-md">Share</span>
                </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute left-4 bottom-24 right-16 z-10 pb-safe text-left">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`} className="w-full h-full rounded-full bg-black" alt="avatar" />
                    </div>
                    <span className="font-bold text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">@{video.username || 'User'}</span>
                </div>
                <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-md mb-2">{video.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                    <Music2 size={14} className="animate-spin-slow" />
                    <span className="truncate w-40">Original Sound - {video.username}</span>
                </div>
            </div>
        </div>
    );
}
