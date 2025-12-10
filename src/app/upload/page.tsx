"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// --- CẤU HÌNH ---
// Bác thay đúng tên Cloudinary của bác vào đây nhé
const CLOUD_NAME = "dv1hnl0wo"; 
const UPLOAD_PRESET = "Connect_pi_app"; 

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // Thanh phần trăm
  const [step, setStep] = useState(1); // 1: Chọn video, 2: Viết caption

  // Hàm chọn file
  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra dung lượng (Ví dụ giới hạn 50MB cho nhẹ)
    if (file.size > 50 * 1024 * 1024) {
      alert("Video nặng quá bác ơi! Chọn cái nào dưới 50MB thôi nhé.");
      return;
    }

    // Bắt đầu upload lên Cloudinary
    setUploading(true);
    setProgress(10); // Giả vờ chạy tí cho vui

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "video");

    try {
      // Dùng XMLHttpRequest để đo được phần trăm upload (Pro hơn fetch thường)
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (data.secure_url) {
          setVideoUrl(data.secure_url);
          setUploading(false);
          setStep(2); // Chuyển sang bước 2
        } else {
          alert("Lỗi tải lên: " + (data.error?.message || "Không rõ"));
          setUploading(false);
        }
      };

      xhr.send(formData);

    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối mạng rồi!");
      setUploading(false);
    }
  };

  // Hàm đăng bài (Lưu vào MongoDB)
  const handlePost = async () => {
    if (!caption) return alert("Viết vài dòng cảm nghĩ đi bác!");

    setUploading(true); // Tận dụng biến này để hiện chữ "Đang đăng..."
    
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          caption,
          // Giả lập user (Sau này thay bằng Pi SDK)
          author: { username: "Pi Pioneer", user_uid: "user_test_01" } 
        }),
      });

      if (res.ok) {
        alert("🎉 Đăng thành công! Về trang chủ xem nào!");
        router.push("/"); // Quay về trang chủ
      } else {
        alert("Lỗi lưu Database (Kiểm tra lại kết nối Mongo)");
      }
    } catch (error) {
      alert("Lỗi Server!");
    } finally {
      setUploading(false);
    }
  };

  // --- GIAO DIỆN (UI) ---
  return (
    <div style={{ 
      backgroundColor: "#000", 
      color: "white", 
      minHeight: "100vh", 
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      
      {/* HEADER */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "white", fontSize: "24px" }}>✕</button>
        <h3 style={{ margin: 0, fontWeight: "bold" }}>Tạo bài viết mới</h3>
        <div style={{ width: "24px" }}></div>
      </div>

      {/* BƯỚC 1: CHỌN VIDEO */}
      {step === 1 && (
        <div style={{ width: "100%", textAlign: "center", marginTop: "50px" }}>
          
          {/* Nút bấm chọn file to đẹp */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed #444",
              borderRadius: "15px",
              padding: "50px 20px",
              cursor: "pointer",
              backgroundColor: "#111"
            }}
          >
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>☁️</div>
            <h4 style={{ margin: 0 }}>Chọn video để tải lên</h4>
            <p style={{ color: "#888", fontSize: "14px" }}>MP4 hoặc WebM (Max 50MB)</p>
          </div>

          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            style={{ display: "none" }} 
          />

          {/* Thanh phần trăm khi đang tải */}
          {uploading && (
            <div style={{ marginTop: "30px" }}>
              <p>Đang tải lên mây... {progress}%</p>
              <div style={{ width: "100%", height: "10px", background: "#333", borderRadius: "5px", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "#ff0050", transition: "width 0.3s" }}></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BƯỚC 2: CHỈNH SỬA & ĐĂNG */}
      {step === 2 && videoUrl && (
        <div style={{ width: "100%", maxWidth: "500px" }}>
          
          {/* Preview Video */}
          <div style={{ width: "100%", borderRadius: "15px", overflow: "hidden", marginBottom: "20px", border: "1px solid #333" }}>
            <video 
              src={videoUrl} 
              autoPlay loop muted playsInline 
              style={{ width: "100%", display: "block" }} 
            />
          </div>

          {/* Ô nhập Caption */}
          <label style={{ fontWeight: "bold", marginBottom: "10px", display: "block" }}>Mô tả</label>
          <textarea
            placeholder="Hãy viết gì đó ấn tượng... #PiNetwork #Web3"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "#222",
              color: "white",
              fontSize: "16px",
              marginBottom: "20px",
              resize: "none"
            }}
          />

          {/* Nút Đăng */}
          <button
            onClick={handlePost}
            disabled={uploading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#ff0050",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? "Đang lưu..." : "Đăng ngay 🚀"}
          </button>

          <button 
            onClick={() => setStep(1)}
            style={{ background: "none", border: "none", color: "#888", width: "100%", marginTop: "15px" }}
          >
            Chọn video khác
          </button>
        </div>
      )}
    </div>
  );
      }
