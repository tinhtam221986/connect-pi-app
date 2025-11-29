"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { VideoPost } from "@/components/feed/video-post"
import { PiConnect } from "@/components/pi/pi-connect"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  const dummyPosts = [
    { id: 1, username: "web3_creator", description: "Minting my first NFT on Pi Network! 🚀 #PiNetwork #NFT", likes: 1200, comments: 340, shares: 50, song: "Pi Song - Original Mix" },
    { id: 2, username: "crypto_jane", description: "Live battle tonight at 8 PM! Don't miss it. 🔥", likes: 8900, comments: 1200, shares: 450, song: "Battle Theme - Epic" },
    { id: 3, username: "dev_team", description: "Testing the new CONNECT update. Smooth as silk.", likes: 560, comments: 45, shares: 12, song: "Coding Vibes - Lofi" },
  ]

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 flex flex-col md:flex-row h-screen">
        
        {/* Feed Section (Center) */}
        <div className="flex-1 h-full relative flex justify-center">
            <div className="absolute top-4 z-50">
                <Tabs defaultValue="for_you" className="w-[400px] flex justify-center">
                    <TabsList className="bg-black/20 backdrop-blur-md border border-white/10">
                        <TabsTrigger value="following" className="data-[state=active]:bg-white/10">Following</TabsTrigger>
                        <TabsTrigger value="for_you" className="data-[state=active]:bg-white/10">For You</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <ScrollArea className="h-full w-full max-w-md snap-y snap-mandatory scroll-smooth pb-20">
                <div className="pt-16 pb-20">
                    {dummyPosts.map((post) => (
                        <VideoPost key={post.id} {...post} />
                    ))}
                </div>
            </ScrollArea>
        </div>

        {/* Right Sidebar (Widgets) - Hidden on mobile */}
        <div className="hidden lg:flex w-80 flex-col gap-6 p-6 border-l bg-card/30 backdrop-blur-sm h-full">
            <PiConnect />
            
            <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold mb-3">Trending on CONNECT</h3>
                <div className="space-y-3">
                    {["#PiNetworkMainnet", "#Web3Social", "#ConnectApp", "#BitcoinHalving"].map((tag) => (
                        <div key={tag} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors">{tag}</span>
                            <span className="text-xs text-muted-foreground/50">12.5k posts</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4">
                <h3 className="font-semibold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Assistant</h3>
                <p className="text-xs text-muted-foreground mb-3">
                    Need help with a caption? Ask Connect AI.
                </p>
                <div className="h-24 rounded bg-black/20 border border-white/5 flex items-center justify-center text-xs text-muted-foreground italic">
                    [AI Chat Widget Placeholder]
                </div>
            </div>
        </div>
      </main>

      {/* Mobile Bottom Nav (Visible only on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t flex items-center justify-around z-50">
        {/* Simplified mobile nav icons would go here */}
        <span className="text-xs">Home</span>
        <span className="text-xs">Discover</span>
        <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center -mt-4 border-4 border-black font-bold text-xl">+</div>
        <span className="text-xs">Inbox</span>
        <span className="text-xs">Me</span>
      </div>
    </div>
  )
}
