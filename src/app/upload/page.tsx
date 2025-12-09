'use client'; // Bắt buộc

import React, { useState } from 'react';

// --- CHÌA KHÓA CỦA BÁC ---
const CLOUD_NAME = "dv1hnl0wo"; 
const UPLOAD_PRESET = "Connect_pi_app"; 
// --------------------------

export default function Home() {
  // Thêm <any> để tránh lỗi TypeScript khi lưu link
  const [videoUrl, setVideoUrl] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Thêm (e: any) để TypeScript không báo lỗi
  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Kiểm tra file video
    if (!file.type.startsWith('video/')) {
      alert("Chọn video thôi bác ơi!");
      return;
    }
    uploadVideo(file);
  };

  // Thêm (file: any)
  const uploadVideo = async (file: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET); 
    formData.append('resource_type', 'video');

    try {
      const xhr = new XMLHttpRequest();
      
      // ✅ ĐÃ SỬA: Dùng dấu cộng (+) để nối chuỗi, chấp mọi loại dấu
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/video/upload');

      // Thêm (event: any)
      xhr.upload.onprogress = (event: any) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        // Kiểm tra kỹ kết quả trả về
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log("Thành công:", response);
          setVideoUrl(response.secure_url);
          setLoading(false);
        } else {
          console.error("Lỗi server:", xhr.responseText);
          alert("Lỗi tải lên. Bác kiểm tra lại mạng xem!");
          setLoading(false);
        }
      };
      
      xhr.onerror = () => {
        alert("Lỗi đường truyền rồi bác ơi.");
        setLoading(false);
      };

      xhr.send(formData);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>Pi TikTok Demo</h1>
      
      <div style={{ margin: '20px', padding: '20px', border: '2px dashed #ccc' }}>
        <h3>Bước 1: Chọn Video</h3>
        <input type="file" accept="video/*" onChange={handleFileChange} />
      </div>

      {loading && (
        <div style={{ color: 'blue', fontWeight: 'bold' }}>
          Đang đẩy video lên mây... {progress}%
          <div style={{ width: '100%', height: '5px', background: '#eee', marginTop: '5px' }}>
             <div style={{ width: `${progress}%`, height: '100%', background: 'green' }}></div>
          </div>
        </div>
      )}

      {videoUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: 'green' }}>✅ Lên hình rồi bác ơi!</h3>
          <p style={{fontSize: '12px', color: '#666'}}>Link video: {videoUrl}</p>
          <video src={videoUrl} controls autoPlay style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
      }
