"use client";

import React, { useState, useEffect } from 'react';
import BottomNav from "@/components/BottomNav";
import { usePi } from "@/components/pi/pi-provider";

export default function ProfilePage() {
  const { user, authenticate, isInitialized } = usePi();
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 1. Hàm lấy thông tin từ Server (Hộ khẩu)
  const fetchUserData = (uid: string, username: string) => {
      fetch("/api/user", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, user_uid: uid }),
      })
      .then(res => res.json())
      .then(data => { if (data.user) setDbUser(data.user); })
      .catch(err => console.error("Lỗi lấy data:", err));
  };

  useEffect(() => {
    if (user) fetchUserData(user.uid, user.username);
  }, [user]);

  // 2. Hàm kích hoạt Đăng nhập (Sử dụng Provider)
  const handleLogin = async () => {
    if (!isInitialized) {
        alert("Pi SDK chưa sẵn sàng. Vui lòng đợi hoặc tải lại trang.");
        return;
    }
    setLoading(true);
    try {
        await authenticate();
    } catch (e: any) {
        alert("❌ Lỗi Đăng Nhập: " + (e.message || JSON.stringify(e)));
    } finally {
        setLoading(false);
    }
  };

  const displayName = dbUser?.username || user?.username || "Khách";
  const isGuest = !user;

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "100px" }}>
      <div style={{ height: "150px", background: "linear-gradient(45deg, #00f2ea, #ff0050)" }}></div>
      
      <div style={{ padding: "0 20px", marginTop: "-50px", position: "relative" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "4px solid black", backgroundColor: "#222", display: "flex", justifyContent: "center", alignItems: "center", overflow:"hidden" }}>
           {user ? <span style={{fontSize:"40px"}}>😎</span> : <span style={{fontSize:"40px"}}>👤</span>}
        </div>
        
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ margin: 0 }}>@{displayName}</h1>
          
          {isGuest ? (
             <button 
               onClick={handleLogin}
               disabled={loading || !isInitialized}
               style={{ 
                 marginTop: "15px", padding: "12px 25px", 
                 background: "#00f2ea", border: "none", borderRadius: "30px", 
                 fontWeight: "bold", color: "black", fontSize: "16px",
                 boxShadow: "0 0 15px rgba(0, 242, 234, 0.6)",
                 animation: "pulse 1.5s infinite",
                 opacity: (loading || !isInitialized) ? 0.7 : 1
               }}
             >
               {loading ? "⏳ Đang kết nối..." : "⚡ KÍCH HOẠT TÀI KHOẢN PI"}
             </button>
          ) : (
             <div style={{ marginTop: "5px", color: "#00f2ea", fontWeight: "bold", fontSize:"18px" }}>
                Ví: {dbUser?.balance || 0} π
             </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button style={{ flex: 1, padding: "10px", background: "#333", border: "1px solid #555", borderRadius: "8px", color: "white" }}>Sửa hồ sơ</button>
          <button style={{ flex: 1, padding: "10px", background: "#ff0050", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold" }}>Nạp Pi</button>
        </div>
      </div>
      
      <BottomNav />
      <style jsx>{`@keyframes pulse { 0% {transform: scale(1);} 50% {transform: scale(1.05);} 100% {transform: scale(1);} }`}</style>
    </div>
  );
}
