import { MOCK_VIDEOS } from "@/lib/mock-data";
import { Heart, MessageCircle, Share2, Music2, Disc } from "lucide-react";

export function VideoFeed() {
  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {MOCK_VIDEOS.map((video) => (
        <VideoPost key={video.id} video={video} />
      ))}
    </div>
  );
}

function VideoPost({ video }: any) {
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
                 <span className="animate-pulse">Original Sound - {video.user.username}</span>
             </div>
        </div>
      </div>
    </div>
  )
}
