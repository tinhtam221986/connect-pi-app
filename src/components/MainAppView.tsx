"use client";

import { usePi } from "@/components/pi/pi-provider";
import { PiNetworkStatus } from "@/components/pi/PiNetworkStatus";
import { Heart, MessageCircle, Share2, Wallet } from "lucide-react";
import PaymentTester from "@/components/PaymentTester"; // We can keep this hidden or in a tab
import { useState } from "react";

export default function MainAppView() {
  const { user } = usePi();
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <PiNetworkStatus />
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          CONNECT
        </h1>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden sm:block">Hello, {user?.username}</span>
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                    alt="User" 
                    className="h-full w-full object-cover"
                />
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "feed" && (
            <div className="h-full w-full overflow-y-auto">
                <div className="flex flex-col items-center gap-4 p-4 pb-20">
                    {/* Mock Video Post 1 */}
                    <VideoCard 
                        username="PiNetworkUser1" 
                        description="Hello World! Testing CONNECT app on Pi Network. #Web3 #Pi"
                        likes="1.2k"
                        comments="45"
                        color="bg-gray-800"
                    />
                     {/* Mock Video Post 2 */}
                     <VideoCard 
                        username="CryptoFan" 
                        description="Beautiful sunset today! 🌅"
                        likes="856"
                        comments="12"
                        color="bg-slate-800"
                    />
                    {/* Mock Video Post 3 */}
                    <VideoCard 
                        username="DevTeam" 
                        description="New features coming soon. Stay tuned!"
                        likes="2.5k"
                        comments="100+"
                        color="bg-zinc-800"
                    />
                </div>
            </div>
        )}

        {activeTab === "wallet" && (
            <div className="p-4 h-full overflow-y-auto pb-20">
                <h2 className="text-2xl font-bold mb-4">My Wallet & Tools</h2>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <p className="text-gray-400">Balance (Mock)</p>
                    <p className="text-3xl font-bold text-green-400">1,000 PNT</p>
                </div>
                
                {/* Embed the Payment Tester here as a "feature" */}
                <div className="border-t border-gray-700 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-purple-400">Developer Tools</h3>
                    <PaymentTester />
                </div>
            </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around py-3 z-10">
        <NavButton icon={<Share2 />} label="Feed" active={activeTab === "feed"} onClick={() => setActiveTab("feed")} />
        <NavButton icon={<Heart />} label="Likes" active={activeTab === "likes"} onClick={() => setActiveTab("likes")} />
        <NavButton icon={<MessageCircle />} label="Chat" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
        <NavButton icon={<Wallet />} label="Wallet" active={activeTab === "wallet"} onClick={() => setActiveTab("wallet")} />
      </nav>
    </div>
  );
}

function VideoCard({ username, description, likes, comments, color }: any) {
    return (
        <div className={`w-full max-w-md ${color} rounded-xl overflow-hidden shadow-lg border border-gray-700`}>
            {/* Placeholder for Video */}
            <div className="aspect-[9/16] bg-black relative flex items-center justify-center">
                <span className="text-gray-600 font-bold text-2xl">VIDEO CONTENT</span>
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="font-bold text-white">@{username}</p>
                    <p className="text-sm text-gray-200 line-clamp-2">{description}</p>
                </div>
            </div>
            {/* Action Bar */}
            <div className="flex justify-between p-3 text-gray-300">
                <button className="flex items-center gap-1 hover:text-pink-500"><Heart size={20} /> {likes}</button>
                <button className="flex items-center gap-1 hover:text-blue-500"><MessageCircle size={20} /> {comments}</button>
                <button className="hover:text-green-500"><Share2 size={20} /></button>
            </div>
        </div>
    )
}

function NavButton({ icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center gap-1 ${active ? "text-purple-500" : "text-gray-500 hover:text-gray-300"}`}
        >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    )
}
