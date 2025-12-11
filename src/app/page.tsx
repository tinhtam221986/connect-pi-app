import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Video from '@/models/Video';
import VideoCard from '@/components/VideoCard';

export const dynamic = "force-dynamic"; 

async function getVideos() {
  try {
    await connectDB();
    const videos = await Video.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(videos));
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const videos = await getVideos();

  return (
    // paddingBottom = 0 để video tràn xuống dưới thanh menu
    <div style={{ backgroundColor: 'black', minHeight: '100vh', paddingBottom: '0', color: 'white' }}>
      
      {/* HEADER KIỂU TIKTOK (Trong suốt) */}
      <div style={{ 
        position: 'fixed', top: 0, width: '100%', zIndex: 50, 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)', 
        padding: '15px 0', 
        display: 'flex', justifyContent: 'center', gap: '20px',
        fontWeight: 'bold', fontSize: '16px', textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        <span style={{ opacity: 0.7 }}>Bạn bè</span>
        <span style={{ opacity: 0.7 }}>Đang Follow</span>
        <div style={{ position: 'relative', color: 'white', borderBottom: '2px solid white', paddingBottom: '3px' }}>
          Đề xuất
          {/* Chấm đỏ thông báo */}
          <div style={{ position: 'absolute', top: '-2px', right: '-6px', width: '6px', height: '6px', background: 'red', borderRadius: '50%' }}></div>
        </div>
        <span style={{ position: 'absolute', right: '15px', fontSize: '20px' }}>🔍</span>
      </div>

      {/* DANH SÁCH VIDEO */}
      <div>
        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '40vh' }}>
            <div style={{ fontSize: '50px' }}>🎬</div>
            <p style={{ color: '#888' }}>Chưa có video nào.</p>
          </div>
        ) : (
          videos.map((video: any) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
}
