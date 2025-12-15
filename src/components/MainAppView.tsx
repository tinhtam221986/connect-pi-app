"use client";

import React, { useState } from 'react';
import { usePi } from '@/components/pi/pi-provider';
import { VideoFeed } from '@/components/feed/VideoFeed';
import { MarketplaceView } from '@/components/market/MarketplaceView';
import { GameCenter } from '@/components/game/GameCenter';
import { UserProfile } from '@/components/profile/UserProfile';
import { BottomNav } from '@/components/BottomNav';
import { useRouter } from 'next/navigation';

export default function MainAppView() {
  const { user } = usePi();
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  const handleTabChange = (tab: string) => {
      if (tab === 'create') {
          router.push('/upload'); // Redirect to the full upload page
      } else {
          setActiveTab(tab);
      }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <VideoFeed />;
      case 'market': return <MarketplaceView />;
      case 'game': return <GameCenter />;
      case 'profile': return <UserProfile />;
      default: return <VideoFeed />;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white relative overflow-hidden">
      {/* Pi Status - Overlay (Top Left) */}
      <div className="absolute top-safe left-0 right-0 z-40 p-2 flex justify-between items-start pointer-events-none">
           <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-medium text-white/80 tracking-wide">@{user?.username || 'Guest'}</span>
           </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative">
        {renderContent()}
      </main>

      {/* Transparent Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
