"use client";
import React from 'react';
import { BottomNav } from "@/components/BottomNav";
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    if (tab === 'home') router.push('/');
    else if (tab === 'market') router.push('/?tab=market');
    else if (tab === 'create') router.push('/upload');
    else if (tab === 'game') router.push('/game');
    else if (tab === 'profile') router.push('/profile');
  };

  const games = [
    { id: 1, name: "Pi Farm", icon: "🌾", color: "#4CAF50" },
    { id: 2, name: "Pi Pet", icon: "🐾", color: "#FF9800" },
    { id: 3, name: "Vòng Quay", icon: "🎡", color: "#E91E63" },
    { id: 4, name: "Cờ Tướng", icon: "♟️", color: "#3F51B5" },
  ];
  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white", padding: "20px", paddingBottom: "80px" }}>
      <h2 style={{ textAlign: "center", color: "#00f2ea" }}>TRUNG TÂM GAME 🎮</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" }}>
        {games.map((g) => (
          <div key={g.id} style={{ background: "#222", borderRadius: "15px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "40px" }}>{g.icon}</div>
            <h4>{g.name}</h4>
            <button style={{ marginTop: "10px", padding: "5px 15px", borderRadius: "20px", border: "none", background: g.color, color: "white" }}>Chơi ngay</button>
          </div>
        ))}
      </div>
      <BottomNav activeTab="game" onTabChange={handleTabChange} />
    </div>
  );
}
