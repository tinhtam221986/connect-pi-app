"use client";

import React, { useState, useRef, useEffect } from 'react';

interface VideoProps {
  video: {
    _id: string;
    videoUrl: string;
    caption: string;
    author: { username: string };
    likes: string[];
    comments: any[];
    createdAt: string;
  };
}

export default function VideoCard({ video }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);
  const [showCommentInput, setShowCommentInput] = useState(false); 
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(video.comments || []);
  const [isSending, setIsSending] = useState(false);

  // --- BỘ NÃO THÔNG MINH: Tự động phát/dừng khi lướt ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Nếu video hiện trên màn hình -> Phát
          videoRef.current?.play().catch(e => console.log("Chặn tự phát:", e));
        } else {
          // Nếu lướt qua -> Dừng ngay lập tức
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Tua lại từ đầu
          }
        }
      },
      { threshold: 0.6 } // Phải hiện 60% màn hình mới tính
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // Xử lý Like
  const handleLike = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
    try {
      await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video._id, action: newIsLiked ? 'like' : 'unlike' }),
      });
    } catch (error) { console.error(error); }
  };

  // Xử lý Gửi Bình luận
  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video._id, text: commentText }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentsList(data.comments);
        setCommentText("");
      }
    } catch (error) { alert("Lỗi gửi!"); } 
    finally { setIsSending(false); }
  };

  return (
    <div style={{ 
      height: '100vh', // Chiếm trọn màn hình giống TikTok
      position: 'relative', 
      borderBottom: '1px solid #222',
      display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'
    }}>
      
      {/* VIDEO PLAYER */}
      <video 
        ref={videoRef}
        src={video.videoUrl} 
        loop // <-- Lệnh lặp lại vô tận
        playsInline 
        // Lưu ý: Trên mobile lần đầu có thể cần bấm thủ công để bật tiếng
        onClick={(e) => {
            const v = e.currentTarget;
            v.paused ? v.play() : v.pause();
        }}
        style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }} 
      />

      {/* --- CÁC NÚT BẤM NỔI BÊN PHẢI (STYLE TIKTOK) --- */}
      <div style={{ position: 'absolute', right: '10px', bottom: '100px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        
        {/* Avatar */}
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fff', padding: '2px' }}>
           <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'url(https://via.placeholder.com/50) center/cover' }}></div>
        </div>

        {/* Nút TIM */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={handleLike} style={{ background: 'none', border: 'none', fontSize: '35px', color: isLiked ? '#ff0050' : 'white', cursor: 'pointer', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
              {isLiked ? '❤️' : '🤍'}
            </button>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{likesCount}</div>
        </div>

        {/* Nút COMMENT */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={() => setShowCommentInput(!showCommentInput)} style={{ background: 'none', border: 'none', fontSize: '35px', color: 'white', cursor: 'pointer', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
              💬
            </button>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{commentsList.length}</div>
        </div>

        {/* Nút SHARE */}
        <div style={{ textAlign: 'center' }}>
            <button style={{ background: 'none', border: 'none', fontSize: '35px', color: 'white', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>↗️</button>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Chia sẻ</div>
        </div>
      </div>

      {/* --- CAPTION Ở GÓC DƯỚI TRÁI --- */}
      <div style={{ position: 'absolute', bottom: '20px', left: '10px', width: '70%', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        <h4 style={{ margin: 0, fontWeight: 'bold' }}>@{video.author?.username || 'Pi Pioneer'}</h4>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>{video.caption}</p>
      </div>

      {/* --- KHUNG BÌNH LUẬN (Hiện lên khi bấm nút) --- */}
      {showCommentInput && (
        <div style={{ 
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50vh', 
            background: 'rgba(0,0,0,0.9)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
            padding: '15px', display: 'flex', flexDirection: 'column', zIndex: 100
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <span>Bình luận ({commentsList.length})</span>
             <button onClick={() => setShowCommentInput(false)} style={{ background: 'none', border: 'none', color: 'white' }}>✕</button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {commentsList.map((cmt: any, i: number) => (
              <div key={i} style={{ marginBottom: '10px', fontSize: '14px' }}>
                <strong style={{ color: '#aaa' }}>{cmt.user?.username}: </strong> {cmt.text}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
                type="text" placeholder="Thêm bình luận..." value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', background: '#333', color: 'white' }}
            />
            <button onClick={handleSendComment} style={{ color: '#ff0050', fontWeight: 'bold', background: 'none', border: 'none' }}>Gửi</button>
          </div>
        </div>
      )}

    </div>
  );
                       }
