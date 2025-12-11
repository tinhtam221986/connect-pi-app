"use client";

import React, { useState, useEffect } from 'react';
import BottomNav from "@/components/BottomNav";
import { usePi } from "@/components/PiSDKProvider";

export default function ProfilePage() {
  const { user: piUser } = usePi() || {}; // Lấy thông tin từ Pi SDK
  const [dbUser, setDbUser] = useState<any>(null); // Thông tin từ Database (Sổ hộ khẩu)
  const [activeTab, setActiveTab] = useState("video"); 

  // Khi có thông tin Pi, gọi về Server để lấy Sổ Hộ Khẩu
  useEffect(() => {
    if (piUser) {
      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: piUser.username, 
          user_uid: piUser.uid 
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) setDbUser(data.user);
      })
      .catch(err => console.error("Lỗi lấy sổ:", err));
    }
  }, [piUser]);

  // Ưu tiên hiển thị dữ liệu từ DB, nếu chưa có thì dùng tạm Pi SDK
  const displayName = dbUser?.username || piUser?.username || "Khách";
  const balance = dbUser?.balance || 0;
  const level = dbUser?.level || 1;

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "80px" }}>
      
      {/* Ảnh bìa */}
      <div style={{ height: "150px", background: "linear-gradient(45deg, #FF0099, #493240)" }}></div>

      {/* Thông tin */}
      <div style={{ padding: "0 20px", marginTop: "-50px", position: "relative" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "4px solid black", backgroundColor: "#333", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
           <span style={{fontSize: "40px"}}>👤</span>
        </div>
        
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "bold" }}>
            @{displayName} 
            <span style={{fontSize:'12px', background:'gold', color:'black', padding:'2px 6px', borderRadius:'4px', marginLeft:'5px'}}>LV.{level}</span>
          </h1>
          <p style={{ color: "#aaa", fontSize: "14px" }}>UID: {piUser?.uid?.substring(0,8)}...</p>
          <div style={{ marginTop: "5px", fontSize: "16px", fontWeight: "bold", color: "#00f2ea" }}>
             Ví Connect: {balance} π
          </div>
        </div>

        {/* Nút bấm */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button style={{ flex: 1, padding: "10px", background: "#333", border: "1px solid #555", borderRadius: "8px", color: "white", fontWeight: "bold" }}>Sửa hồ sơ</button>
          <button style={{ flex: 1, padding: "10px", background: "#ff0050", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold" }}>Nạp Pi 💎</button>
        </div>
      </div>

      <div style={{ marginTop: "20px", borderTop: "1px solid #333", padding: "20px", textAlign: "center", color: "#666" }}>
        (Danh sách video của bác sẽ hiện ở đây)
      </div>

      <BottomNav />
    </div>
  );
}
