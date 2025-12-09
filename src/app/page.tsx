'use client'; // Dòng này bắt buộc phải có ở Next.js bác nhé!

import React, { useState } from 'react';

// --- CHÌA KHÓA CỦA BÁC ---
const CLOUD_NAME = "dv1hnl0wo"; 
const UPLOAD_PRESET = "Connect_pi_app"; 
// --------------------------

export default function Home() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert("Chọn video thôi bác ơi!");
      return;
    }
    uploadVideo(file);
  };

  const uploadVideo = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET); 
    formData.append('resource_type', 'video');

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);

      xhr.upload.onprogress = (event) => {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      };

      xhr.onload = () => {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          setVideoUrl(response.secure_url);
          setLoading(false);
        } else {
          alert("Lỗi: " + response.error.message);
          setLoading(false);
        }
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
        <input type="file" accept="video/*" onChange={handleFileChange} />
      </div>

      {loading && (
        <div style={{ color: 'blue' }}>
          Đang tải lên... {progress}%
        </div>
      )}

      {videoUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: 'green' }}>✅ Lên hình rồi bác ơi!</h3>
          <video src={videoUrl} controls autoPlay style={{ width: '100%', maxWidth: '400px' }} />
        </div>
      )}
    </div>
  );
}

