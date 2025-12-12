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
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // 🟢 SỬA LỖI TẠI ĐÂY: Thêm chữ 'number' để máy hiểu
    setLikesCount((prev: number) => newLikedState ? prev + 1 : prev - 1);
    
    try {
      await fetch("/api/like", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video._id, action: newLikedState ? 'like' : 'unlike' }),
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
    const link = `${window.location.origin}?video=${video._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Connect Pi App', text: video.caption, url: link }); } catch (err) {}
    } else {
      try { await navigator.clipboard.writeText(link); alert("✅ Đã sao chép link!"); } 
      catch (err) { prompt("Copy link:", link); }
    }
  };

  const handleDonate = () => { alert("🎁 Tính năng tặng quà đang được tích hợp ví Pi!"); };

  return (
    <div style={{ height: '100vh', position: 'relative', scrollSnapAlign: 'start', backgroundColor: 'black' }}>
      <video ref={videoRef} src={video.videoUrl} loop playsInline onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      
      <div style={{ position: 'absolute', right: '10px', bottom: '120px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', zIndex: 20 }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid white', overflow: 'hidden' }}>
           <img src="https://via.placeholder.com/50" alt="avt" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div style={{ textAlign: 'center' }}>
            <button onClick={handleLike} style={{ background: 'none', border: 'none' }}><span style={{fontSize:'35px'}}>{isLiked ? '❤️' : '🤍'}</span></button>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>{likesCount}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
            <button onClick={() => setShowCommentInput(true)} style={{ background: 'none', border: 'none' }}><span style={{fontSize:'32px'}}>💬</span></button>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>{commentsList.length}</div>
        </div>
        <button onClick={handleDonate} style={{ background: 'none', border: 'none' }}><span style={{fontSize:'32px'}}>🎁</span></button>
        <button onClick={handleShare} style={{ background: 'none', border: 'none' }}><span style={{fontSize:'32px'}}>↗️</span></button>
      </div>

      <div onClick={() => setExpandDesc(!expandDesc)} style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '15px 15px 80px 15px', background: expandDesc ? "rgba(0, 0, 0, 0.8)" : "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", backdropFilter: expandDesc ? "blur(10px)" : "none", transition: "all 0.3s ease", maxHeight: expandDesc ? "50vh" : "150px", overflowY: expandDesc ? "auto" : "hidden", borderTopRightRadius: "20px", borderTopLeftRadius: "20px", zIndex: 15 }}>
        <h4 style={{ margin: 0, fontWeight: 'bold', textShadow: '1px 1px 2px black', color: 'white' }}>@{video.author?.username || 'Pi Pioneer'}</h4>
        <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.5', color: 'white', textShadow: '1px 1px 2px black', display: expandDesc ? 'block' : '-webkit-box', WebkitLineClamp: expandDesc ? 'unset' : 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{video.caption}</p>
      </div>

      {showCommentInput && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60vh', background: 'rgba(0,0,0,0.95)', borderTopLeftRadius: '15px', borderTopRightRadius: '15px', padding: '15px', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}><span style={{fontWeight:'bold', color:'white'}}>Bình luận ({commentsList.length})</span><button onClick={() => setShowCommentInput(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize:'20px' }}>✕</button></div>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>{commentsList.map((cmt: any, i: number) => (<div key={i} style={{ marginBottom: '15px' }}><b style={{color:'#aaa'}}>{cmt.user?.username}:</b> <span style={{color:'white'}}>{cmt.text}</span></div>))}</div>
          <div style={{ display: 'flex', gap: '10px' }}><input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '20px', background: '#333', color: 'white', border: 'none' }} /><button onClick={handleSendComment} style={{ color: '#ff0050', background: 'none', border: 'none', fontWeight:'bold' }}>Gửi</button></div>
        </div>
      )}
    </div>
  );
      }
