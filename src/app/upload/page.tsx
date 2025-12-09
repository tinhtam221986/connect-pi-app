'use client';

import React, { useState, useEffect } from 'react';

// --- CHÌA KHÓA CỦA BÁC ---
const CLOUD_NAME = "dv1hnl0wo"; 
const UPLOAD_PRESET = "Connect_pi_app"; 
// --------------------------

export default function TikTokMini() {
  const [videoUrl, setVideoUrl] = useState<any>(null);
  const [caption, setCaption] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1); 
  
  // Danh sách video (Cái sổ tay)
  const [myVideos, setMyVideos] = useState<any[]>([]);

  // 1. Khi mở web lên, tự động đọc "Sổ tay" xem có video cũ không
  useEffect(() => {
    const saved = localStorage.getItem('my_tiktok_videos');
    if (saved) {
      setMyVideos(JSON.parse(saved));
    }
  }, []);

  // Xử lý chọn file
  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert("Chọn video thôi bác ơi!"); return;
    }
    uploadVideo(file);
  };

  // Upload lên Cloudinary
  const uploadVideo = async (file: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET); 
    formData.append('resource_type', 'video');

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/video/upload');

      xhr.upload.onprogress = (event: any) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setVideoUrl(response.secure_url);
          setLoading(false);
          setStep(2); 
        } else {
          alert("Lỗi: " + xhr.responseText);
          setLoading(false);
        }
      };
      xhr.send(formData);
    } catch (error) {
      console.error(error); setLoading(false);
    }
  };

  // Xử lý Đăng bài & Ghi vào sổ
  const handlePost = () => {
    if (!caption) return alert("Viết tí caption đi bác!");
    
    // Tạo object video mới
    const newPost = {
      id: Date.now(),
      url: videoUrl,
      caption: caption,
      date: new Date().toLocaleString()
    };

    // Thêm vào danh sách hiện tại
    const updatedList = [newPost, ...myVideos];
    setMyVideos(updatedList);
    
    // Lưu vào bộ nhớ trình duyệt (Sổ tay)
    localStorage.setItem('my_tiktok_videos', JSON.stringify(updatedList));

    alert("✅ ĐÃ LƯU VÀO TRANG CÁ NHÂN!");
    setStep(1); // Reset về ban đầu
    setCaption("");
    setVideoUrl(null);
  };

  // Xóa video (Nếu chán)
  const handleDelete = (id: number) => {
    if(!confirm("Xóa thật hả bác?")) return;
    const newList = myVideos.filter(v => v.id !== id);
    setMyVideos(newList);
    localStorage.setItem('my_tiktok_videos', JSON.stringify(newList));
  };

  return (
    <div style={{ 
      padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto',
      background: '#000', minHeight: '100vh', color: '#fff', paddingBottom: '100px'
    }}>
      
      {/* --- PHẦN UPLOAD (Ở TRÊN) --- */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #333' }}>
        <h2 style={{ color: '#ff0050', marginTop: 0 }}>🎥 Đăng Video Mới</h2>
        
        {step === 1 && (
          <div>
            <input type="file" accept="video/*" onChange={handleFileChange} style={{color:'white'}} />
            {loading && <p style={{color:'#ff0050'}}>Đang tải... {progress}%</p>}
          </div>
        )}

        {step === 2 && (
          <div>
             <video src={videoUrl} style={{width: '100px', borderRadius:'10px'}} />
             <textarea 
               placeholder="Viết mô tả..." 
               value={caption} 
               onChange={e => setCaption(e.target.value)}
               style={{width:'100%', marginTop:'10px', background:'#222', color:'white', border:'none', padding:'10px'}} 
             />
             <button onClick={handlePost} style={{
               background:'#ff0050', color:'white', border:'none', padding:'10px 20px', 
               borderRadius:'20px', marginTop:'10px', fontWeight:'bold', cursor:'pointer'
             }}>ĐĂNG NGAY</button>
          </div>
        )}
      </div>

      {/* --- PHẦN DANH SÁCH VIDEO CỦA BÁC (Ở DƯỚI) --- */}
      <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        📺 Video Của Tôi ({myVideos.length})
      </h3>

      {myVideos.length === 0 ? (
        <p style={{color:'#777', textAlign:'center'}}>Chưa có video nào. Đăng mở hàng đi bác!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {myVideos.map((video) => (
            <div key={video.id} style={{ background: '#1a1a1a', borderRadius: '15px', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '15px', display: 'flex', alignItems: 'center' }}>
                <div style={{width:'40px', height:'40px', background:'#ccc', borderRadius:'50%', marginRight:'10px'}}></div>
                <div>
                  <div style={{fontWeight:'bold'}}>Bác TinhTam</div>
                  <div style={{fontSize:'12px', color:'#777'}}>{video.date}</div>
                </div>
              </div>

              {/* Video Player */}
              <video src={video.url} controls style={{ width: '100%', display: 'block', maxHeight: '500px' }} />

              {/* Footer */}
              <div style={{ padding: '15px' }}>
                <p style={{ margin: '0 0 10px 0' }}>{video.caption}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{color: '#ff0050'}}>❤ 1.2k Tim</span>
                  <button onClick={() => handleDelete(video.id)} style={{background:'transparent', border:'none', color:'#666', cursor:'pointer'}}>🗑 Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
               }
                    
