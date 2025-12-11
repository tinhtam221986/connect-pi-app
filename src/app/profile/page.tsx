"use client";

import React, { useState } from 'react';
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("video"); 
  const [showEdit, setShowEdit] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Pi Pioneer",
    bio: "Thành viên tích cực của Connect Web3 🚀",
    email: "contact@connect.pi",
    phone: "09xxx"
  });

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "80px" }}>
      
      {/* 1. Header Cover */}
      <div style={{ position: "relative", height: "150px", background: "linear-gradient(45deg, #1cb5e0 0%, #000851 100%)" }}></div>

      {/* 2. Avatar & Info */}
      <div style={{ padding: "0 20px", marginTop: "-50px", position: "relative" }}>
        <div style={{ 
          width: "100px", height: "100px", borderRadius: "50%", 
          border: "4px solid black", backgroundColor: "#333",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
        }}>
          <img src="https://via.placeholder.com/100" style={{ width: '100%', height: '100%' }} />
        </div>
        
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "bold" }}>@{userInfo.name}</h1>
          <p style={{ color: "#aaa", fontSize: "14px" }}>{userInfo.bio}</p>
          <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#888', marginTop: '5px' }}>
             <span>📧 {userInfo.email}</span>
             <span>📞 {userInfo.phone}</span>
          </div>
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
          <button onClick={() => setActiveTab("shop")} style={{ flex: 1, padding: "10px", background: "#ff0050", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold" }}>Shop của tôi 🛍️</button>
        </div>
      </div>

      {/* 3. Tabs */}
      <div style={{ marginTop: "20px", display: "flex", borderBottom: "1px solid #333" }}>
        <div onClick={() => setActiveTab("video")} style={{ flex: 1, textAlign: "center", padding: "15px", borderBottom: activeTab === "video" ? "2px solid #ff0050" : "none", color: activeTab === "video" ? "white" : "#888" }}>Video</div>
        <div onClick={() => setActiveTab("shop")} style={{ flex: 1, textAlign: "center", padding: "15px", borderBottom: activeTab === "shop" ? "2px solid #ff0050" : "none", color: activeTab === "shop" ? "white" : "#888" }}>Cửa hàng</div>
      </div>

      {/* 4. Content */}
      <div style={{ minHeight: "200px", padding: "5px" }}>
        
        {/* Tab Video */}
        {activeTab === "video" && (
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>
              <div style={{ height: "150px", background: "#222" }}></div>
              <div style={{ height: "150px", background: "#333" }}></div>
              <div style={{ height: "150px", background: "#444" }}></div>
           </div>
        )}

        {/* Tab Shop (Demo) */}
        {activeTab === "shop" && (
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "10px" }}>
              {/* Sản phẩm mẫu 1 */}
              <div style={{ background: "#222", borderRadius: "10px", padding: "10px" }}>
                 <div style={{ height: "120px", background: "#444", borderRadius: "8px", marginBottom: "10px" }}></div>
                 <h4 style={{ margin: 0, fontSize: "14px" }}>Áo thun Pi Network</h4>
                 <p style={{ color: "#ff0050", fontWeight: "bold" }}>10 Pi</p>
                 <button style={{ width: "100%", padding: "5px", marginTop: "5px", background: "#333", border: "1px solid #555", color: "white", borderRadius: "5px" }}>Mua ngay</button>
              </div>
              {/* Sản phẩm mẫu 2 */}
              <div style={{ background: "#222", borderRadius: "10px", padding: "10px" }}>
                 <div style={{ height: "120px", background: "#444", borderRadius: "8px", marginBottom: "10px" }}></div>
                 <h4 style={{ margin: 0, fontSize: "14px" }}>Móc khóa Pi Gold</h4>
                 <p style={{ color: "#ff0050", fontWeight: "bold" }}>5 Pi</p>
                 <button style={{ width: "100%", padding: "5px", marginTop: "5px", background: "#333", border: "1px solid #555", color: "white", borderRadius: "5px" }}>Mua ngay</button>
              </div>
           </div>
        )}
      </div>

      {/* --- POPUP CHỈNH SỬA HỒ SƠ --- */}
      {showEdit && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
           <div style={{ background: "#222", padding: "20px", borderRadius: "15px", width: "90%" }}>
              <h3>Chỉnh sửa hồ sơ</h3>
              <input style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px", border: "none" }} placeholder="Tên hiển thị" defaultValue={userInfo.name} />
              <textarea style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px", border: "none" }} placeholder="Tiểu sử" defaultValue={userInfo.bio} />
              <input style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px", border: "none" }} placeholder="Email/SĐT" defaultValue={userInfo.email} />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                 <button onClick={() => setShowEdit(false)} style={{ flex: 1, padding: "10px", background: "#555", border: "none", color: "white", borderRadius: "5px" }}>Hủy</button>
                 <button onClick={() => { alert("Đã lưu!"); setShowEdit(false); }} style={{ flex: 1, padding: "10px", background: "#ff0050", border: "none", color: "white", borderRadius: "5px" }}>Lưu</button>
              </div>
           </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
}
