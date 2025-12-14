"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for the uploaded file and preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Persist file in state because the input will be unmounted in step 2
    setSelectedFile(file);

    // Create local preview URL
    const localUrl = URL.createObjectURL(file);
    setVideoUrl(localUrl);
    setStep(2);
  };

  const handlePost = async () => {
    if (!caption.trim()) return alert("Viết mô tả!");
    if (!selectedFile) return alert("Lỗi file! Vui lòng chọn lại.");

    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("description", caption);
      // Optional: Add privacy or other fields if needed
      formData.append("privacy", "public");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/video/upload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
             setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.response);
            if (data.success) {
                alert("🎉 Đăng thành công!");
                router.push("/");
            } else {
                alert("Lỗi tải: " + (data.error || "Unknown"));
            }
        } else {
            alert("Lỗi Server: " + xhr.statusText);
        }
        setUploading(false);
      };

      xhr.onerror = () => {
         alert("Lỗi kết nối mạng!");
         setUploading(false);
      };

      xhr.send(formData);

    } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra!");
        setUploading(false);
    }
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
          {uploading && <p>Đang xử lý... {progress}%</p>}
        </div>
      )}
      {step === 2 && videoUrl && (
        <div style={{ width: "100%" }}>
          <video src={videoUrl} controls autoPlay loop playsInline style={{ width: "100%", borderRadius: "10px", marginBottom: "20px" }} />
          <textarea placeholder="Mô tả..." value={caption} onChange={(e) => setCaption(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "10px", background: "#222", color: "white", border: "none" }} />
          <button onClick={handlePost} disabled={uploading} style={{ marginTop: "20px", width: "100%", padding: "15px", background: "#ff0050", color: "white", border: "none", borderRadius: "30px", fontWeight: "bold" }}>
             {uploading ? `Đang tải lên ${progress}%...` : "Đăng ngay 🚀"}
          </button>
        </div>
      )}
    </div>
  );
}
