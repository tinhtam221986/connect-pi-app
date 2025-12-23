"use client";

import React, { useState } from 'react';
import { usePi } from '@/components/pi/pi-provider';
import { VideoFeed } from '@/components/feed/VideoFeed';
import { MarketplaceView } from '@/components/market/MarketplaceView';
import { GameCenter } from '@/components/game/GameCenter';
import { UserProfile } from '@/components/profile/UserProfile';
// BottomNav removed for Immersive Mode
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
      // Pass onNavigate to VideoFeed so it can handle internal navigation (Profile, Shop, Create)
      case 'home': return <VideoFeed onNavigate={handleTabChange} />;
      case 'market': return <MarketplaceView />;
      case 'game': return <GameCenter />;
      // Pass onBack to UserProfile so user can return to Home
      case 'profile': return <UserProfile onBack={() => setActiveTab('home')} />;
      default: return <VideoFeed onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white relative overflow-hidden">
      {/* Pi Status - Overlay (Top Left) - Only show on Home/Game to avoid cluttering Profile */}
      {activeTab === 'home' && (
        <div className="absolute top-safe left-0 right-0 z-40 p-2 flex justify-between items-start pointer-events-none">
             <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-medium text-white/80 tracking-wide">@{user?.username || 'Guest'}</span>
             </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative">
        {renderContent()}
      </main>

      {/* BottomNav removed per "Urgent Revision" for Pure Immersive Feed */}
    </div>
  );
}
