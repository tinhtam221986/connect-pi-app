"use client";

import { usePi } from "@/components/pi/pi-provider";
import { PiNetworkStatus } from "@/components/pi/PiNetworkStatus";
import { VideoFeed } from "@/components/feed/VideoFeed";
import { UserProfile } from "@/components/profile/UserProfile";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { Heart, Home, MessageCircle, PlusSquare, ShoppingBag, User, Wallet } from "lucide-react";
import PaymentTester from "@/components/PaymentTester";
import { useState } from "react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function MainAppView() {
  const { user } = usePi();
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col h-screen bg-black text-white relative">
      <PiNetworkStatus />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "home" && <VideoFeed />}
        
        {activeTab === "market" && <MarketplaceView />}
        
        {activeTab === "create" && <CreateView />}
        
        {activeTab === "wallet" && <WalletView />}
        
        {activeTab === "profile" && <UserProfile />}
      </main>

      <AIAssistant />

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-800 flex justify-around py-2 z-30 pb-safe safe-area-bottom">
        <NavButton icon={<Home size={24} />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <NavButton icon={<ShoppingBag size={24} />} label="Shop" active={activeTab === "market"} onClick={() => setActiveTab("market")} />
        
        {/* Center Create Button */}
        <div className="relative -top-6">
             <button 
                onClick={() => setActiveTab("create")}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 border-4 border-black transition-transform active:scale-95"
             >
                <PlusSquare size={28} className="text-white" />
             </button>
        </div>

        <NavButton icon={<Wallet size={24} />} label="Wallet" active={activeTab === "wallet"} onClick={() => setActiveTab("wallet")} />
        <NavButton icon={<User size={24} />} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
      </nav>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center gap-1 w-12 pt-1 ${active ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
        >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    )
}

function MarketplaceView() {
    return (
        <div className="h-full overflow-y-auto p-4 pb-24 bg-gray-900">
             <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 sticky top-0 bg-gray-900 py-2 z-10">Marketplace</h2>
             <div className="grid grid-cols-2 gap-4">
                 {MOCK_PRODUCTS.map(p => (
                     <div key={p.id} className="bg-gray-800 rounded-lg p-3 flex flex-col gap-2 shadow-lg">
                         <div className="aspect-square bg-gray-700 rounded-md flex items-center justify-center text-4xl">
                             {p.image}
                         </div>
                         <h3 className="font-bold text-sm truncate">{p.name}</h3>
                         <div className="flex justify-between items-center">
                             <span className="text-yellow-400 font-bold">{p.price} Pi</span>
                             <span className="text-xs text-gray-400">{p.seller}</span>
                         </div>
                         <button className="w-full py-2 bg-yellow-600 rounded text-xs font-bold mt-1 hover:bg-yellow-500 active:scale-95 transition-all">Buy Now</button>
                     </div>
                 ))}
             </div>
        </div>
    )
}

function WalletView() {
     return (
        <div className="h-full overflow-y-auto p-4 pb-24 bg-gray-950">
            <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-gray-950 py-2 z-10">My Wallet</h2>
            
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 mb-6 shadow-xl border border-white/10">
                <p className="text-purple-200 text-sm mb-1">Total Balance</p>
                <h3 className="text-4xl font-bold text-white mb-4">1,250.00 <span className="text-lg text-purple-300">Pi</span></h3>
                <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold hover:bg-white/20 transition-colors border border-white/5">Send</button>
                    <button className="flex-1 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold hover:bg-white/20 transition-colors border border-white/5">Receive</button>
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4">
                 <h4 className="font-bold mb-4 text-gray-300">Recent Transactions</h4>
                 <div className="flex flex-col gap-3">
                     {[1,2,3].map(i => (
                         <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-2 last:border-0">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-400">
                                     <Wallet size={18} />
                                 </div>
                                 <div>
                                     <p className="font-bold text-sm text-gray-200">Received from @User{i}</p>
                                     <p className="text-xs text-gray-500">Today, 10:23 AM</p>
                                 </div>
                             </div>
                             <span className="text-green-400 font-bold text-sm">+ 50 Pi</span>
                         </div>
                     ))}
                 </div>
            </div>
            
            <div className="mt-8">
                 <h4 className="font-bold mb-2 text-gray-500">Dev Tools</h4>
                 <PaymentTester />
            </div>
        </div>
    )
}

function CreateView() {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-900 p-8 text-center pb-20">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6 animate-pulse">
                <PlusSquare size={48} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white">Create Content</h2>
            <p className="text-gray-400 mb-8 max-w-xs">Upload short videos or start a live stream to earn Pi from your fans.</p>
            <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform text-lg">
                Start Recording
            </button>
            <p className="mt-6 text-xs text-gray-600 uppercase tracking-widest">Camera Access Required</p>
        </div>
    )
}
