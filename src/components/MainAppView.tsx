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
      // Pass onNavigate to VideoFeed so it can handle internal navigation (Profile, Shop, Create)
      case 'home': return <VideoFeed onNavigate={handleTabChange} />;
      case 'market': return <MarketplaceView onBack={() => setActiveTab('home')} />;
      case 'game': return <GameCenter />;
      // Pass onBack to UserProfile so user can return to Home
      case 'profile': return <UserProfile onBack={() => setActiveTab('home')} />;
      default: return <VideoFeed onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white relative overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative">
        {renderContent()}
      </main>
      <BottomNav onTabChange={handleTabChange} />
    </div>
  );
}
