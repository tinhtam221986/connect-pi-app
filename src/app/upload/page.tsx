"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Music2, Scissors, Wand2, X, ChevronRight } from "lucide-react";

// Wrap the main content component
function UploadPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode'); // 'camera' or 'upload'

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Editor States
  const [caption, setCaption] = useState("");
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(60);
  const [duration, setDuration] = useState(0);
  const [musicSelected, setMusicSelected] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  // Auto-trigger file input if mode is upload
  useEffect(() => {
     if (mode === 'upload' && step === 1) {
         fileInputRef.current?.click();
     }
     // Camera mode would trigger a camera component (omitted for brevity, utilizing file input with capture for now)
  }, [mode, step]);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check duration (Mocking duration check)
    // In real app, load into hidden video element to check duration
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.onloadedmetadata = function() {
        window.URL.revokeObjectURL(videoElement.src);
        setDuration(videoElement.duration);
        setTrimEnd(Math.min(videoElement.duration, 60)); // Default trim to 60s or max
    }
    videoElement.src = URL.createObjectURL(file);

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setVideoUrl(localUrl);
    setStep(2);
  };

  const handlePost = async () => {
    if (!caption.trim()) return alert("Please add a description!");
    if (!selectedFile) return alert("File error! Please select again.");

    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("description", caption);
      formData.append("privacy", "public");

      // Send editing metadata (mock)
      formData.append("metadata", JSON.stringify({
          trimStart,
          trimEnd,
          music: musicSelected
      }));

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
                // alert("🎉 Uploaded successfully!");
                router.push("/");
            } else {
                alert("Upload failed: " + (data.error || "Unknown"));
            }
        } else {
            alert("Server Error: " + xhr.statusText);
        }
        setUploading(false);
      };

      xhr.onerror = () => {
         alert("Network error!");
         setUploading(false);
      };

      xhr.send(formData);

    } catch (err) {
        console.error(err);
        alert("An error occurred!");
        setUploading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col relative pb-safe">
      {/* Header */}
      <div className="flex justify-between items-center p-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => router.back()} className="p-2 rounded-full bg-white/10">
            <X size={24} />
        </button>
        <h3 className="font-bold text-lg">
            {step === 1 ? "Select Media" : "Edit & Post"}
        </h3>
        {step === 2 ? (
             <button
                onClick={handlePost}
                disabled={uploading}
                className="bg-primary hover:bg-primary/80 text-white px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
             >
                {uploading ? `${progress}%` : "Post"}
             </button>
        ) : <div className="w-10" />}
      </div>

      {/* Step 1: Selection */}
      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-xs aspect-video border-2 border-dashed border-gray-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-white/5 transition-all group"
          >
            <div className="p-6 bg-gray-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                 {mode === 'camera' ? <Wand2 size={40} className="text-gray-400 group-hover:text-primary" /> : <Scissors size={40} className="text-gray-400 group-hover:text-primary" />}
            </div>
            <h4 className="text-xl font-bold text-gray-300">
                {mode === 'camera' ? "Open Camera" : "Select Video"}
            </h4>
            <p className="text-sm text-gray-500 mt-2">Supports MP4, MOV (Max 60s)</p>
          </div>

          {/* Hidden Inputs */}
          <input
            type="file"
            accept="video/*,image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            capture={mode === 'camera' ? 'environment' : undefined}
          />
        </div>
      )}

      {/* Step 2: Editor */}
      {step === 2 && videoUrl && (
        <div className="flex-1 flex flex-col relative">
          {/* Preview Area */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
             <video
                src={videoUrl}
                controls={false}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain"
             />

             {/* Right Toolbar (Editor) */}
             <div className="absolute top-4 right-4 flex flex-col gap-4">
                 <button className="flex flex-col items-center gap-1 group">
                     <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 group-hover:border-primary transition-all">
                         <Music2 size={20} className="text-white" />
                     </div>
                     <span className="text-[10px] font-medium shadow-black drop-shadow-md">Sound</span>
                 </button>

                 <button className="flex flex-col items-center gap-1 group">
                     <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 group-hover:border-primary transition-all">
                         <Scissors size={20} className="text-white" />
                     </div>
                     <span className="text-[10px] font-medium shadow-black drop-shadow-md">Trim</span>
                 </button>

                 <button className="flex flex-col items-center gap-1 group">
                     <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 group-hover:border-primary transition-all">
                         <Wand2 size={20} className="text-white" />
                     </div>
                     <span className="text-[10px] font-medium shadow-black drop-shadow-md">Effects</span>
                 </button>
             </div>
          </div>

          {/* Bottom Controls */}
          <div className="bg-[#111] border-t border-white/10 p-4 pb-8 space-y-4 rounded-t-2xl z-20">

              {/* Trimmer UI (Visual Only for now) */}
              <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                      <span>{trimStart}s</span>
                      <span>Selected: {trimEnd - trimStart}s</span>
                      <span>{Math.round(duration)}s</span>
                  </div>
                  <div className="h-12 bg-gray-900 rounded-lg border border-gray-700 relative overflow-hidden flex items-center px-1">
                      {/* Fake waveform */}
                      <div className="flex-1 h-6 bg-gray-800 flex items-end gap-[2px] opacity-50">
                          {[...Array(40)].map((_,i) => (
                              <div key={i} style={{ height: `${Math.random()*100}%`}} className="w-1 bg-gray-600 rounded-full" />
                          ))}
                      </div>
                      {/* Trimmer Handles */}
                      <div className="absolute inset-y-0 left-0 w-4 bg-primary/80 rounded-l-md cursor-ew-resize flex items-center justify-center">
                          <div className="w-[2px] h-4 bg-white" />
                      </div>
                      <div className="absolute inset-y-0 right-0 w-4 bg-primary/80 rounded-r-md cursor-ew-resize flex items-center justify-center">
                          <div className="w-[2px] h-4 bg-white" />
                      </div>
                  </div>
                  <p className="text-[10px] text-gray-500 text-center">Drag handles to trim video (Max 60s)</p>
              </div>

              {/* Caption Input */}
              <div className="flex gap-3 items-start bg-gray-900/50 p-3 rounded-xl border border-white/5 focus-within:border-primary/50 transition-colors">
                  <textarea
                    placeholder="Describe your masterpiece... #Connect #Web3"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 outline-none resize-none h-16"
                  />
              </div>

              {/* Music Selection (Placeholder) */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button onClick={() => setMusicSelected('device')} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap ${musicSelected === 'device' ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/30'}`}>
                      <Music2 size={14} /> My Device
                  </button>
                  <button onClick={() => setMusicSelected('system')} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap ${musicSelected === 'system' ? 'bg-primary text-white border-primary' : 'bg-transparent text-white border-white/30'}`}>
                      🔥 Trending (System)
                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Studio...</div>}>
            <UploadPageContent />
        </Suspense>
    )
}
