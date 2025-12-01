"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "./store";
import { ShoppingCart, FlaskConical, Cat, Coins, ArrowLeft, Store, Swords } from "lucide-react";
import { ShopView } from "./ShopView";
import { LabView } from "./LabView";
import { PetCollectionView } from "./PetCollectionView";
import { MarketView } from "./MarketView";
import { ArenaView } from "./ArenaView";

interface GameLayoutProps {
  onBack: () => void;
}

export function GameLayout({ onBack }: GameLayoutProps) {
  const [tab, setTab] = useState<'shop' | 'market' | 'lab' | 'arena' | 'collection'>('shop');
  const piBalance = useGameStore(state => state.piBalance);

  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
      // Manual rehydration to avoid server/client mismatch
      useGameStore.persist.rehydrate();
      setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full flex items-center justify-center bg-slate-950 text-white">Loading Lab...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Gene Lab
            </h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <Coins size={16} className="text-yellow-400" />
            <span className="font-mono font-bold text-yellow-400">{piBalance.toFixed(0)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {tab === 'shop' && <ShopView />}
        {tab === 'market' && <MarketView />}
        {tab === 'lab' && <LabView />}
        {tab === 'arena' && <ArenaView />}
        {tab === 'collection' && <PetCollectionView />}
      </div>

      {/* Game Nav */}
      <div className="flex border-t border-slate-800 bg-slate-900 pb-safe">
        <button
            onClick={() => setTab('shop')}
            className={`flex-1 p-3 flex flex-col items-center gap-1 transition-colors ${tab === 'shop' ? 'text-green-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
        >
            <ShoppingCart size={20} />
            <span className="text-[10px] font-bold uppercase">Shop</span>
        </button>
        <button
            onClick={() => setTab('market')}
            className={`flex-1 p-3 flex flex-col items-center gap-1 transition-colors ${tab === 'market' ? 'text-yellow-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
        >
            <Store size={20} />
            <span className="text-[10px] font-bold uppercase">Chợ</span>
        </button>
        <button
            onClick={() => setTab('lab')}
            className={`flex-1 p-3 flex flex-col items-center gap-1 transition-colors ${tab === 'lab' ? 'text-purple-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
        >
            <FlaskConical size={20} />
            <span className="text-[10px] font-bold uppercase">Lab</span>
        </button>
        <button
            onClick={() => setTab('arena')}
            className={`flex-1 p-3 flex flex-col items-center gap-1 transition-colors ${tab === 'arena' ? 'text-red-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
        >
            <Swords size={20} />
            <span className="text-[10px] font-bold uppercase">Đấu</span>
        </button>
        <button
            onClick={() => setTab('collection')}
            className={`flex-1 p-3 flex flex-col items-center gap-1 transition-colors ${tab === 'collection' ? 'text-blue-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
        >
            <Cat size={20} />
            <span className="text-[10px] font-bold uppercase">Thú</span>
        </button>
      </div>
    </div>
  );
}
