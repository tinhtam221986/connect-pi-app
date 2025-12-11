"use client";

import React, { useState } from 'react';
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("video"); // video | shop | like

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "80px" }}>
      
      {/* 1. Header & Cover */}
      <div style={{ position: "relative", height: "150px", background: "linear-gradient(to right, #2c3e50, #000000)" }}>
         <div style={{ position: "absolute", top: "10px", right: "10px", fontSize: "20px" }}>⚙️</div>
      </div>

      {/* 2. Avatar & Info */}
      <div style={{ padding: "0 20px", marginTop: "-50px", position: "relative" }}>
        <div style={{ 
          width: "100px", height: "100px", borderRadius: "50%", 
          border: "4px solid black", backgroundColor: "#333",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px",
          overflow: "hidden"
        }}>
          <img src="https://via.placeholder.com/100" alt="Avatar" style={{ width: '100%', height: '100%' }} />
        </div>
        
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
            @Pi_Pioneer 
            <span style={{ fontSize: "14px", background: "#ff0050", padding: "2px 6px", borderRadius: "4px" }}>LV.1</span>
          </h1>
          <p style={{ color: "#aaa", fontSize: "14px", marginTop: "5px" }}>UID: pi_user_123456</p>
          <p style={{ marginTop: "5px" }}>Chào mừng đến với cửa hàng của tôi! 🛍️</p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "25px", marginTop: "20px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
          <div style={{ textAlign: "center" }}><b>12</b><div style={{ color: "#888", fontSize: "12px" }}>Follower</div></div>
          <div style={{ textAlign: "center" }}><b>8</b><div style={{ color: "#888", fontSize: "12px" }}>Đang Follow</div></div>
          <div style={{ textAlign: "center" }}><b>1.5K</b><div style={{ color: "#888", fontSize: "12px" }}>Thích</div></div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button style={{ flex: 1, padding: "10px", background: "#ff0050", border: "none", borderRadius: "4px", color: "white", fontWeight: "bold" }}>Sửa hồ sơ</button>
          <button style={{ flex: 1, padding: "10px", background: "#333", border: "none", borderRadius: "4px", color: "white", fontWeight: "bold" }}>Shop 🛍️</button>
        </div>
      </div>

      {/* 3. Tabs */}
      <div style={{ marginTop: "20px", display: "flex", borderBottom: "1px solid #333" }}>
        <div onClick={() => setActiveTab("video")} style={{ flex: 1, textAlign: "center", padding: "15px", borderBottom: activeTab === "video" ? "2px solid #ff0050" : "none", color: activeTab === "video" ? "white" : "#888" }}>Video</div>
        <div onClick={() => setActiveTab("shop")} style={{ flex: 1, textAlign: "center", padding: "15px", borderBottom: activeTab === "shop" ? "2px solid #ff0050" : "none", color: activeTab === "shop" ? "white" : "#888" }}>Cửa hàng</div>
        <div onClick={() => setActiveTab("like")} style={{ flex: 1, textAlign: "center", padding: "15px", borderBottom: activeTab === "like" ? "2px solid #ff0050" : "none", color: activeTab === "like" ? "white" : "#888" }}>Đã thích</div>
      </div>

      {/* 4. Content */}
      <div style={{ minHeight: "200px" }}>
        {activeTab === "video" && (
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px" }}>
              <div style={{ height: "150px", background: "#222" }}></div>
              <div style={{ height: "150px", background: "#333" }}></div>
              {/* Sẽ load video thật sau */}
           </div>
        )}
        {activeTab === "shop" && (
           <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
              <p>🛍️ Chưa có sản phẩm nào.</p>
              <button style={{ marginTop: "10px", padding: "8px 15px", background: "#333", border: "1px solid #555", color: "white", borderRadius: "20px" }}>+ Thêm sản phẩm</button>
           </div>
        )}
      </div>
      
      {/* Menu dưới đáy */}
      <BottomNav />
    </div>
  );
}
