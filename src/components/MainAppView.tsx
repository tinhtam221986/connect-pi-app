"use client";

import { usePi } from "@/components/pi/pi-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Wallet } from "lucide-react";
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
            <span className="text-sm font-medium hidden sm:block">Hello, {user?.username}</span>
            <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                <AvatarFallback>PI</AvatarFallback>
            </Avatar>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {activeTab === "feed" && (
            <ScrollArea className="h-full w-full">
                <div className="flex flex-col items-center gap-4 p-4 pb-20">
                    <VideoCard 
                        username="PiNetworkUser1" 
                        description="Hello World! Testing CONNECT app on Pi Network. #Web3 #Pi"
                        likes="1.2k" comments="45" color="bg-gray-800"
                    />
                     <VideoCard 
                        username="CryptoFan" 
                        description="Beautiful sunset today! 🌅"
                        likes="856" comments="12" color="bg-slate-800"
                    />
                </div>
            </ScrollArea>
        )}

        {activeTab === "wallet" && (
            <div className="p-4 h-full overflow-y-auto pb-20">
                <h2 className="text-2xl font-bold mb-4">My Wallet & Tools</h2>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <p className="text-gray-400">Balance (Mock)</p>
                    <p className="text-3xl font-bold text-green-400">1,000 PNT</p>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-purple-400">Developer Tools</h3>
                    <PaymentTester />
                </div>
            </div>
        )}
      </main>

      <nav className="absolute bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around py-3 z-10">
        <NavButton icon={<Share2 />} label="Feed" active={activeTab === "feed"} onClick={() => setActiveTab("feed")} />
        <NavButton icon={<Heart />} label="Likes" active={activeTab === "likes"} onClick={() => setActiveTab("likes")} />
        <NavButton icon={<Wallet />} label="Wallet" active={activeTab === "wallet"} onClick={() => setActiveTab("wallet")} />
      </nav>
    </div>
  );
}

// ... Helper components (VideoCard, NavButton) được tích hợp sẵn trong code trên hoặc file Zip.
