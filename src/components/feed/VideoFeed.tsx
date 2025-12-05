"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, Music2 } from "lucide-react"

// --- QUAN TRỌNG: Phải dùng export function (Named Export) ---
export function VideoFeed() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Giả lập fetch data hoặc gọi API thật
    const fetchVideos = async () => {
        try {
            // Nếu có API: const res = await fetch('/api/feed');
            // Mock data tạm thời để không bị lỗi build
            const mockVideos = [
                { id: 1, url: "/uploads/demo1.mp4", user: "user1", desc: "Hello Pi Network", likes: 100 },
                { id: 2, url: "/uploads/demo2.mp4", user: "user2", desc: "Connect App", likes: 250 }
            ]
            setVideos(mockVideos)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }
    fetchVideos()
  }, [])

  if (loading) return <div className="text-white text-center p-10">Loading Feed...</div>

  return (
    <div className="flex flex-col gap-4 w-full h-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map((video) => (
        <div key={video.id} className="relative w-full h-[calc(100vh-80px)] snap-start bg-gray-900 flex items-center justify-center">
            {/* Video Placeholder or Real Video */}
            <div className="text-white">Video ID: {video.id}</div>
            
            {/* Overlay UI (TikTok style) */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-6 items-center text-white">
                <div className="flex flex-col items-center">
                    <div className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition cursor-pointer">
                        <Heart className={video.liked ? "fill-red-500 text-red-500" : "text-white"} size={28} />
                    </div>
                    <span className="text-xs font-bold mt-1">{video.likes}</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition cursor-pointer">
                        <MessageCircle size={28} />
                    </div>
                    <span className="text-xs font-bold mt-1">Chat</span>
                </div>

                <div className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition cursor-pointer">
                    <Share2 size={28} />
                </div>
            </div>

            <div className="absolute bottom-4 left-4 text-white w-[70%]">
                <h3 className="font-bold text-lg">@{video.user}</h3>
                <p className="text-sm opacity-90">{video.desc}</p>
                <div className="flex items-center gap-2 mt-2 opacity-70">
                    <Music2 size={14} />
                    <span className="text-xs">Original Sound - {video.user}</span>
                </div>
            </div>
        </div>
      ))}
      {videos.length === 0 && (
          <div className="h-full flex items-center justify-center text-white">
              No videos available yet. Be the first to post!
          </div>
      )}
    </div>
  )
}
