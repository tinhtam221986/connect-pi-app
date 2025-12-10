"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// --- CẤU HÌNH ---
// Tên đám mây và Preset bác đã cài đặt chuẩn
const CLOUD_NAME = "dv1hnl0wo"; 
const UPLOAD_PRESET = "Connect_pi_app"; 

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // Thanh phần trăm chạy chạy
  const [step, setStep] = useState(1); // 1: Chọn, 2: Chỉnh sửa

  // Xử lý chọn file và tự động upload
  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Giới hạn 50MB cho nhẹ Server
    if (file.size > 50 * 1024 * 1024) {
      alert("Video nặng quá bác ơi! Chọn cái nào dưới 50MB thôi.");
      return;
    }

    setUploading(true);
    
    // Tạo FormData để gửi lên Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "video");

    try {
      // Dùng kỹ thuật này để đo phần trăm upload (nhìn cho chuyên nghiệp)
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
          setStep(2); // Chuyển sang bước viết caption
        } else {
          alert("Lỗi tải lên: " + (data.error?.message || "Không rõ"));
          setUploading(false);
        }
      };

      xhr.send(formData);

    } catch (error) {
      alert("Lỗi mạng rồi bác ơi!");
      setUploading(false);
    }
  };

  // Đăng bài lên MongoDB
  const handlePost = async () => {
    if (!caption.trim()) return alert("Viết vài dòng cảm nghĩ đi bác!");

    setUploading(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          caption,
          author: { username: "Pi User", user_uid: "pi_uid_test" } // Sau này thay bằng Pi SDK
        }),
      });

      if (res.ok) {
        alert("🎉 Đăng thành công! Về trang chủ xem ngay!");
        router.push("/");
      } else {
        alert("Lỗi lưu vào CSDL (Kiểm tra lại MongoDB)");
      }
    } catch (error) {
      alert("Lỗi kết nối Server!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#000", color: "white", minHeight: "100vh", 
      display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" 
    }}>
      
      {/* HEADER */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "white", fontSize: "20px" }}>✕</button>
        <span style={{ fontWeight: "bold" }}>Đăng bài mới</span>
        <div style={{ width: "20px" }}></div>
      </div>

      {/* BƯỚC 1: CHỌN VIDEO */}
      {step === 1 && (
        <div style={{ width: "100%", textAlign: "center", marginTop: "40%" }}>
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              border: "2px dashed #444", padding: "40px", borderRadius: "20px",
              cursor: "pointer", background: "#111"
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📹</div>
            <h3>Chọn video từ máy</h3>
            <p style={{ color: "#888" }}>MP4, AVI (Max 50MB)</p>
          </div>
          <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />

          {/* Thanh phần trăm */}
          {uploading && (
            <div style={{ marginTop: "20px", width: "100%" }}>
              <p style={{ marginBottom: "5px" }}>Đang tải lên... {progress}%</p>
              <div style={{ width: "100%", height: "8px", background: "#333", borderRadius: "4px" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "#ff0050", transition: "width 0.2s" }}></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BƯỚC 2: CHỈNH SỬA & ĐĂNG */}
      {step === 2 && videoUrl && (
        <div style={{ width: "100%" }}>
          {/* Preview Video */}
          <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #333", marginBottom: "20px" }}>
            <video src={videoUrl} autoPlay loop muted style={{ width: "100%", display: "block" }} />
          </div>

          <textarea 
            placeholder="Mô tả video của bác... #PiNetwork"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ 
              width: "100%", height: "100px", background: "#222", color: "white", 
              border: "none", borderRadius: "10px", padding: "15px", fontSize: "16px", resize: "none"
            }}
          />

          <button 
            onClick={handlePost}
            disabled={uploading}
            style={{ 
              width: "100%", padding: "15px", background: "#ff0050", color: "white", 
              border: "none", borderRadius: "30px", fontSize: "18px", fontWeight: "bold", marginTop: "30px",
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? "Đang xử lý..." : "ĐĂNG NGAY 🚀"}
          </button>
        </div>
      )}
    </div>
  );
              }
