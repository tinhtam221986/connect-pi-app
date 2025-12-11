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
            setExpandDesc(false);
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

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Connect Pi', url: window.location.href }); } catch (err) {}
    } else {
      alert("Đã sao chép link!");
    }
  };

  // --- 🟢 TÍNH NĂNG DONATE (MỚI) ---
  const handleDonate = () => {
    // Sau này sẽ gọi Pi SDK Payment tại đây
    const amount = prompt("Nhập số Pi muốn tặng cho tác giả:", "1");
    if (amount) {
      alert(`🎉 Cảm ơn bác! Đã gửi lệnh tặng ${amount} Pi đến @${video.author?.username}`);
      // Hiệu ứng pháo hoa sẽ làm sau
    }
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

      {/* THANH CÔNG CỤ BÊN PHẢI */}
      <div style={{ position: 'absolute', right: '10px', bottom: '100px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center', zIndex: 20 }}>
        
        {/* Avatar */}
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid white', overflow: 'hidden', marginBottom: '5px' }}>
           <img src="https://via.placeholder.com/50" alt="avt" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>

        {/* Tim */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill={isLiked ? "#ff0050" : "rgba(255,255,255,0.2)"} stroke={isLiked ? "none" : "white"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div style={{ fontSize: '11px', fontWeight: 'bold', textShadow: '0 1px 2px black', color: 'white' }}>{likesCount}</div>
        </div>

        {/* Comment */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={() => setShowCommentInput(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>
            <div style={{ fontSize: '11px', fontWeight: 'bold', textShadow: '0 1px 2px black', color: 'white' }}>{commentsList.length}</div>
        </div>

        {/* 🎁 NÚT DONATE (MỚI) */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={handleDonate} style={{ background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <span style={{ fontSize: '30px' }}>🎁</span>
            </button>
            <div style={{ fontSize: '11px', fontWeight: 'bold', textShadow: '0 1px 2px black', color: 'white' }}>Tặng quà</div>
        </div>

        {/* Share */}
        <div style={{ textAlign: 'center' }}>
            <button onClick={handleShare} style={{ background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
            <div style={{ fontSize: '11px', fontWeight: 'bold', textShadow: '0 1px 2px black', color: 'white' }}>Chia sẻ</div>
        </div>
      </div>

      {/* MIÊU TẢ & COMMENT (Giữ nguyên code xịn trước đó) */}
      <div onClick={() => setExpandDesc(!expandDesc)} style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '15px 15px 80px 15px', background: expandDesc ? "rgba(0, 0, 0, 0.8)" : "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", backdropFilter: expandDesc ? "blur(10px)" : "none", transition: "all 0.3s ease", maxHeight: expandDesc ? "50vh" : "150px", overflowY: expandDesc ? "auto" : "hidden", borderTopRightRadius: "20px", borderTopLeftRadius: "20px", zIndex: 15 }}>
        <h4 style={{ margin: 0, fontWeight: 'bold', textShadow: '1px 1px 2px black', color: 'white', marginBottom: '5px' }}>@{video.author?.username || 'Pi Pioneer'}</h4>
        <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.5', color: 'white', textShadow: '1px 1px 2px black', display: expandDesc ? 'block' : '-webkit-box', WebkitLineClamp: expandDesc ? 'unset' : 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{video.caption}</p>
        {!expandDesc && <span style={{fontSize:'12px', color:'#aaa'}}>...Xem thêm</span>}
      </div>

      {showCommentInput && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60vh', background: 'rgba(0,0,0,0.95)', borderTopLeftRadius: '15px', borderTopRightRadius: '15px', padding: '15px', display: 'flex', flexDirection: 'column', zIndex: 100, animation: 'slideUp 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}><span style={{fontWeight:'bold', color:'white'}}>Bình luận ({commentsList.length})</span><button onClick={() => setShowCommentInput(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize:'20px' }}>✕</button></div>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>{commentsList.map((cmt: any, i: number) => (<div key={i} style={{ marginBottom: '15px', display:'flex', gap:'10px' }}><div style={{width:'30px', height:'30px', background:'#555', borderRadius:'50%'}}></div><div><div style={{fontSize:'12px', color:'#aaa', fontWeight:'bold'}}>{cmt.user?.username || "Ẩn danh"}</div><div style={{fontSize:'14px', color:'white'}}>{cmt.text}</div></div></div>))}</div>
          <div style={{ display: 'flex', gap: '10px', alignItems:'center' }}><input type="text" placeholder="Thêm bình luận..." value={commentText} onChange={(e) => setCommentText(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '20px', border: 'none', background: '#333', color: 'white' }} /><button onClick={handleSendComment} disabled={isSending} style={{ color: '#ff0050', fontWeight: 'bold', background: 'none', border: 'none', fontSize:'20px' }}>➤</button></div>
        </div>
      )}
      <style jsx>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}
