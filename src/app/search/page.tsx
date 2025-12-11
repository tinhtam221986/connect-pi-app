"use client";
import React, { useState } from 'react';
import BottomNav from "@/components/BottomNav";
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const trends = ["#PiNetwork", "#Web3", "#ConnectApp", "#DoiPiLayOto", "#NhacTre"];

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", padding: "20px", paddingBottom: "80px" }}>
      
      {/* Header Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "white", fontSize: "24px" }}>⬅️</button>
        <div style={{ flex: 1, position: "relative" }}>
           <input 
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="Tìm kiếm user, video..." 
             style={{ width: "100%", padding: "12px 20px", borderRadius: "30px", border: "none", background: "#222", color: "white", outline: "none" }}
           />
           <span style={{ position: "absolute", right: "15px", top: "10px" }}>🔍</span>
        </div>
      </div>

      {/* Xu hướng */}
      <h3 style={{ marginBottom: "15px" }}>🔥 Xu hướng tìm kiếm</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {trends.map((tag, i) => (
          <span key={i} style={{ padding: "8px 15px", background: "#333", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Gợi ý User */}
      <h3 style={{ marginTop: "30px", marginBottom: "15px" }}>👥 Gợi ý mọi người</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
         {[1,2,3].map(i => (
           <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                 <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#444" }}></div>
                 <div>
                    <div style={{ fontWeight: "bold" }}>Pi User {i}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>@pi_user_{i}</div>
                 </div>
              </div>
              <button style={{ background: "#ff0050", border: "none", color: "white", padding: "5px 15px", borderRadius: "5px", fontWeight: "bold" }}>Follow</button>
           </div>
         ))}
      </div>

      <BottomNav />
    </div>
  );
}
