"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export function TopNav() {
  const [activeTab, setActiveTab] = useState<'following' | 'foryou'>('foryou');

  return (
    <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 pt- safe-top h-16 bg-gradient-to-b from-black/60 to-transparent">
        {/* Left: Back Button Placeholder (usually handled by parent layout, but adding visual balance if needed) */}
        <div className="w-8" />

        {/* Center: Tabs */}
        <div className="flex items-center gap-4 text-white font-bold text-base drop-shadow-md">
            <button
                onClick={() => setActiveTab('following')}
                className={`transition-opacity ${activeTab === 'following' ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-80'}`}
            >
                Following
            </button>
            <div className="w-[1px] h-4 bg-white/40" />
            <button
                onClick={() => setActiveTab('foryou')}
                className={`transition-opacity ${activeTab === 'foryou' ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-80'}`}
            >
                For You
            </button>
        </div>

        {/* Right: Search */}
        <div className="w-8 flex justify-end">
            <Search className="w-6 h-6 text-white drop-shadow-md" />
        </div>
    </div>
  );
}
