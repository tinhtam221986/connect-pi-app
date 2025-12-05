"use client";

import React, { useState } from 'react';
// Import chính xác VideoFeed (Named Import)
import { VideoFeed } from '@/components/feed/VideoFeed';

// Giả định các component khác đã tồn tại. Nếu lỗi import ở các dòng dưới, hãy kiểm tra lại file tương ứng.
import { MarketplaceView } from '@/components/market/MarketplaceView';
import { GameCenter } from '@/components/game/GameCenter';
import { UserProfile } from '@/components/profile/UserProfile';
import { AIContentStudio } from '@/components/create/AIContentStudio';

export default function MainAppView() {
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
    <div className="flex flex-col h-screen bg-black text-white">
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-16 border-t border-gray-800 bg-black flex justify-around items-center z-50 pb-safe">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-pink-500' : 'text-gray-400'}`}>
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center ${activeTab === 'market' ? 'text-pink-500' : 'text-gray-400'}`}>
          <span className="text-2xl">🛒</span>
          <span className="text-[10px] mt-1">Shop</span>
        </button>
        <button onClick={() => setActiveTab('create')} className="flex flex-col items-center -mt-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg border-2 border-black hover:scale-105 transition-transform">
            <span className="text-3xl font-bold text-white">+</span>
          </div>
        </button>
        <button onClick={() => setActiveTab('game')} className={`flex flex-col items-center ${activeTab === 'game' ? 'text-pink-500' : 'text-gray-400'}`}>
            <span className="text-2xl">🎮</span>
            <span className="text-[10px] mt-1">Game</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-pink-500' : 'text-gray-400'}`}>
          <span className="text-2xl">👤</span>
          <span className="text-[10px] mt-1">Me</span>
        </button>
      </nav>
    </div>
  );
}
