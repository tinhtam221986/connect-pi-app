import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Video from '@/models/Video';

// --- QUAN TRỌNG: Dòng này bắt buộc Server lấy dữ liệu mới liên tục ---
export const dynamic = "force-dynamic"; 

async function getVideos() {
  try {
    await connectDB();
    // Lấy video mới nhất lên đầu
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
      {/* Header */}
      <div style={{ 
        position: 'fixed', top: 0, width: '100%', zIndex: 50, 
        background: 'rgba(0,0,0,0.8)', padding: '15px', textAlign: 'center', 
        fontWeight: 'bold', borderBottom: '1px solid #333',
        backdropFilter: 'blur(10px)'
      }}>
        🔥 Xu Hướng Pi Network
      </div>

      {/* Danh sách Video */}
      <div style={{ marginTop: '60px' }}>
        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '150px', padding: '20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎬</div>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Chưa có video nào.</p>
            <p style={{ color: '#888' }}>Bác hãy là người đầu tiên đăng bài đi!</p>
            <div style={{ marginTop: '20px', fontSize: '30px' }}>👇</div>
          </div>
        ) : (
          videos.map((video: any) => (
            <div key={video._id} style={{ marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
              
              {/* Video Player */}
              <div style={{ position: 'relative', width: '100%', backgroundColor: '#000' }}>
                <video 
                  src={video.videoUrl} 
                  controls 
                  playsInline
                  style={{ width: '100%', maxHeight: '80vh', display: 'block' }} 
                />
              </div>

              {/* Thông tin bên dưới */}
              <div style={{ padding: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  {/* Avatar giả lập */}
                  <div style={{ 
                    width: '40px', height: '40px', 
                    background: 'linear-gradient(45deg, #ff0050, #00f2ea)', 
                    borderRadius: '50%', marginRight: '10px' 
                  }}></div>
                  
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#fff' }}>
                      {video.author?.username || 'Pi Pioneer'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {new Date(video.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
                
                <p style={{ margin: '0 0 15px 0', fontSize: '15px', lineHeight: '1.5' }}>
                  {video.caption}
                </p>
                
                {/* Nút tương tác giả lập */}
                <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #333', paddingTop: '10px' }}>
                  <span style={{ color: '#fff' }}>❤️ Thích</span>
                  <span style={{ color: '#fff' }}>💬 Bình luận</span>
                  <span style={{ color: '#fff' }}>↗️ Chia sẻ</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
