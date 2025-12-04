"use client";

import { apiClient } from "@/lib/api-client";
import { Heart, MessageCircle, Share2, Music2, Disc, Gift } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { useState, useEffect, useRef } from "react";
import { CommentsDrawer } from "./CommentsDrawer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function VideoFeed() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'foryou'|'following'>('foryou');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const data = await apiClient.feed.get();
        if (Array.isArray(data)) {
          setVideos(data);
        }
      } catch (err) {
        console.error("Error fetching feed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  if (loading) {
      return (
        <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white space-y-4">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
             <p className="animate-pulse text-sm text-purple-300">Loading your feed...</p>
        </div>
      );
  }

  return (
    <div className="h-full w-full relative bg-black">
        {/* Top Tabs */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex gap-4 text-sm font-bold drop-shadow-md">
            <button
                onClick={() => setTab('following')}
                className={cn("transition-colors duration-300 px-2", tab === 'following' ? "text-white border-b-2 border-white pb-1 scale-110" : "text-gray-400 hover:text-gray-200")}
            >
                Following
            </button>
            <span className="text-gray-600/50">|</span>
            <button
                 onClick={() => setTab('foryou')}
                 className={cn("transition-colors duration-300 px-2", tab === 'foryou' ? "text-white border-b-2 border-white pb-1 scale-110" : "text-gray-400 hover:text-gray-200")}
            >
                For You
            </button>
        </div>

        <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none">
          {videos.length > 0 ? (
              videos.map((video) => (
                <VideoPost key={video.id} video={video} />
              ))
          ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                  <p>No content available yet.</p>
                  <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700">Refresh</button>
              </div>
          )}
        </div>
    </div>
  );
}

function VideoPost({ video }: any) {
  const { t } = useLanguage();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: 0, y: 0 });
  const [likesCount, setLikesCount] = useState(video.likes || 0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
      if (videoRef.current) {
          if (isPlaying) {
              videoRef.current.pause();
          } else {
              videoRef.current.play();
          }
          setIsPlaying(!isPlaying);
      }
  }

  // Auto-play/pause based on visibility (Intersection Observer could be added here for optimization)

  const handleGift = () => {
      toast.success(`Sent 1 Pi to @${video.author}! 🎁`);
      // Trigger confetti or similar effect here
  }

  const handleShare = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: `Watch @${video.author} on CONNECT`,
                  text: video.description,
                  url: window.location.href // In a real app, this would be a deep link
              });
              toast.success("Shared successfully!");
          } catch (err) {
              console.log("Share cancelled");
          }
      } else {
          // Fallback
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
      }
  }

  const handleLike = () => {
      const newLikedState = !liked;
      setLiked(newLikedState);
      setLikesCount((prev: number) => newLikedState ? prev + 1 : prev - 1);
      // In a real app, call API here
  };

  const handleVideoClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastClickTime;

      if (timeDiff < 300) {
          // Double click detected
          if (!liked) {
              handleLike();
          }
          setShowHeart(true);
          // Calculate relative position for the heart
          const rect = e.currentTarget.getBoundingClientRect();
          setHeartPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
          });

          setTimeout(() => setShowHeart(false), 800);
      } else {
          togglePlay();
      }

      setLastClickTime(currentTime);
  }
  
  return (
    <div className="h-full w-full snap-start relative flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 bg-gray-900 w-full h-full cursor-pointer" onClick={handleVideoClick}>
         {/* eslint-disable-next-line @next/next/no-img-element */}
         {/* Using video tag for mock, ideally use Next Image for poster */}
         <video
            ref={videoRef}
            src={video.videoUrl}
            className="h-full w-full object-cover"
            loop
            muted={false} // Allow sound
            playsInline
            autoPlay
            poster={video.thumbnail}
         />

         {/* Play/Pause Indicator Overlay */}
         {!isPlaying && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                 <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                 </div>
             </div>
         )}

         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"></div>

         {/* Flying Heart Animation */}
         <AnimatePresence>
             {showHeart && (
                 <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 1 }}
                    animate={{ scale: 1.5, rotate: 0, opacity: 0, y: -100 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute pointer-events-none z-30 text-pink-500 drop-shadow-2xl"
                    style={{ left: heartPos.x - 40, top: heartPos.y - 40 }}
                 >
                     <Heart size={100} fill="currentColor" />
                 </motion.div>
             )}
         </AnimatePresence>
      </div>

      {/* Right Sidebar Actions */}
      <div className="absolute right-2 bottom-24 flex flex-col gap-6 items-center z-20 pb-4">
        <div className="relative group">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-700 overflow-hidden shadow-lg transition-transform group-hover:scale-105">
                <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} 
                    className="w-full h-full object-cover" 
                    alt="Avatar" 
                />
             </div>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pink-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer hover:scale-110 transition-transform text-white border border-white">+</div>
        </div>

        <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform">
                <Heart
                    size={28}
                    fill={liked ? "currentColor" : "none"}
                    className={cn("drop-shadow-lg cursor-pointer transition-colors duration-300", liked ? "text-pink-500" : "text-white hover:text-pink-200")}
                    onClick={handleLike}
                />
            </div>
            <span className="text-xs font-bold drop-shadow-lg text-white">{likesCount}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform">
                <MessageCircle size={28} className="text-white drop-shadow-lg cursor-pointer hover:text-blue-400 transition-colors" onClick={() => setShowComments(true)} />
            </div>
            <span className="text-xs font-bold drop-shadow-lg text-white">{video.comments}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform">
                 <Gift size={28} className="text-white drop-shadow-lg cursor-pointer hover:text-yellow-400 transition-colors" onClick={handleGift} />
            </div>
            <span className="text-xs font-bold drop-shadow-lg text-white">Gift</span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm active:scale-90 transition-transform">
                <Share2 size={28} className="text-white drop-shadow-lg cursor-pointer hover:text-green-400 transition-colors" onClick={handleShare} />
            </div>
            <span className="text-xs font-bold drop-shadow-lg text-white">{video.shares}</span>
        </div>

         <div className={cn("mt-4 bg-gray-900 rounded-full p-2 border border-gray-600 shadow-xl", isPlaying ? "animate-spin-slow" : "")}>
             <Disc size={24} className="text-gray-200" />
         </div>
      </div>

      {/* Bottom Overlay Info */}
      <div className="absolute bottom-0 w-full p-4 pb-6 z-10 bg-gradient-to-t from-black/80 to-transparent pt-12">
        <div className="flex flex-col gap-2 max-w-[75%]">
             <h3 className="font-bold text-lg text-white drop-shadow-md hover:underline cursor-pointer">@{video.author}</h3>
             <p className="text-gray-100 text-sm drop-shadow-md line-clamp-2 leading-snug">{video.description}</p>
             <div className="flex items-center gap-2 text-xs text-white bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                 <Music2 size={12} />
                 <div className="overflow-hidden w-32">
                     <span className={cn("whitespace-nowrap inline-block", isPlaying ? "animate-marquee" : "")}>
                        {video.songName || 'Original Sound - ' + video.author} &nbsp;&nbsp;&nbsp;&nbsp; {video.songName || 'Original Sound - ' + video.author}
                     </span>
                 </div>
             </div>
        </div>
      </div>

      <CommentsDrawer isOpen={showComments} onClose={() => setShowComments(false)} commentsCount={video.comments} />
    </div>
  )
}
