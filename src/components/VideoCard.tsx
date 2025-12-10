"use client";

import React, { useState } from 'react';

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
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);
  
  // State bật tắt khung comment
  const [showCommentInput, setShowCommentInput] = useState(false); 
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(video.comments || []);
  const [isSending, setIsSending] = useState(false);

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
    } catch (error) { alert("Lỗi gửi bình luận!"); } 
    finally { setIsSending(false); }
  };

  return (
    <div style={{ marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
      
      {/* --- PHẦN VIDEO (CÓ LOOP) --- */}
      <div style={{ position: 'relative', width: '100%', backgroundColor: '#000' }}>
        <video 
          src={video.videoUrl} 
          controls 
          playsInline 
          loop           // <--- QUAN TRỌNG: Lệnh lặp lại
          autoPlay 
          muted 
          style={{ width: '100%', maxHeight: '80vh', display: 'block' }} 
        />
      </div>

      {/* --- PHẦN THÔNG TIN --- */}
      <div style={{ padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(45deg, #ff0050, #00f2ea)', borderRadius: '50%', marginRight: '10px' }}></div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{video.author?.username || 'Pi Pioneer'}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{new Date(video.createdAt).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>
        
        <p style={{ margin: '0 0 15px 0', fontSize: '15px', lineHeight: '1.5' }}>{video.caption}</p>
        
        {/* --- PHẦN NÚT BẤM (CHỈ CÓ SỐ VÀ ICON) --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div style={{ display: 'flex', gap: '25px' }}>
            
            {/* TIM */}
            <button onClick={handleLike} style={{ background: 'none', border: 'none', color: isLiked ? '#ff0050' : '#fff', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '18px' }}>
              <span style={{ fontSize: '26px' }}>{isLiked ? '❤️' : '🤍'}</span> 
              <b>{likesCount}</b>
            </button>

            {/* COMMENT (Bấm là mở) */}
            <button onClick={() => setShowCommentInput(!showCommentInput)} style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '18px' }}>
              <span style={{ fontSize: '26px' }}>💬</span> 
              <b>{commentsList.length}</b>
            </button>
            
            {/* SHARE */}
            <button style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '18px' }}>
              <span style={{ fontSize: '26px' }}>↗️</span>
            </button>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px' }}>🔖</button>
        </div>

        {/* --- KHUNG NHẬP BÌNH LUẬN --- */}
        {showCommentInput && (
          <div style={{ marginTop: "20px", animation: "fadeIn 0.3s" }}>
            <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "10px", background: "#1a1a1a", padding: "10px", borderRadius: "10px" }}>
              {commentsList.length === 0 ? <p style={{color: "#555", fontSize:"12px"}}>Chưa có bình luận.</p> : null}
              {commentsList.map((cmt: any, i: number) => (
                <div key={i} style={{ marginBottom: "8px", fontSize: "14px", borderBottom: "1px solid #333", paddingBottom: "5px" }}>
                  <strong style={{ color: "#aaa" }}>{cmt.user?.username || "Guest"}: </strong>
                  <span style={{ color: "white" }}>{cmt.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" placeholder="Thêm bình luận..." value={commentText} onChange={(e) => setCommentText(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #333", background: "#000", color: "white" }} />
              <button onClick={handleSendComment} disabled={isSending} style={{ background: "#ff0050", border: "none", color: "white", padding: "0 20px", borderRadius: "20px", fontWeight: "bold" }}>➤</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
        }
