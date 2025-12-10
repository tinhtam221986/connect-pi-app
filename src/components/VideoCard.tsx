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
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);
  
  // State xử lý bình luận
  const [showCommentInput, setShowCommentInput] = useState(false); 
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(video.comments || []);
  const [isSending, setIsSending] = useState(false);

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
        setCommentText(""); // Xóa chữ sau khi gửi
      }
    } catch (error) {
      alert("Lỗi gửi bình luận!");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
      
      {/* --- MÀN HÌNH VIDEO (ĐÃ THÊM LOOP) --- */}
      <div style={{ position: 'relative', width: '100%', backgroundColor: '#000' }}>
        <video 
          src={video.videoUrl} 
          controls 
          playsInline 
          loop  // <--- Lệnh này giúp video tự phát lại vô tận
          autoPlay // Tự chạy luôn cho máu
          muted // Tắt tiếng mặc định để trình duyệt không chặn
          style={{ width: '100%', maxHeight: '80vh', display: 'block' }} 
        />
      </div>

      {/* --- THÔNG TIN & TƯƠNG TÁC --- */}
      <div style={{ padding: '15px' }}>
        
        {/* Người đăng */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(45deg, #ff0050, #00f2ea)', borderRadius: '50%', marginRight: '10px' }}></div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{video.author?.username || 'Pi Pioneer'}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{new Date(video.createdAt).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>
        
        {/* Caption */}
        <p style={{ margin: '0 0 15px 0', fontSize: '15px', lineHeight: '1.5' }}>{video.caption}</p>
        
        {/* --- THANH NÚT BẤM (ĐÃ XÓA CHỮ, CHỈ CÒN ICON) --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          
          <div style={{ display: 'flex', gap: '30px' }}>
            
            {/* 1. Nút TIM */}
            <button onClick={handleLike} style={{ background: 'none', border: 'none', color: isLiked ? '#ff0050' : '#fff', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '18px', cursor: 'pointer' }}>
              <span style={{ fontSize: '28px' }}>{isLiked ? '❤️' : '🤍'}</span> 
              <b style={{marginTop: '5px'}}>{likesCount}</b>
            </button>

            {/* 2. Nút COMMENT (Bấm là mở ô nhập) */}
            <button onClick={() => setShowCommentInput(!showCommentInput)} style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '18px', cursor: 'pointer' }}>
              <span style={{ fontSize: '28px' }}>💬</span> 
              <b style={{marginTop: '5px'}}>{commentsList.length}</b>
            </button>
            
            {/* 3. Nút SHARE */}
            <button style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '18px', cursor: 'pointer' }}>
              <span style={{ fontSize: '28px' }}>↗️</span>
            </button>
          </div>

          {/* Nút Bookmark */}
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px' }}>🔖</button>
        </div>

        {/* --- KHUNG NHẬP BÌNH LUẬN (Hiện ra khi bấm nút) --- */}
        {showCommentInput && (
          <div style={{ marginTop: "20px", animation: "fadeIn 0.3s" }}>
            
            {/* Danh sách bình luận cũ */}
            <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "15px", background: "#1a1a1a", padding: "10px", borderRadius: "10px" }}>
              {commentsList.length === 0 ? <p style={{color: "#555", textAlign: "center", fontSize: "12px"}}>Chưa có bình luận nào. Mở bát đi bác!</p> : null}
              {commentsList.map((cmt: any, index: number) => (
                <div key={index} style={{ marginBottom: "8px", fontSize: "14px", borderBottom: "1px solid #333", paddingBottom: "5px" }}>
                  <strong style={{ color: "#aaa" }}>{cmt.user?.username || "Ẩn danh"}: </strong>
                  <span style={{ color: "white" }}>{cmt.text}</span>
                </div>
              ))}
            </div>

            {/* Ô nhập + Nút Gửi */}
            <div style={{ display: "flex", gap: "10px" }}>
              <input 
                type="text" 
                placeholder="Thêm bình luận..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ flex: 1, padding: "12px", borderRadius: "25px", border: "1px solid #333", background: "#000", color: "white", outline: "none" }}
              />
              <button 
                onClick={handleSendComment}
                disabled={isSending}
                style={{ background: "#ff0050", border: "none", color: "white", padding: "0 20px", borderRadius: "25px", fontWeight: "bold" }}
              >
                {isSending ? "..." : "➤"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
          }
