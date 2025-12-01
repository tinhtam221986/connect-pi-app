"use client";

import { MOCK_VIDEOS } from "@/lib/mock-data";
import { Heart, MessageCircle, Share2, Music2, Disc, Gift } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { useState } from "react";
import { CommentsDrawer } from "./CommentsDrawer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function VideoFeed() {
  const { language } = useLanguage();
  const [tab, setTab] = useState<'foryou'|'following'>('foryou');

  // Filter content based on user's language preference
  const filteredVideos = MOCK_VIDEOS.filter(v => v.language === language);

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
          {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <VideoPost key={video.id} video={video} />
              ))
          ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                  No content available in this region.
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

  const handleGift = () => {
      toast.success(`Sent 1 Pi to @${video.user.username}! 🎁`);
  }
  
  return (
    <div className="h-full w-full snap-start relative flex items-center justify-center bg-gray-900">
      {/* Video Background */}
      <div className="absolute inset-0 bg-gray-900">
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
      </div>

      {/* Right Sidebar Actions */}
      <div className="absolute right-2 bottom-24 flex flex-col gap-6 items-center z-20">
        <div className="relative">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={video.user.avatar} className="w-12 h-12 rounded-full border-2 border-white" alt="Avatar" />
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
             <h3 className="font-bold text-lg text-white drop-shadow-md hover:underline cursor-pointer">@{video.user.username}</h3>
             <p className="text-gray-100 text-sm drop-shadow-md line-clamp-2 leading-snug">{video.description}</p>
             <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                 <Music2 size={12} />
                 <span className="animate-pulse">{t('feed.original_sound')} - {video.user.username}</span>
             </div>
        </div>
      </div>

      <CommentsDrawer isOpen={showComments} onClose={() => setShowComments(false)} commentsCount={video.comments} />
    </div>
  )
}
