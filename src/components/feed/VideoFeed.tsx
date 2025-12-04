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
      return <div className="h-full w-full bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="h-full w-full relative bg-black">
        {/* Top Tabs */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-4 text-sm font-bold drop-shadow-md">
            <button
                onClick={() => setTab('following')}
                className={cn("transition-colors", tab === 'following' ? "text-white border-b-2 border-white pb-1" : "text-gray-400")}
            >
                Following
            </button>
            <span className="text-gray-600">|</span>
            <button
                 onClick={() => setTab('foryou')}
                 className={cn("transition-colors", tab === 'foryou' ? "text-white border-b-2 border-white pb-1" : "text-gray-400")}
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
              <div className="flex items-center justify-center h-full text-gray-500">
                  No content available.
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

  const handleGift = () => {
      toast.success(`Sent 1 Pi to @${video.author}! 🎁`);
  }

  const handleVideoClick = (e: React.MouseEvent) => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastClickTime;

      if (timeDiff < 300) {
          // Double click detected
          setLiked(true);
          setShowHeart(true);
          // Calculate relative position for the heart
          const rect = e.currentTarget.getBoundingClientRect();
          setHeartPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
          });

          setTimeout(() => setShowHeart(false), 800);
      }

      setLastClickTime(currentTime);
  }
  
  return (
    <div className="h-full w-full snap-start relative flex items-center justify-center bg-gray-900" onClick={handleVideoClick}>
      {/* Video Background */}
      <div className="absolute inset-0 bg-gray-900 overflow-hidden">
         {/* eslint-disable-next-line @next/next/no-img-element */}
         {/* Using video tag for mock, ideally use Next Image for poster */}
         <video
            src={video.videoUrl}
            className="h-full w-full object-cover opacity-90"
            loop
            muted
            playsInline
            autoPlay
         />
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
      <div className="absolute right-2 bottom-24 flex flex-col gap-6 items-center z-20">
        <div className="relative">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-700 overflow-hidden">
                <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} 
                    className="w-full h-full object-cover" 
                    alt="Avatar" 
                />
             </div>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pink-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer hover:scale-110 transition-transform">+</div>
        </div>

        <div className="flex flex-col items-center gap-1">
            <Heart
                size={32}
                fill={liked ? "currentColor" : "none"}
                className={cn("drop-shadow-lg cursor-pointer transition-all active:scale-75", liked ? "text-pink-500" : "text-white hover:text-pink-500")}
                onClick={() => setLiked(!liked)}
            />
            <span className="text-xs font-bold drop-shadow-lg">{video.likes + (liked ? 1 : 0)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <MessageCircle size={32} className="text-white drop-shadow-lg cursor-pointer hover:text-blue-500 transition-colors" onClick={() => setShowComments(true)} />
            <span className="text-xs font-bold drop-shadow-lg">{video.comments}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <Gift size={32} className="text-white drop-shadow-lg cursor-pointer hover:text-yellow-500 transition-colors" onClick={handleGift} />
            <span className="text-xs font-bold drop-shadow-lg">Gift</span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <Share2 size={32} className="text-white drop-shadow-lg cursor-pointer hover:text-green-500 transition-colors" />
            <span className="text-xs font-bold drop-shadow-lg">{video.shares}</span>
        </div>

         <div className="animate-spin-slow mt-4 bg-gray-800 rounded-full p-2 border border-gray-600">
             <Disc size={24} className="text-gray-200" />
         </div>
      </div>

      {/* Bottom Overlay Info */}
      <div className="absolute bottom-0 w-full p-4 pb-6 z-10">
        <div className="flex flex-col gap-2 max-w-[80%]">
             <h3 className="font-bold text-lg text-white drop-shadow-md hover:underline cursor-pointer">@{video.author}</h3>
             <p className="text-gray-100 text-sm drop-shadow-md line-clamp-2 leading-snug">{video.description}</p>
             <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                 <Music2 size={12} />
                 <span className="animate-pulse">{video.songName || 'Original Sound'}</span>
             </div>
        </div>
      </div>

      <CommentsDrawer isOpen={showComments} onClose={() => setShowComments(false)} commentsCount={video.comments} />
    </div>
  )
}
