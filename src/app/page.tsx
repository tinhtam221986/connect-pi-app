import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Video from '@/models/Video';
import VideoCard from '@/components/VideoCard'; // <-- ĐÂY LÀ LINH KIỆN XỊN

// Chống lưu bộ nhớ đệm cũ, luôn tải mới
export const dynamic = "force-dynamic"; 

async function getVideos() {
  try {
    await connectDB();
    const videos = await Video.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(videos));
  } catch (error) {
    console.error("Lỗi lấy video:", error);
    return [];
  }
}

export default async function HomePage() {
  const videos = await getVideos();

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', paddingBottom: '80px', color: 'white' }}>
      {/* Header mờ ảo */}
      <div style={{ 
        position: 'fixed', top: 0, width: '100%', zIndex: 50, 
        background: 'rgba(0,0,0,0.3)', padding: '15px', textAlign: 'center', 
        fontWeight: 'bold', backdropFilter: 'blur(5px)', borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        🔥 Xu Hướng Pi Network
      </div>

      {/* Danh sách Video */}
      <div style={{ marginTop: '0px' }}>
        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40vh', padding: '20px' }}>
            <div style={{ fontSize: '50px' }}>🎬</div>
            <p style={{ color: '#888' }}>Chưa có video nào. Bác mở hàng đi!</p>
          </div>
        ) : (
          // Dùng linh kiện VideoCard để hiển thị
          videos.map((video: any) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
}
