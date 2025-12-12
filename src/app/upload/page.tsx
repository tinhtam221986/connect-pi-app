"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
    setUploading(true); setProgress(10);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "video");

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
      xhr.upload.onprogress = (event) => setProgress(Math.round((event.loaded / event.total) * 100));
      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (data.secure_url) { setVideoUrl(data.secure_url); setUploading(false); setStep(2); }
        else { alert("Lỗi tải: " + data.error?.message); setUploading(false); }
      };
      xhr.send(formData);
    } catch { alert("Lỗi mạng!"); setUploading(false); }
  };

  const handlePost = async () => {
    if (!caption.trim()) return alert("Viết mô tả!");
    setUploading(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, caption, author: { username: "Pi Pioneer", user_uid: "pi_test_uid" } })
      });
      if (res.ok) { alert("🎉 Thành công!"); router.push("/"); }
    } catch { alert("Lỗi Server!"); } finally { setUploading(false); }
  };

  return (
    <div style={{ backgroundColor: "#000", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "white", fontSize: "24px" }}>✕</button>
        <h3>Đăng bài</h3><div style={{ width: "24px" }}></div>
      </div>
      {step === 1 && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <div onClick={() => fileInputRef.current?.click()} style={{ border: "2px dashed #444", borderRadius: "15px", padding: "50px", cursor: "pointer", background: "#111" }}>
            <div style={{ fontSize: "50px" }}>📹</div><h4>Chọn video</h4>
          </div>
          <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
          {uploading && <p>Đang tải... {progress}%</p>}
        </div>
      )}
      {step === 2 && videoUrl && (
        <div style={{ width: "100%" }}>
          <video src={videoUrl} controls autoPlay loop playsInline style={{ width: "100%", borderRadius: "10px", marginBottom: "20px" }} />
          <textarea placeholder="Mô tả..." value={caption} onChange={(e) => setCaption(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "10px", background: "#222", color: "white", border: "none" }} />
          <button onClick={handlePost} disabled={uploading} style={{ marginTop: "20px", width: "100%", padding: "15px", background: "#ff0050", color: "white", border: "none", borderRadius: "30px", fontWeight: "bold" }}>Đăng ngay 🚀</button>
        </div>
      )}
    </div>
  );
}
