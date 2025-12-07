"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Music2, Gift } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VideoPostProps {
  username: string
  description: string
  likes: number
  comments: number
  shares: number
  song: string
  videoUrl?: string // Placeholder for real video
}

export function VideoPost({ username, description, likes, comments, shares, song }: VideoPostProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full max-w-md snap-start mx-auto rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl my-4">
      {/* Video Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-500">
        <span className="animate-pulse">Video Content Loading...</span>
      </div>
      
      {/* Right Action Bar */}
      <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center gap-6">
        <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} />
            <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-0.5">
                <div className="h-3 w-3 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[8px] font-bold text-red-500">+</span>
                </div>
            </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className={cn("rounded-full hover:bg-transparent hover:scale-110 transition-all", isLiked && "text-red-500")}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("h-8 w-8 fill-current", isLiked ? "fill-red-500" : "fill-transparent")} />
          </Button>
          <span className="text-xs font-bold">{likes}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="ghost" className="rounded-full hover:bg-transparent hover:scale-110 transition-all">
            <MessageCircle className="h-8 w-8 fill-white/20" />
          </Button>
          <span className="text-xs font-bold">{comments}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="ghost" className="rounded-full hover:bg-transparent hover:scale-110 transition-all">
            <Share2 className="h-8 w-8 fill-white/20" />
          </Button>
          <span className="text-xs font-bold">{shares}</span>
        </div>

        <div className="flex flex-col items-center gap-1 mt-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center animate-spin-slow border-4 border-black/50">
                <Gift className="h-6 w-6 text-white" />
            </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-6 left-4 right-16 z-20 text-left">
        <h3 className="text-lg font-bold mb-2">@{username}</h3>
        <p className="text-sm text-zinc-200 line-clamp-2 mb-4">
          {description} <span className="font-bold text-blue-400">#CONNECT #Web3</span>
        </p>
        <div className="flex items-center gap-2">
          <Music2 className="h-4 w-4 animate-spin" />
          <div className="text-xs font-medium overflow-hidden w-32">
            <div className="animate-marquee whitespace-nowrap">
              {song} • Original Sound
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
