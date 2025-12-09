'use client';

import React, { useState } from 'react';

// --- CHÌA KHÓA CỦA BÁC ---
const CLOUD_NAME = "dv1hnl0wo"; 
const UPLOAD_PRESET = "Connect_pi_app"; 
// --------------------------

export default function UploadPage() {
  const [videoUrl, setVideoUrl] = useState<any>(null);
  const [caption, setCaption] = useState(""); // Bước 2: Lưu nội dung tút
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1); // Quản lý từng bước (1: Chọn, 2: Viết, 3: Xong)

  // Xử lý chọn video (Bước 1)
  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      alert("Chọn video thôi bác ơi!");
      return;
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
          setStep(2); // Tự động nhảy sang Bước 2
        } else {
          alert("Lỗi tải lên: " + xhr.responseText);
          setLoading(false);
        }
      };
      xhr.send(formData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Xử lý khi bấm Đăng (Bước 3)
  const handlePost = () => {
    if (!caption) {
      alert("Bác chưa viết gì cả!");
      return;
    }
    // Ở đây sau này sẽ lưu vào Database
    alert("✅ ĐÃ ĐĂNG THÀNH CÔNG!\n\nVideo: " + videoUrl + "\nNội dung: " + caption);
    setStep(3); // Chuyển sang màn hình chúc mừng
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'sans-serif', 
      maxWidth: '500px', 
      margin: '0 auto',
      background: '#000', // Nền đen cho ngầu
      minHeight: '100vh',
      color: '#fff'
    }}>
      
      {/* --- BƯỚC 1: CHỌN VIDEO --- */}
      {step === 1 && (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <h2 style={{ color: '#ff0050' }}>Bước 1: Tải Video Lên</h2>
          
          <div style={{ 
            border: '2px dashed #444', 
            padding: '40px', 
            borderRadius: '10px',
            marginTop: '20px',
            background: '#111'
          }}>
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange} 
              style={{ color: 'white' }}
            />
          </div>

          {loading && (
            <div style={{ marginTop: '30px' }}>
              <p style={{ color: '#ff0050', fontWeight: 'bold' }}>Đang đẩy lên mây... {progress}%</p>
              <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px' }}>
                 <div style={{ width: `${progress}%`, height: '100%', background: '#ff0050', borderRadius: '4px', transition: 'width 0.3s' }}></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- BƯỚC 2: VIẾT CAPTION & REVIEW --- */}
      {step === 2 && (
        <div>
          <h3 style={{ color: '#ff0050', textAlign: 'center' }}>Bước 2: Soạn bài đăng</h3>
          
          {/* Video Preview */}
          <div style={{ margin: '20px 0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #333' }}>
            <video src={videoUrl} controls autoPlay style={{ width: '100%', display: 'block' }} />
          </div>

          {/* Ô nhập Caption */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Nội dung:</label>
            <textarea 
              rows={4}
              placeholder="Hôm nay bác nghĩ gì? #PiNetwork #Chill"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '10px', 
                border: 'none', 
                background: '#222', 
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Nút Đăng */}
          <button 
            onClick={handlePost}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#ff0050',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 0, 80, 0.4)'
            }}
          >
            ĐĂNG BÀI NGAY 🚀
          </button>

          <button 
            onClick={() => setStep(1)}
            style={{ width: '100%', padding: '15px', background: 'transparent', color: '#888', border: 'none', marginTop: '10px' }}
          >
            Quay lại chọn video khác
          </button>
        </div>
      )}

      {/* --- BƯỚC 3: HOÀN TẤT --- */}
      {step === 3 && (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
          <div style={{ fontSize: '60px' }}>🎉</div>
          <h2 style={{ color: '#00ff00' }}>Đăng bài thành công!</h2>
          <p style={{ color: '#ccc' }}>Video của bác đã lên sóng.</p>
          
          <button 
            onClick={() => { setStep(1); setCaption(""); setVideoUrl(null); }}
            style={{
              marginTop: '30px',
              padding: '12px 30px',
              backgroundColor: '#333',
              color: 'white',
              border: '1px solid #555',
              borderRadius: '30px'
            }}
          >
            Đăng bài khác
          </button>
        </div>
      )}

    </div>
  );
            }
        
