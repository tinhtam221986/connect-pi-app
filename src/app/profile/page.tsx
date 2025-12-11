"use client";

import React, { useState } from 'react';
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("video"); 
  const [showEdit, setShowEdit] = useState(false);
  const [balance, setBalance] = useState(100); // Ví dụ: Có 100 Pi

  // --- 🟢 HÀM MUA HÀNG ---
  const handleBuy = (itemName: string, price: number) => {
    const confirm = window.confirm(`Bạn có muốn mua "${itemName}" với giá ${price} Pi không?`);
    if (confirm) {
      if (balance >= price) {
        setBalance(balance - price);
        alert("✅ Thanh toán thành công! Đơn hàng đang được xử lý.");
      } else {
        alert("❌ Số dư không đủ!");
      }
    }
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "80px" }}>
      
      {/* 1. Header */}
      <div style={{ position: "relative", height: "150px", background: "linear-gradient(45deg, #FF0099, #493240)" }}></div>

      {/* 2. Info */}
      <div style={{ padding: "0 20px", marginTop: "-50px", position: "relative" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "4px solid black", backgroundColor: "#333", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="https://via.placeholder.com/100" style={{ width: '100%', height: '100%' }} />
        </div>
        
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "bold" }}>@Pi_Pioneer <span style={{fontSize:'12px', background:'gold', color:'black', padding:'2px 5px', borderRadius:'4px'}}>VIP</span></h1>
          <p style={{ color: "#aaa", fontSize: "14px" }}>Thành viên tích cực 🚀</p>
          <div style={{ marginTop: "5px", fontWeight: "bold", color: "#00f2ea" }}>Ví Pi: {balance} π</div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "25px", marginTop: "20px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
          <div style={{ textAlign: "center" }}><b>12</b><div style={{ color: "#888", fontSize: "12px" }}>Follower</div></div>
          <div style={{ textAlign: "center" }}><b>8</b><div style={{ color: "#888", fontSize: "12px" }}>Đang Follow</div></div>
          <div style={{ textAlign: "center" }}><b>1.5K</b><div style={{ color: "#888", fontSize: "12px" }}>Thích</div></div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button onClick={() => setShowEdit(true)} style={{ flex: 1, padding: "10px", background: "#333", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold" }}>Sửa hồ sơ</button>
          <button onClick={() => setActiveTab("shop")} style={{ flex: 1, padding: "10px", background: "#ff0050", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold" }}>Shop 🛍️</button>
        </div>
      </div>

      {/* 3. Tabs */}
      <div style={{ marginTop: "20px", display: "flex", borderBottom: "1px solid #333" }}>
        <div onClick={() => setActiveTab("video")} style={{ flex: 1, textAlign: "center", padding: "15px", borderBottom: activeTab === "video" ? "2px solid #ff0050" : "none", color: activeTab === "video" ? "white" : "#888" }}>Video</div>
        <div onClick={() => setActiveTab("shop")} style={{ flex: 1, textAlign: "center", padding: "15px", borderBottom: activeTab === "shop" ? "2px solid #ff0050" : "none", color: activeTab === "shop" ? "white" : "#888" }}>Cửa hàng</div>
      </div>

      {/* 4. Content */}
      <div style={{ minHeight: "200px", padding: "5px" }}>
        {activeTab === "video" && (
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>
              <div style={{ height: "150px", background: "#222" }}></div>
              <div style={{ height: "150px", background: "#333" }}></div>
              <div style={{ height: "150px", background: "#444" }}></div>
           </div>
        )}

        {/* --- 🟢 TAB SHOP BÁN HÀNG --- */}
        {activeTab === "shop" && (
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "10px" }}>
              <div style={{ background: "#1a1a1a", borderRadius: "10px", padding: "10px" }}>
                 <div style={{ height: "120px", background: "#333", borderRadius: "8px", marginBottom: "10px", display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px' }}>👕</div>
                 <h4 style={{ margin: 0, fontSize: "14px" }}>Áo Thun Pi</h4>
                 <p style={{ color: "#ff0050", fontWeight: "bold" }}>10 π</p>
                 <button onClick={() => handleBuy("Áo Thun Pi", 10)} style={{ width: "100%", padding: "8px", marginTop: "5px", background: "#00f2ea", border: "none", color: "black", fontWeight:"bold", borderRadius: "5px" }}>Mua ngay</button>
              </div>
              
              <div style={{ background: "#1a1a1a", borderRadius: "10px", padding: "10px" }}>
                 <div style={{ height: "120px", background: "#333", borderRadius: "8px", marginBottom: "10px", display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px' }}>🔑</div>
                 <h4 style={{ margin: 0, fontSize: "14px" }}>Móc Khóa Vàng</h4>
                 <p style={{ color: "#ff0050", fontWeight: "bold" }}>5 π</p>
                 <button onClick={() => handleBuy("Móc Khóa Vàng", 5)} style={{ width: "100%", padding: "8px", marginTop: "5px", background: "#00f2ea", border: "none", color: "black", fontWeight:"bold", borderRadius: "5px" }}>Mua ngay</button>
              </div>
           </div>
        )}
      </div>

      {showEdit && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
           <div style={{ background: "#222", padding: "20px", borderRadius: "15px", width: "90%" }}>
              <h3>Chỉnh sửa hồ sơ</h3>
              <input style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px" }} placeholder="Tên hiển thị" />
              <div style={{ display: "flex", gap: "10px" }}>
                 <button onClick={() => setShowEdit(false)} style={{ flex: 1, padding: "10px", background: "#555", border: "none", color: "white", borderRadius: "5px" }}>Hủy</button>
                 <button onClick={() => setShowEdit(false)} style={{ flex: 1, padding: "10px", background: "#ff0050", border: "none", color: "white", borderRadius: "5px" }}>Lưu</button>
              </div>
           </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
