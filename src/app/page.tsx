import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Video from '@/models/Video';

// Hàm lấy video từ Database (Chạy trên Server nên cực nhanh và bảo mật)
async function getVideos() {
  try {
    await connectDB();
    // Lấy tất cả video, sắp xếp cái mới nhất lên đầu
    const videos = await Video.find().sort({ createdAt: -1 });
    // Chuyển dữ liệu sang dạng text để không bị lỗi React
    return JSON.parse(JSON.stringify(videos));
  } catch (error) {
    console.error("Lỗi lấy video:", error);
    return [];
  }
}

export default async function HomePage() {
  const videos = await getVideos();

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Tiêu đề */}
      <div style={{ 
        position: 'fixed', top: 0, width: '100%', zIndex: 50, 
        background: 'rgba(0,0,0,0.5)', padding: '15px', textAlign: 'center', color: 'white', fontWeight: 'bold' 
      }}>
        🔥 Xu Hướng Pi
      </div>

      {/* Danh sách Video */}
      <div style={{ marginTop: '60px' }}>
        {videos.length === 0 ? (
          <p style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
            Chưa có video nào. Bác hãy là người đầu tiên đăng bài đi! 🎬
          </p>
        ) : (
          videos.map((video: any) => (
            <div key={video._id} style={{ marginBottom: '20px', position: 'relative' }}>
              
              {/* Trình phát Video */}
              <video 
                src={video.videoUrl} 
                controls 
                style={{ width: '100%', maxHeight: '80vh', objectFit: 'cover' }} 
              />

              {/* Thông tin Video */}
              <div style={{ padding: '10px', color: 'white' }}>
                <h4 style={{ margin: 0, color: '#facc15' }}>@{video.author?.username || 'Pi User'}</h4>
                <p style={{ margin: '5px 0' }}>{video.caption}</p>
                <div style={{ fontSize: '12px', color: '#aaa' }}>
                  ❤️ {video.likes?.length || 0} tim • 💬 {video.comments?.length || 0} bình luận
                </div>
              </div>
              
              <hr style={{ borderColor: '#333' }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
