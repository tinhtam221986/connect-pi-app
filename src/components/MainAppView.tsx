"use client";

import React, { useState } from 'react';
import { usePi } from '@/components/pi/pi-provider';
import { VideoFeed } from '@/components/feed/VideoFeed';
import { MarketplaceView } from '@/components/market/MarketplaceView';
import { GameCenter } from '@/components/game/GameCenter';
import { UserProfile } from '@/components/profile/UserProfile';
import { useRouter } from 'next/navigation';

// MainAppView now acts as a simple container for the VideoFeed,
// which handles all primary UI and navigation logic internally.
export default function MainAppView() {
  const { user } = usePi();
  const router = useRouter();

  // The concept of 'activeTab' is removed from this top-level component.
  // Navigation is now handled within the VideoFeed or via direct routing.
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white relative overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative">
        {/* The VideoFeed is now the primary and only component rendered here. */}
        {/* It will manage its own state for overlays like Profile, Shop, etc. */}
        <VideoFeed />
      </main>
    </div>
  );
}
