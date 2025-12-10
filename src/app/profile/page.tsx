"use client";

import React from 'react';

export default function ProfilePage() {
  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "80px" }}>
      
      {/* 1. Ảnh bìa & Avatar */}
      <div style={{ position: "relative", height: "200px", background: "linear-gradient(to right, #ff0050, #9b59b6)" }}>
        <div style={{ 
          position: "absolute", bottom: "-50px", left: "20px",
          width: "100px", height: "100px", borderRadius: "50%", 
          border: "4px solid black", backgroundColor: "#333",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px"
        }}>
          👤
        </div>
      </div>

      {/* 2. Thông tin người dùng */}
      <div style={{ marginTop: "60px", padding: "0 20px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>@Pi_Pioneer</h1>
        <p style={{ color: "#888", marginTop: "5px" }}>Thành viên tích cực của Connect Web3 🚀</p>
        
        {/* Số liệu thống kê */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div><b style={{ color: "white" }}>12</b> <span style={{ color: "#888" }}>Đang theo dõi</span></div>
          <div><b style={{ color: "white" }}>1.5M</b> <span style={{ color: "#888" }}>Follower</span></div>
          <div><b style={{ color: "white" }}>10k</b> <span style={{ color: "#888" }}>Thích</span></div>
        </div>

        {/* Nút sửa hồ sơ */}
        <button style={{ 
          marginTop: "20px", width: "100%", padding: "10px", 
          background: "none", border: "1px solid #444", color: "white", 
          borderRadius: "5px", fontWeight: "bold" 
        }}>
          Sửa hồ sơ
        </button>
      </div>

      {/* 3. Tab Video của tôi */}
      <div style={{ marginTop: "30px", borderTop: "1px solid #333" }}>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "15px 0" }}>
          <div style={{ borderBottom: "2px solid #ff0050", paddingBottom: "5px" }}>Video</div>
          <div style={{ color: "#888" }}>Đã thích</div>
          <div style={{ color: "#888" }}>Riêng tư</div>
        </div>

        {/* Lưới video (Giả lập) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>
           <div style={{ height: "150px", background: "#222" }}></div>
           <div style={{ height: "150px", background: "#333" }}></div>
           <div style={{ height: "150px", background: "#444" }}></div>
           {/* Sau này code sẽ tự lấy video của bác điền vào đây */}
        </div>
        
        <p style={{ textAlign: "center", color: "#666", marginTop: "30px" }}>
          (Video của bác sẽ sớm hiện ở đây)
        </p>
      </div>
    </div>
  );
}
