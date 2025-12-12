"use client";

import React, { useState, useEffect } from 'react';
import VideoCard from '@/components/VideoCard';
import BottomNav from '@/components/BottomNav';
import { usePi } from "@/components/PiSDKProvider";

export default function HomePage() {
  const { user, setUser } = usePi() || {};
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    fetch('/api/videos').then(res => res.json()).then(data => setVideos(data.videos || []));
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    
    // 🟢 TĂNG THỜI GIAN CHỜ LÊN 60 GIÂY (Thoải mái luôn)
    const timeout = setTimeout(() => {
        setLoading(false);
        alert("⚠️ Hết giờ kết nối (60s)! Mạng của bác hơi chậm, hãy bấm lại lần nữa nhé.");
    }, 60000);

    try {
      // 🟢 THÊM CƠ CHẾ CHỜ PI SDK (Nếu máy chậm chưa tải xong)
      let Pi = (window as any).Pi;
      if (!Pi) {
          // Thử đợi 3 giây xem Pi có xuất hiện không
          await new Promise(r => setTimeout(r, 3000));
          Pi = (window as any).Pi;
      }

      if (!Pi) { 
          clearTimeout(timeout);
          setLoading(false); 
          alert("🔌 Lỗi: Chưa tìm thấy Pi SDK! Hãy tải lại trang (F5) rồi bấm lại."); 
          return; 
      }

      try { await Pi.init({ version: "2.0", sandbox: true }); } catch (e) {}

      const scopes = ['username', 'payments'];
      // Lệnh quan trọng nhất:
      const auth = await Pi.authenticate(scopes, (payment: any) => console.log(payment));
      
      clearTimeout(timeout); // Hủy báo thức vì đã thành công
      alert("🎉 Đăng nhập thành công! Chào " + auth.user.username);
      
      setUser(auth.user);
      
      // Ghi danh vào sổ
      fetch("/api/user", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: auth.user.username, user_uid: auth.user.uid }),
      });

    } catch (err: any) {
      clearTimeout(timeout); // Hủy báo thức nếu lỗi
      // Nếu người dùng tự bấm Hủy thì không báo lỗi
      if (!JSON.stringify(err).includes("user cancelled")) {
          alert("❌ Lỗi kết nối: " + (err.message || JSON.stringify(err)));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ height: '100vh', width: '100vw', background: 'black', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚀</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', background: '-webkit-linear-gradient(#00f2ea, #ff0050)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0' }}>CONNECT</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '50px' }}>Mạng xã hội Video Web3</p>

        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', maxWidth: '300px', padding: '16px', borderRadius: '30px', border: 'none', background: 'linear-gradient(to right, #00f2ea, #ff0050)', color: 'white', fontWeight: 'bold', fontSize: '18px', opacity: loading ? 0.7 : 1, animation: 'pulse 2s infinite' }}>
            {loading ? "⏳ Đang kết nối..." : "🔑 ĐĂNG NHẬP PI"}
        </button>
        <style jsx>{`@keyframes pulse { 0% {transform: scale(1);} 50% {transform: scale(1.03);} 100% {transform: scale(1);} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', paddingBottom: '0', color: 'white' }}>
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)', padding: '15px 0', display: 'flex', justifyContent: 'center', gap: '20px', fontWeight: 'bold' }}>
        <span style={{ borderBottom: '2px solid white' }}>Dành cho bạn</span>
        <a href="/search" style={{ position: 'absolute', right: '15px', textDecoration:'none', fontSize: '24px' }}>🔍</a>
      </div>
      <div>
        {videos.length === 0 ? <div style={{ display:'flex', height:'100vh', justifyContent:'center', alignItems:'center', color:'#555' }}>Đang tải video...</div> : videos.map((video: any) => <VideoCard key={video._id} video={video} />)}
      </div>
      <BottomNav />
    </div>
  );
}
