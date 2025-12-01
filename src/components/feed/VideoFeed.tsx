"use client";

import { MOCK_VIDEOS } from "@/lib/mock-data";
import { Heart, MessageCircle, Share2, Music2, Disc, Gamepad2 } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";

export function VideoFeed() {
  const { language } = useLanguage();
  // Filter content based on user's language preference
  const filteredVideos = MOCK_VIDEOS.filter(v => v.language === language);

  // Inject Promo
  const feedItems: any[] = [...filteredVideos];
  if (feedItems.length > 2) {
      feedItems.splice(2, 0, { type: 'promo', id: 'promo_1' });
  }

  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {feedItems.length > 0 ? (
          feedItems.map((item: any) => (
            item.type === 'promo' ? <GamePromo key={item.id} /> : <VideoPost key={item.id} video={item} />
          ))
      ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
              No content available in this region.
          </div>
      )}
    </div>
  );
}

function GamePromo() {
    return (
        <div className="h-full w-full snap-start relative flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-6">
            <div className="text-center p-8 bg-black/30 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl max-w-sm">
                <div className="w-32 h-32 mx-auto mb-6 bg-yellow-400/20 rounded-full flex items-center justify-center animate-pulse">
                    <Gamepad2 size={64} className="text-yellow-400 animate-bounce" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Pi Gene Lab</h2>
                <div className="h-1 w-20 bg-pink-500 mx-auto mb-4 rounded-full" />
                <p className="text-purple-200 mb-8 text-lg font-medium leading-relaxed">
                    Lai tạo thú cưng độc bản, chiến đấu PvP và kiếm Pi mỗi ngày!
                </p>
                <div className="flex flex-col gap-3">
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Chơi ngay tại tab Game 👇</div>
                    <div className="animate-bounce mt-2 text-white">⬇️</div>
                </div>
            </div>
        </div>
    )
}

function VideoPost({ video }: any) {
  const { t } = useLanguage();
  
  return (
    <div className="h-full w-full snap-start relative flex items-center justify-center bg-gray-900">
      {/* Video Background */}
      <div className="absolute inset-0 bg-gray-900">
         <video
            src={video.videoUrl}
            className="h-full w-full object-cover opacity-90"
            loop
            muted
            playsInline
            autoPlay
         />
      </div>

      {/* Right Sidebar Actions */}
      <div className="absolute right-2 bottom-24 flex flex-col gap-6 items-center z-20">
        <div className="relative">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={video.user.avatar} className="w-10 h-10 rounded-full border-2 border-white" alt="Avatar" />
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pink-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">+</div>
        </div>

        <div className="flex flex-col items-center gap-1">
            <Heart size={32} className="text-white drop-shadow-lg cursor-pointer hover:text-pink-500 transition-colors" />
            <span className="text-xs font-bold drop-shadow-lg">{video.likes}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <MessageCircle size={32} className="text-white drop-shadow-lg cursor-pointer hover:text-blue-500 transition-colors" />
            <span className="text-xs font-bold drop-shadow-lg">{video.comments}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <Share2 size={32} className="text-white drop-shadow-lg cursor-pointer hover:text-green-500 transition-colors" />
            <span className="text-xs font-bold drop-shadow-lg">{video.shares}</span>
        </div>

         <div className="animate-spin-slow mt-4">
             <Disc size={32} className="text-gray-200" />
         </div>
      </div>

      {/* Bottom Overlay Info */}
      <div className="absolute bottom-0 w-full p-4 pb-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
        <div className="flex flex-col gap-2 max-w-[80%]">
             <h3 className="font-bold text-lg text-white drop-shadow-md">@{video.user.username}</h3>
             <p className="text-gray-100 text-sm drop-shadow-md line-clamp-2">{video.description}</p>
             <div className="flex items-center gap-2 text-xs text-gray-300">
                 <Music2 size={12} />
                 <span className="animate-pulse">{t('feed.original_sound')} - {video.user.username}</span>
             </div>
        </div>
      </div>
    </div>
  )
}
