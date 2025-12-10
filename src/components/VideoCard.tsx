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

  // Tự động phát khi lướt tới
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
      }, { threshold: 0.6 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
    try {
      await fetch("/api/like", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video._id, action: newIsLiked ? 'like' : 'unlike' }),
      });
    } catch (e) { console.error(e); }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/comment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video._id, text: commentText }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentsList(data.comments);
        setCommentText("");
        setShowCommentInput(false); // <--- QUAN TRỌNG: Đóng cửa sổ ngay khi gửi xong
      }
    } catch (error) { alert("Lỗi gửi!"); } 
    finally { setIsSending(false); }
  };

  return (
    <div style={{ height: '100vh', position: 'relative', scrollSnapAlign: 'start', backgroundColor: 'black' }}>
      
      {/* VIDEO PLAYER */}
      <video 
        ref={videoRef}
        src={video.videoUrl} 
        loop playsInline 
        onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }} // Chỉnh lại height 100% để không bị che
      />

      {/* --- CÁC NÚT BÊN PHẢI (STYLE SVG RỖNG RUỘT) --- */}
      <div style={{ position: 'absolute', right: '10px', bottom: '120px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', zIndex: 20 }}>
        
        {/* Avatar */}
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid white', padding: '1px', marginBottom: '10px' }}>
           <img src="https://via.placeholder.com/50" alt="avt" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
           <div style={{position:'absolute', bottom: '65%', background: '#ff0050', borderRadius: '50%', width: '18px', height: '18px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px'}}>+</div>
        </div>

        {/* Nút TIM (SVG) */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="35" height="35" viewBox="0 0 24 24" fill={isLiked ? "#ff0050" : "none"} stroke={isLiked ? "none" : "white"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 2px black' }}>{likesCount}</div>
        </div>

        {/* Nút COMMENT (SVG) */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={() => setShowCommentInput(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="33" height="33" viewBox="0 0 24 24" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>
            <div style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 2px black' }}>{commentsList.length}</div>
        </div>

        {/* Nút SHARE (SVG) */}
        <div style={{ textAlign: 'center' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="33" height="33" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
            <div style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 2px black' }}>Chia sẻ</div>
        </div>
      </div>

      {/* --- PHẦN MÔ TẢ (CAPTION) --- */}
      {/* Đã sửa: Chữ trắng có bóng đen, không có khung nền, width 75% để tránh nút bấm */}
      <div style={{ position: 'absolute', bottom: '20px', left: '10px', width: '75%', zIndex: 10 }}>
        <h4 style={{ margin: 0, fontWeight: 'bold', textShadow: '1px 1px 2px black' }}>@{video.author?.username || 'Pi Pioneer'}</h4>
        <p style={{ 
          margin: '8px 0', fontSize: '15px', lineHeight: '1.4', 
          textShadow: '1px 1px 2px black', // Bóng đổ giúp đọc rõ trên mọi nền
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' // Giới hạn 2 dòng
        }}>
          {video.caption}
        </p>
        <div style={{fontSize: '12px', fontWeight: 'bold', display:'flex', alignItems:'center', gap: '5px'}}>
           <span>♫ Âm thanh gốc</span>
        </div>
      </div>

      {/* --- CỬA SỔ COMMENT --- */}
      {showCommentInput && (
        <div style={{ 
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60vh', 
            background: 'rgba(0,0,0,0.9)', borderTopLeftRadius: '15px', borderTopRightRadius: '15px',
            padding: '15px', display: 'flex', flexDirection: 'column', zIndex: 100,
            animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
             <span style={{fontWeight:'bold'}}>Bình luận ({commentsList.length})</span>
             <button onClick={() => setShowCommentInput(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize:'20px' }}>✕</button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {commentsList.map((cmt: any, i: number) => (
              <div key={i} style={{ marginBottom: '15px', display:'flex', gap:'10px' }}>
                <div style={{width:'30px', height:'30px', background:'#555', borderRadius:'50%'}}></div>
                <div>
                    <div style={{fontSize:'12px', color:'#aaa', fontWeight:'bold'}}>{cmt.user?.username || "Ẩn danh"}</div>
                    <div style={{fontSize:'14px'}}>{cmt.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems:'center' }}>
            <input 
                type="text" placeholder="Thêm bình luận..." value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', background: '#333', color: 'white' }}
            />
            <button onClick={handleSendComment} disabled={isSending} style={{ color: '#ff0050', fontWeight: 'bold', background: 'none', border: 'none', fontSize:'20px' }}>
               {isSending ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
      
      {/* Style animation cho cửa sổ comment */}
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
