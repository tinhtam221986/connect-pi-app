"use client";
import React from 'react';
import BottomNav from "@/components/BottomNav";

export default function GamePage() {
  const games = [
    { id: 1, name: "Pi Farm", icon: "🌾", players: "1.2M", color: "#4CAF50" },
    { id: 2, name: "Pi Pet", icon: "🐾", players: "850k", color: "#FF9800" },
    { id: 3, name: "Vòng Quay", icon: "🎡", players: "2.5M", color: "#E91E63" },
    { id: 4, name: "Cờ Tướng", icon: "♟️", players: "300k", color: "#3F51B5" },
  ];

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white", padding: "20px", paddingBottom: "80px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", background: "linear-gradient(to right, #00f2ea, #ff0050)", WebkitBackgroundClip: "text", color: "transparent" }}>
        TRUNG TÂM GAME 🎮
      </h2>

      {/* Banner Quảng cáo */}
      <div style={{ width: "100%", height: "150px", borderRadius: "15px", background: "linear-gradient(45deg, #FF0099, #493240)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "30px", border: "1px solid rgba(255,255,255,0.2)" }}>
        <h3 style={{fontSize: "24px", textShadow: "0 2px 4px black"}}>Sự kiện đua Top Pi 🏆</h3>
      </div>

      {/* Danh sách Game */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        {games.map((g) => (
          <div key={g.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", padding: "15px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>{g.icon}</div>
            <h4 style={{ margin: "5px 0" }}>{g.name}</h4>
            <p style={{ fontSize: "12px", color: "#aaa" }}>👥 {g.players}</p>
            <button style={{ marginTop: "10px", padding: "5px 15px", borderRadius: "20px", border: "none", background: g.color, color: "white", fontWeight: "bold" }}>Chơi ngay</button>
          </div>
        ))}
      </div>
      
      <BottomNav />
    </div>
  );
}
