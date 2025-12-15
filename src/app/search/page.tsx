"use client";
import React, { useState } from 'react';
import { BottomNav } from "@/components/BottomNav";
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    if (tab === 'home') router.push('/');
    else if (tab === 'market') router.push('/?tab=market');
    else if (tab === 'create') router.push('/upload');
    else if (tab === 'game') router.push('/game');
    else if (tab === 'profile') router.push('/profile');
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "white", fontSize: "24px" }}>⬅️</button>
        <input placeholder="Tìm kiếm..." style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "none", background: "#333", color: "white" }} />
      </div>
      <h3>🔥 Xu hướng: #PiNetwork, #Web3</h3>
      <BottomNav activeTab="search" onTabChange={handleTabChange} />
    </div>
  );
}
