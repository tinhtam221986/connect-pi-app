"use client";

import React, { useState, useEffect } from 'react';
import BottomNav from "@/components/BottomNav";
import { usePi } from "@/components/PiSDKProvider";

export default function ProfilePage() {
  const { user: piUser, setUser } = usePi() || {}; 
  const [dbUser, setDbUser] = useState<any>(null); 
  const [activeTab, setActiveTab] = useState("video"); 

  const fetchUserData = (uid: string, username: string) => {
      fetch("/api/user", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, user_uid: uid }),
      })
      .then(res => res.json())
      .then(data => { if (data.user) setDbUser(data.user); })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (piUser) fetchUserData(piUser.uid, piUser.username);
  }, [piUser]);

  const handleManualLogin = () => {
    try {
        const Pi = (window as any).Pi;
        const scopes = ['username', 'payments'];
        Pi.authenticate(scopes, (p: any) => console.log(p)).then((auth: any) => {
            alert("✅ Đăng nhập thành công: " + auth.user.username);
            setUser(auth.user);
            fetchUserData(auth.user.uid, auth.user.username);
        }).catch((err: any) => alert("Lỗi Pi: " + JSON.stringify(err)));
    } catch (e) { alert("Hãy mở trên Pi Browser!"); }
  };

  // Xác định tên hiển thị
  const displayName = dbUser?.username || piUser?.username || "Khách";
  const isGuest = displayName === "Khách"; // Kiểm tra có phải khách không

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "100px" }}>
      <div style={{ height: "150px", background: "linear-gradient(45deg, #FF0099, #493240)" }}></div>
      <div style={{ padding: "0 20px", marginTop: "-50px", position: "relative" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "4px solid black", backgroundColor: "#333", display: "flex", justifyContent: "center", alignItems: "center" }}><span style={{fontSize:"50px"}}>👤</span></div>
        
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ margin: 0 }}>@{displayName}</h1>
          
          {/* 🟢 NẾU LÀ KHÁCH -> HIỆN NÚT KÍCH HOẠT */}
          {isGuest ? (
             <button onClick={handleManualLogin} style={{ marginTop: "10px", padding: "10px 20px", background: "#00f2ea", border: "none", borderRadius: "20px", fontWeight: "bold", color: "black", animation: "pulse 1.5s infinite" }}>
               ⚡ KÍCH HOẠT ĐỊNH DANH PI
             </button>
          ) : (
             <div style={{ marginTop: "5px", color: "#00f2ea", fontWeight: "bold" }}>Ví Connect: {dbUser?.balance || 0} π</div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button style={{ flex: 1, padding: "10px", background: "#333", border: "1px solid #555", borderRadius: "8px", color: "white" }}>Sửa hồ sơ</button>
          <button style={{ flex: 1, padding: "10px", background: "#ff0050", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold" }}>Nạp Pi</button>
        </div>
      </div>
      <BottomNav />
      <style jsx>{`@keyframes pulse { 0% {transform: scale(1);} 50% {transform: scale(1.05);} 100% {transform: scale(1);} }`}</style>
    </div>
  );
}
