import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Video from '@/models/Video';
import VideoCard from '@/components/VideoCard';
import BottomNav from '@/components/BottomNav';

export const dynamic = "force-dynamic"; 

async function getVideos() {
  try { await connectDB(); const videos = await Video.find().sort({ createdAt: -1 }); return JSON.parse(JSON.stringify(videos)); } catch { return []; }
}

export default async function HomePage() {
  const videos = await getVideos();
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', paddingBottom: '0', color: 'white' }}>
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)', padding: '15px 0', display: 'flex', justifyContent: 'center', gap: '20px', fontWeight: 'bold' }}>
        <span style={{ opacity: 0.7 }}>Bạn bè</span>
        <span style={{ borderBottom: '2px solid white' }}>Đề xuất</span>
        {/* LINK TÌM KIẾM Ở ĐÂY */}
        <a href="/search" style={{ position: 'absolute', right: '15px', textDecoration:'none', fontSize: '24px' }}>🔍</a>
      </div>
      <div>
        {videos.length === 0 ? <div style={{ textAlign: 'center', paddingTop: '40vh' }}>Loading...</div> : videos.map((video: any) => <VideoCard key={video._id} video={video} />)}
      </div>
      <BottomNav />
    </div>
  );
}
