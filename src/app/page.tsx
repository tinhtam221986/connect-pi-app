"use client";

import React, { useState, useEffect } from 'react';
import VideoCard from '@/components/VideoCard';
import BottomNav from '@/components/BottomNav';
import { usePi } from "@/components/PiSDKProvider";
import Script from "next/script";

export default function HomePage() {
  const { user, setUser } = usePi() || {};
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  
  // 1. Lấy danh sách video (Chạy ngầm)
  useEffect(() => {
    fetch('/api/videos').then(res => res.json()).then(data => setVideos(data.videos || []));
  }, []);

  // 2. Hàm Đăng Nhập (Chìa khóa mở cổng)
  const handleLogin = async () => {
    setLoading(true);
    try {
      const Pi = (window as any).Pi;
      if (!Pi) { alert("⚠️ Đang tải Pi SDK, vui lòng bấm lại sau 2 giây!"); setLoading(false); return; }

      // Khởi động Pi
      try { await Pi.init({ version: "2.0", sandbox: true }); } catch (e) {}

      // Xin quyền
      const scopes = ['username', 'payments'];
      const auth = await Pi.authenticate(scopes, (payment: any) => console.log(payment));
      
      alert("🎉 Xin chào " + auth.user.username + "! Chào mừng đến với Connect.");
      
      // Lưu user và Gọi API tạo hộ khẩu
      setUser(auth.user);
      fetch("/api/user", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: auth.user.username, user_uid: auth.user.uid }),
      });

    } catch (err: any) {
      alert("❌ Lỗi Đăng Nhập: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  // --- 🚪 PHẦN 1: MÀN HÌNH CHÀO (Nếu chưa đăng nhập) ---
  if (!user) {
    return (
      <div style={{ 
        height: '100vh', width: '100vw', 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        color: 'white', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center'
      }}>
        {/* Nạp SDK */}
        <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" />

        {/* Logo & Intro */}
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚀</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', background: '-webkit-linear-gradient(#00f2ea, #ff0050)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 10px 0' }}>
          CONNECT
        </h1>
        <p style={{ color: '#aaa', fontSize: '14px', maxWidth: '300px', lineHeight: '1.5' }}>
          Mạng xã hội Video Web3 đầu tiên trên Pi Network.
          <br/>Kiếm tiền, Kết nối & Sáng tạo.
        </p>

        {/* Nút Đăng Nhập Thần Thánh */}
        <div style={{ marginTop: '50px', width: '100%', maxWidth: '300px' }}>
          <button 
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: '30px', border: 'none',
              background: 'linear-gradient(to right, #00f2ea, #ff0050)',
              color: 'white', fontWeight: 'bold', fontSize: '18px',
              boxShadow: '0 0 20px rgba(255, 0, 80, 0.4)',
              cursor: 'pointer', opacity: loading ? 0.7 : 1,
              animation: 'pulse 2s infinite'
            }}
          >
            {loading ? "Đang kết nối..." : "🔑 ĐĂNG NHẬP BẰNG PI"}
          </button>
          
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            Bằng việc tiếp tục, bạn đồng ý với <span style={{textDecoration:'underline'}}>Sách trắng</span> & <span style={{textDecoration:'underline'}}>Chính sách bảo mật</span>.
          </p>
        </div>
        
        <style jsx>{`@keyframes pulse { 0% {transform: scale(1);} 50% {transform: scale(1.03);} 100% {transform: scale(1);} }`}</style>
      </div>
    );
  }

  // --- 🎬 PHẦN 2: GIAO DIỆN CHÍNH (Nếu đã đăng nhập) ---
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', paddingBottom: '0', color: 'white' }}>
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)', padding: '15px 0', display: 'flex', justifyContent: 'center', gap: '20px', fontWeight: 'bold' }}>
        <span style={{ opacity: 0.7 }}>Bạn bè</span>
        <span style={{ borderBottom: '2px solid white' }}>Đề xuất</span>
        <a href="/search" style={{ position: 'absolute', right: '15px', textDecoration:'none', fontSize: '24px' }}>🔍</a>
      </div>
      
      {/* Danh sách video */}
      <div>
        {videos.length === 0 ? (
           <div style={{ display:'flex', height:'100vh', justifyContent:'center', alignItems:'center', color:'#555' }}>
              Đang tải video...
           </div>
        ) : (
           videos.map((video: any) => <VideoCard key={video._id} video={video} />)
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
