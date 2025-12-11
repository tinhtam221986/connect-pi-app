"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function VideoCard({ video }: { video: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);
  const [showCommentInput, setShowCommentInput] = useState(false); 
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(video.comments || []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) videoRef.current?.play().catch(() => {});
      else { if(videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }
    }, { threshold: 0.6 });
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLike = async () => {
    setIsLiked(!isLiked); setLikesCount(prev => !isLiked ? prev + 1 : prev - 1);
    await fetch("/api/like", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ videoId: video._id, action: !isLiked ? 'like' : 'unlike' }) });
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    const res = await fetch("/api/comment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ videoId: video._id, text: commentText }) });
    const data = await res.json();
    if (res.ok) { setCommentsList(data.comments); setCommentText(""); setShowCommentInput(false); }
  };

  const handleShare = async () => {
    const link = `${window.location.origin}?video=${video._id}`;
    if (navigator.share) { try { await navigator.share({ title: 'Connect Pi', url: link }); } catch (err) {} }
    else { try { await navigator.clipboard.writeText(link); alert("✅ Đã sao chép link!"); } catch (err) { prompt("Copy link:", link); } }
  };

  return (
    <div style={{ height: '100vh', position: 'relative', scrollSnapAlign: 'start', backgroundColor: 'black' }}>
      <video ref={videoRef} src={video.videoUrl} loop playsInline onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      
      <div style={{ position: 'absolute', right: '10px', bottom: '100px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', zIndex: 20 }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background:'white' }}><img src="https://via.placeholder.com/50" style={{width:'100%', borderRadius:'50%'}}/></div>
        <button onClick={handleLike} style={{background:'none', border:'none', color: isLiked ? '#ff0050':'white', fontSize:'30px'}}>❤</button>
        <button onClick={() => setShowCommentInput(true)} style={{background:'none', border:'none', color:'white', fontSize:'30px'}}>💬</button>
        <button onClick={handleShare} style={{background:'none', border:'none', color:'white', fontSize:'30px'}}>↗️</button>
      </div>

      <div style={{ position: 'absolute', bottom: '20px', left: '10px', width: '70%', color:'white', textShadow:'1px 1px 2px black' }}>
        <h4>@{video.author?.username || 'Pi Pioneer'}</h4>
        <p>{video.caption}</p>
      </div>

      {showCommentInput && (
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '60vh', background: 'rgba(0,0,0,0.9)', padding: '10px', zIndex:100 }}>
           <div style={{textAlign:'right'}}><button onClick={() => setShowCommentInput(false)} style={{color:'white', background:'none', border:'none'}}>✕</button></div>
           <div style={{height:'80%', overflowY:'auto', color:'white'}}>{commentsList.map((c:any, i:number)=><div key={i}><b>{c.user?.username}:</b> {c.text}</div>)}</div>
           <input value={commentText} onChange={e=>setCommentText(e.target.value)} style={{width:'80%'}} placeholder="Bình luận..." />
           <button onClick={handleSendComment}>Gửi</button>
        </div>
      )}
    </div>
  );
}
