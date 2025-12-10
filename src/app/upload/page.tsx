"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// --- CẤU HÌNH ---
const CLOUD_NAME = "dv1hnl0wo"; 
const UPLOAD_PRESET = "Connect_pi_app"; 

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(10); // Hiệu ứng giả
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "video");
    // ĐÃ XÓA DÒNG GÂY LỖI TRANSFORMATION TẠI ĐÂY

    try {
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
          setStep(2);
        } else {
          alert("Lỗi: " + (data.error?.message || "Không xác định"));
          setUploading(false);
        }
      };

      xhr.send(formData);

    } catch (error) {
      alert("Lỗi kết nối mạng!");
      setUploading(false);
    }
  };

  const handlePost = async () => {
    if (!caption.trim()) return alert("Viết mô tả đi bác!");
    setUploading(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          caption,
          author: { username: "Pi Pioneer", user_uid: "pi_test_uid" }
        }),
      });
      if (res.ok) {
        alert("🎉 Đăng thành công!");
        router.push("/");
      } else {
        alert("Lỗi lưu Database!");
      }
    } catch (error) { alert("Lỗi Server!"); } 
    finally { setUploading(false); }
  };

  return (
    <div style={{ backgroundColor: "#000", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      
      {/* HEADER */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "white", fontSize: "24px" }}>✕</button>
        <h3 style={{ margin: 0 }}>Đăng bài mới</h3>
        <div style={{ width: "24px" }}></div>
      </div>

      {/* BƯỚC 1: CHỌN VIDEO */}
      {step === 1 && (
        <div style={{ width: "100%", textAlign: "center", marginTop: "50px" }}>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ border: "2px dashed #444", borderRadius: "15px", padding: "50px 20px", cursor: "pointer", backgroundColor: "#111" }}
          >
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>📹</div>
            <h4>Chọn video để tải lên</h4>
            <p style={{color: "#666"}}>Hỗ trợ MP4, AVI</p>
          </div>
          <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />

          {uploading && (
            <div style={{ marginTop: "30px" }}>
              <p>Đang tải lên... {progress}%</p>
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
          <div style={{ borderRadius: "15px", overflow: "hidden", marginBottom: "20px", border: "1px solid #333" }}>
            <video src={videoUrl} autoPlay loop muted playsInline style={{ width: "100%", display: "block" }} />
          </div>
          <textarea
            placeholder="Mô tả video..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ width: "100%", height: "100px", padding: "15px", borderRadius: "10px", background: "#222", color: "white", border: "none" }}
          />
          <button
            onClick={handlePost}
            disabled={uploading}
            style={{ marginTop: "20px", width: "100%", padding: "15px", background: "#ff0050", color: "white", border: "none", borderRadius: "30px", fontWeight: "bold" }}
          >
            {uploading ? "Đang lưu..." : "Đăng ngay 🚀"}
          </button>
        </div>
      )}
    </div>
  );
                    }
