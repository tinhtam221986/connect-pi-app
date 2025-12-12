"use client";

import React, { useState, useEffect } from 'react';
import BottomNav from "@/components/BottomNav";
import { usePi } from "@/components/PiSDKProvider";
import Script from "next/script"; // 🟢 THÊM CÁI NÀY ĐỂ NẠP LẠI SDK NẾU CẦN

export default function ProfilePage() {
  const { user: piUser, setUser } = usePi() || {}; 
  const [dbUser, setDbUser] = useState<any>(null); 
  const [loading, setLoading] = useState(false);

  // Hàm gọi API Hộ khẩu
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

  // --- 🟢 HÀM KÍCH HOẠT MỚI (CỰC MẠNH) ---
  const handleManualLogin = async () => {
    setLoading(true);
    // 1. Thông báo bắt đầu
    // alert("Đang kết nối đến Pi Network..."); 

    try {
        // 2. Tìm Pi trong máy
        let Pi = (window as any).Pi;
        
        // Nếu không thấy Pi, thử đợi 1 xíu
        if (!Pi) {
            alert("⚠️ Chưa thấy Pi SDK! Đang thử tải lại...");
            await new Promise(r => setTimeout(r, 1000)); // Đợi 1 giây
            Pi = (window as any).Pi;
        }

        if (!Pi) {
            alert("🚨 Lỗi: Vui lòng mở App này bên trong Pi Browser!");
            setLoading(false);
            return;
        }

        // 3. Khởi động Pi (Quan trọng)
        try { 
            Pi.init({ version: "2.0", sandbox: true }); 
        } catch (e) {
            console.log("Pi đã init trước đó rồi, bỏ qua.");
        }

        // 4. Xin quyền đăng nhập
        const scopes = ['username', 'payments'];
        const onIncompletePaymentFound = (payment: any) => { console.log("Thanh toán treo:", payment); };

        Pi.authenticate(scopes, onIncompletePaymentFound).then((auth: any) => {
            alert("🎉 CHÚC MỪNG! Đã định danh thành công: " + auth.user.username);
            setUser(auth.user);
            fetchUserData(auth.user.uid, auth.user.username);
        }).catch((err: any) => {
            // Hiện lỗi chi tiết ra màn hình
            alert("❌ Lỗi từ Pi: " + JSON.stringify(err));
            console.error(err);
        });

    } catch (e: any) {
        alert("❌ Lỗi hệ thống: " + (e.message || JSON.stringify(e)));
    } finally {
        setLoading(false);
    }
  };

  const displayName = dbUser?.username || piUser?.username || "Khách";
  const isGuest = !piUser;

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "100px" }}>
      {/* Nạp lại SDK một lần nữa cho chắc */}
      <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" />

      <div style={{ height: "150px", background: "linear-gradient(45deg, #00f2ea, #ff0050)" }}></div>
      
      <div style={{ padding: "0 20px", marginTop: "-50px", position: "relative" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "4px solid black", backgroundColor: "#222", display: "flex", justifyContent: "center", alignItems: "center", overflow:"hidden" }}>
           {piUser ? <span style={{fontSize:"40px"}}>😎</span> : <span style={{fontSize:"40px"}}>👤</span>}
        </div>
        
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ margin: 0 }}>@{displayName}</h1>
          
          {isGuest ? (
             <button 
               onClick={handleManualLogin} 
               disabled={loading}
               style={{ 
                 marginTop: "15px", padding: "12px 25px", 
                 background: "#00f2ea", border: "none", borderRadius: "30px", 
                 fontWeight: "bold", color: "black", fontSize: "16px",
                 boxShadow: "0 0 15px rgba(0, 242, 234, 0.6)",
                 animation: "pulse 1.5s infinite",
                 opacity: loading ? 0.7 : 1
               }}
             >
               {loading ? "Đang kết nối..." : "⚡ KÍCH HOẠT TÀI KHOẢN PI"}
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
