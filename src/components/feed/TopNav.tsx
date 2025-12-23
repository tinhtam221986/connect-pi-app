"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { usePi } from '@/components/pi/pi-provider';

interface TopNavProps {
    onProfileClick?: () => void;
}

export function TopNav({ onProfileClick }: TopNavProps) {
  const { user } = usePi();
  const [activeTab, setActiveTab] = useState<'following' | 'foryou'>('foryou');

  return (
    <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 pt-safe-top h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        {/* Pointer events none for container, auto for children to allow clicking through empty space */}

        {/* Left: Back Button Placeholder */}
        <div className="w-8 pointer-events-auto" />

        {/* Center: Tabs */}
        <div className="flex items-center gap-4 text-white font-bold text-base drop-shadow-md pointer-events-auto">
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

        {/* Right: User Avatar (Profile) - Replaces Search */}
        <div className="w-8 flex justify-end pointer-events-auto">
            <button onClick={onProfileClick} className="relative group">
                <div className="w-8 h-8 rounded-full border border-white/50 p-[1px] overflow-hidden">
                     <img
                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`}
                        alt="Profile"
                        className="w-full h-full object-cover bg-black rounded-full"
                     />
                </div>
            </button>
        </div>
    </div>
  );
}
