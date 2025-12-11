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
  
  // State quản lý hiển thị
  const [showCommentInput, setShowCommentInput] = useState(false); 
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(video.comments || []);
  const [isSending, setIsSending] = useState(false);
  
  // State quản lý mở rộng miêu tả
  const [expandDesc, setExpandDesc] = useState(false);

  // Tự động phát
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setExpandDesc(false); // Lướt đi thì tự thu nhỏ miêu tả lại
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
        setShowCommentInput(false);
      }
    } catch (error) { alert("Lỗi gửi!"); } 
    finally { setIsSending(false); }
  };

  return (
    <div style={{ height: '100vh', position: 'relative', scrollSnapAlign: 'start', backgroundColor: 'black' }}>
      
      <video 
        ref={videoRef}
        src={video.videoUrl} 
        loop playsInline 
        onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
      />

      {/* --- CÁC NÚT BÊN PHẢI (ĐÃ CHỈNH LẠI VỊ TRÍ CHO CÂN ĐỐI) --- */}
      <div style={{ position: 'absolute', right: '10px', bottom: '100px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', zIndex: 20 }}>
        
        {/* Avatar */}
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid white', overflow: 'hidden', marginBottom: '5px' }}>
           <img src="https://via.placeholder.com/50" alt="avt" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>

        {/* Tim */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <span style={{ fontSize: '32px' }}>{isLiked ? '❤️' : '🤍'}</span>
            </button>
            <div style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 2px black', color: 'white' }}>{likesCount}</div>
        </div>

        {/* Comment */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={() => setShowCommentInput(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <span style={{ fontSize: '30px' }}>💬</span>
            </button>
            <div style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 2px black', color: 'white' }}>{commentsList.length}</div>
        </div>

        {/* Share */}
        <div style={{ textAlign: 'center' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <span style={{ fontSize: '30px' }}>↗️</span>
            </button>
            <div style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 2px black', color: 'white' }}>Chia sẻ</div>
        </div>
      </div>

      {/* --- PHẦN MIÊU TẢ THÔNG MINH (Bấm vào nở ra) --- */}
      <div 
        onClick={() => setExpandDesc(!expandDesc)} // Bấm vào để mở/đóng
        style={{ 
          position: 'absolute', 
          bottom: '0', 
          left: '0', 
          width: '100%', 
          padding: '15px 15px 80px 15px', // Padding đáy lớn để tránh menu
          background: expandDesc ? "rgba(0, 0, 0, 0.7)" : "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          backdropFilter: expandDesc ? "blur(10px)" : "none", // Hiệu ứng mờ khi mở rộng
          transition: "all 0.3s ease",
          maxHeight: expandDesc ? "40vh" : "150px", // Mở rộng lên 40% màn hình
          overflowY: expandDesc ? "auto" : "hidden",
          borderTopRightRadius: "20px",
          borderTopLeftRadius: "20px",
          zIndex: 15
        }}
      >
        <h4 style={{ margin: 0, fontWeight: 'bold', textShadow: '1px 1px 2px black', color: 'white', marginBottom: '5px' }}>
          @{video.author?.username || 'Pi Pioneer'}
          <span style={{fontSize:'12px', fontWeight:'normal', color:'#ddd', marginLeft:'10px'}}>• 12/12/2025</span>
        </h4>
        
        <p style={{ 
          margin: '0', fontSize: '15px', lineHeight: '1.5', color: 'white',
          textShadow: '1px 1px 2px black',
          display: expandDesc ? 'block' : '-webkit-box', 
          WebkitLineClamp: expandDesc ? 'unset' : 1, // Nếu đóng thì hiện 1 dòng
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden' 
        }}>
          {video.caption}
        </p>
        
        {!expandDesc && <span style={{fontSize:'12px', color:'#aaa', fontWeight:'bold'}}>...Xem thêm</span>}
        
        {expandDesc && (
           <div style={{marginTop: '10px', fontSize: '13px', color: '#ff0050'}}>
              #PiNetwork #ConnectWeb3 #Trend
           </div>
        )}
      </div>

      {/* --- CỬA SỔ COMMENT (Giữ nguyên vì đã tốt) --- */}
      {showCommentInput && (
        <div style={{ 
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60vh', 
            background: 'rgba(0,0,0,0.9)', borderTopLeftRadius: '15px', borderTopRightRadius: '15px',
            padding: '15px', display: 'flex', flexDirection: 'column', zIndex: 100,
            animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
             <span style={{fontWeight:'bold', color:'white'}}>Bình luận ({commentsList.length})</span>
             <button onClick={() => setShowCommentInput(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize:'20px' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {commentsList.map((cmt: any, i: number) => (
              <div key={i} style={{ marginBottom: '15px', display:'flex', gap:'10px' }}>
                <div style={{width:'30px', height:'30px', background:'#555', borderRadius:'50%'}}></div>
                <div>
                    <div style={{fontSize:'12px', color:'#aaa', fontWeight:'bold'}}>{cmt.user?.username || "Ẩn danh"}</div>
                    <div style={{fontSize:'14px', color:'white'}}>{cmt.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems:'center' }}>
            <input type="text" placeholder="Thêm bình luận..." value={commentText} onChange={(e) => setCommentText(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', background: '#333', color: 'white' }} />
            <button onClick={handleSendComment} disabled={isSending} style={{ color: '#ff0050', fontWeight: 'bold', background: 'none', border: 'none', fontSize:'20px' }}>➤</button>
          </div>
        </div>
      )}
      <style jsx>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}
