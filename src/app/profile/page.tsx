"use client";

import React, { useState, useEffect } from 'react';
import BottomNav from "@/components/BottomNav";
import { usePi } from "@/components/PiSDKProvider";

export default function ProfilePage() {
  const { user: piUser, setUser } = usePi() || {}; 
  const [dbUser, setDbUser] = useState<any>(null); 
  const [activeTab, setActiveTab] = useState("video"); 

  // Hàm gọi ông Hộ tịch (API)
  const fetchUserData = (uid: string, username: string) => {
      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, user_uid: uid }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) setDbUser(data.user);
      })
      .catch(err => console.error("Lỗi sổ hộ khẩu:", err));
  };

  // Tự động gọi khi đã có Pi User
  useEffect(() => {
    if (piUser) {
        fetchUserData(piUser.uid, piUser.username);
    }
  }, [piUser]);

  // --- 🟢 NÚT KÍCH HOẠT THỦ CÔNG ---
  const handleManualLogin = () => {
    try {
        const Pi = (window as any).Pi;
        const scopes = ['username', 'payments'];
        Pi.authenticate(scopes, (p: any) => console.log(p)).then((auth: any) => {
            alert("✅ Đăng nhập thành công! Chào " + auth.user.username);
            setUser(auth.user); // Lưu vào bộ nhớ
            fetchUserData(auth.user.uid, auth.user.username); // Gọi API lưu vào sổ
        }).catch((err: any) => {
            alert("Lỗi Pi: " + JSON.stringify(err));
        });
    } catch (e) {
        alert("Lỗi: Hãy mở bằng Pi Browser!");
    }
  };

  // Nếu chưa có User, dùng tên Khách
  const displayName = dbUser?.username || piUser?.username || "Khách";
  const balance = dbUser?.balance || 0;
  const level = dbUser?.level || 1;

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "100px" }}>
      
      {/* Bìa */}
      <div style={{ height: "150px", background: "linear-gradient(to bottom right, #6a11cb, #2575fc)" }}></div>

      {/* Thông tin */}
      <div style={{ padding: "0 20px", marginTop: "-50px", position: "relative" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "4px solid black", backgroundColor: "#222", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
           <span style={{fontSize: "50px"}}>👤</span>
        </div>
        
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
            @{displayName} 
            {dbUser && <span style={{fontSize:'12px', background:'#ff0050', color:'white', padding:'2px 8px', borderRadius:'10px', marginLeft:'5px', verticalAlign:'middle'}}>LV.{level}</span>}
          </h1>
          
          {/* 🟢 NẾU LÀ KHÁCH -> HIỆN NÚT ĐĂNG NHẬP */}
          {!piUser ? (
              <button 
                onClick={handleManualLogin}
                style={{ marginTop: "10px", padding: "10px 20px", background: "#00f2ea", color: "black", border: "none", borderRadius: "20px", fontWeight: "bold", animation: "pulse 2s infinite" }}
              >
                ⚡ KÍCH HOẠT ĐỊNH DANH PI
              </button>
          ) : (
              <div style={{ marginTop: "5px", fontSize: "16px", fontWeight: "bold", color: "#00f2ea" }}>
                 Ví Connect: {balance} π
              </div>
          )}
        </div>

        {/* Thống kê giả lập */}
        <div style={{ display: "flex", gap: "30px", marginTop: "20px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
          <div style={{ textAlign: "center" }}><b>0</b><div style={{ color: "#888", fontSize: "12px" }}>Follower</div></div>
          <div style={{ textAlign: "center" }}><b>0</b><div style={{ color: "#888", fontSize: "12px" }}>Đang Follow</div></div>
          <div style={{ textAlign: "center" }}><b>0</b><div style={{ color: "#888", fontSize: "12px" }}>Thích</div></div>
        </div>

        {/* Nút chức năng */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button style={{ flex: 1, padding: "12px", background: "#333", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold" }}>Sửa hồ sơ</button>
          <button style={{ flex: 1, padding: "12px", background: "linear-gradient(45deg, #ff0050, #9900f0)", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold" }}>Nạp Pi 💎</button>
        </div>
      </div>

      <div style={{ marginTop: "30px", textAlign: "center", color: "#666" }}>
        <p>Chưa có video nào.</p>
      </div>

      <BottomNav />
      <style jsx>{`@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }`}</style>
    </div>
  );
}
