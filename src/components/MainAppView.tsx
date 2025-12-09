"use client";

import React, { useState } from 'react';
import { usePi } from '@/components/pi/pi-provider';
// Import chính xác VideoFeed (Named Import)
import { VideoFeed } from '@/components/feed/VideoFeed';

// Giả định các component khác đã tồn tại. Nếu lỗi import ở các dòng dưới, hãy kiểm tra lại file tương ứng.
import { MarketplaceView } from '@/components/market/MarketplaceView';
import { GameCenter } from '@/components/game/GameCenter';
import { UserProfile } from '@/components/profile/UserProfile';
import { AIContentStudio } from '@/components/create/AIContentStudio';

export default function MainAppView() {
  const { user } = usePi();
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <VideoFeed />;
      case 'market': return <MarketplaceView />;
      case 'create': return <AIContentStudio />;
      case 'game': return <GameCenter />;
      case 'profile': return <UserProfile />;
      default: return <VideoFeed />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Pi Connection Status Bar (Whitepaper Requirement) */}
      <div className="bg-green-900/20 border-b border-green-500/20 text-green-400 text-[10px] font-mono font-bold py-1 px-4 flex justify-between items-center backdrop-blur-md z-50">
           <span className="flex items-center gap-1">✅ Pi Network Connected</span>
           <span className="text-green-300">@{user?.username || 'Guest'}</span>
      </div>

      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Cyber Glass Style) */}
      <nav className="h-16 glass border-t border-white/10 flex justify-around items-center z-50 pb-safe fixed bottom-0 w-full">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'home' ? 'text-primary neon-text scale-110' : 'text-muted-foreground hover:text-white'}`}>
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </button>
        <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'market' ? 'text-primary neon-text scale-110' : 'text-muted-foreground hover:text-white'}`}>
          <span className="text-2xl">🛒</span>
          <span className="text-[10px] mt-1 font-medium">Shop</span>
        </button>
        <button onClick={() => setActiveTab('create')} className="flex flex-col items-center -mt-8 group">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] border-4 border-background group-hover:scale-110 transition-transform duration-300">
            <span className="text-3xl font-bold text-white drop-shadow-md">+</span>
          </div>
        </button>
        <button onClick={() => setActiveTab('game')} className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'game' ? 'text-primary neon-text scale-110' : 'text-muted-foreground hover:text-white'}`}>
            <span className="text-2xl">🎮</span>
            <span className="text-[10px] mt-1 font-medium">Game</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'profile' ? 'text-primary neon-text scale-110' : 'text-muted-foreground hover:text-white'}`}>
          <span className="text-2xl">👤</span>
          <span className="text-[10px] mt-1 font-medium">Me</span>
        </button>
      </nav>
    </div>
  );
}
