"use client";

import { usePi } from "@/components/pi/pi-provider";
import PaymentTester from "@/components/PaymentTester";
import { useState } from "react";

export default function MainAppView() {
  const { user } = usePi();
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          CONNECT
        </h1>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Hello, {user?.username}</span>
            <div className="h-8 w-8 rounded-full bg-gray-700 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="Avatar" />
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black relative pb-20">
        {activeTab === "feed" && (
            <div className="flex flex-col items-center gap-6 p-4">
                <VideoCard 
                    username="PiNetworkUser1" 
                    description="Hello World! Testing CONNECT app on Pi Network. #Web3"
                    likes="1.2k" comments="45" color="bg-gray-800"
                />
                 <VideoCard 
                    username="CryptoFan" 
                    description="Beautiful sunset today! 🌅"
                    likes="856" comments="12" color="bg-slate-800"
                />
            </div>
        )}

        {activeTab === "wallet" && (
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">My Wallet</h2>
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <p className="text-gray-400">Balance</p>
                    <p className="text-3xl font-bold text-green-400">1,000 PNT</p>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-purple-400">Developer Tools</h3>
                    <PaymentTester />
                </div>
            </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around py-3 z-50">
        <button onClick={() => setActiveTab("feed")} className={`text-sm font-bold ${activeTab === "feed" ? "text-purple-500" : "text-gray-500"}`}>FEED</button>
        <button onClick={() => setActiveTab("likes")} className={`text-sm font-bold ${activeTab === "likes" ? "text-purple-500" : "text-gray-500"}`}>LIKES</button>
        <button onClick={() => setActiveTab("wallet")} className={`text-sm font-bold ${activeTab === "wallet" ? "text-purple-500" : "text-gray-500"}`}>WALLET</button>
      </nav>
    </div>
  );
}

function VideoCard({ username, description, likes, comments, color }: any) {
    return (
        <div className={`w-full max-w-md ${color} rounded-xl overflow-hidden shadow-lg border border-gray-700`}>
            <div className="aspect-[9/16] bg-black relative flex items-center justify-center">
                <span className="text-gray-500 font-bold">VIDEO CONTENT</span>
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="font-bold text-white">@{username}</p>
                    <p className="text-sm text-gray-200">{description}</p>
                </div>
            </div>
            <div className="flex justify-between p-3 text-gray-300 bg-gray-900/50">
                <span>❤️ {likes}</span>
                <span>💬 {comments}</span>
                <span>🔗 Share</span>
            </div>
        </div>
    )
}
