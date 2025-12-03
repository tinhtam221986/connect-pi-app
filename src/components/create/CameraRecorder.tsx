"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, StopCircle, RefreshCcw, Download, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CameraRecorderProps {
    onVideoRecorded?: (blob: Blob) => void;
    script?: string;
}

const FILTERS = [
    { name: "Normal", class: "" },
    { name: "Vivid", class: "saturate-150 contrast-110" },
    { name: "Mono", class: "grayscale contrast-110" },
    { name: "Retro", class: "sepia-[.5] contrast-90 brightness-110" },
    { name: "Cyber", class: "hue-rotate-180 contrast-125 saturate-150" },
    { name: "Dreamy", class: "blur-[0.5px] brightness-110 saturate-125" },
];

export function CameraRecorder({ onVideoRecorded, script }: CameraRecorderProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [currentFilter, setCurrentFilter] = useState(FILTERS[0]);
    const [timer, setTimer] = useState(0);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user", aspectRatio: 9/16 }, 
                audio: true 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Could not access camera. Please check permissions.");
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    // Handle Recording
    const startRecording = () => {
        if (!videoRef.current?.srcObject) return;

        setRecordedChunks([]);
        const stream = videoRef.current.srcObject as MediaStream;
        
        // We need to capture the filtered canvas if we want to bake in filters,
        // but for performance on mobile, we often just apply CSS filter to the video
        // and save the raw video, applying filter again on playback.
        // For a true "burned in" filter, we'd need a canvas loop.
        // For this MVP, we will record the raw stream and save the filter metadata 
        // OR just record raw and let the preview handle it. 
        // Users expect "What You See Is What You Get".
        // Let's stick to raw recording for stability, and maybe later add canvas processing.
        // Actually, let's try to implement Canvas recording for filters if possible.
        // Given complexity, let's stick to recording the raw stream for now 
        // and allow the user to view it with the filter. 
        // *However*, to burn it in, we'd need to draw video to canvas, apply filter context, and captureStream.
        
        // Simpler approach for "TikTok-like" feels: Just record raw, but save filter preference.
        // Ideally, we record raw.
        
        try {
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                }
            };

            mediaRecorder.onstop = () => {
                 // Stop timer
                 if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setTimer(0);
            timerIntervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);

        } catch (e) {
            console.error("MediaRecorder error:", e);
            toast.error("Recording failed to start.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }
    };

    const handleSave = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        if (onVideoRecorded) {
            onVideoRecorded(blob);
        }
        setPreviewUrl(URL.createObjectURL(blob));
        // We could also offer download here
    };

    const handleRetake = () => {
        setRecordedChunks([]);
        setPreviewUrl(null);
        setTimer(0);
        startCamera();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            
            {/* Video Preview Area */}
            <div className="relative w-full flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
                {!previewUrl ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transition-all duration-300 ${currentFilter.class}`}
                    />
                ) : (
                    <video
                        src={previewUrl}
                        controls
                        className={`w-full h-full object-cover ${currentFilter.class}`}
                    />
                )}

                {/* Script Teleprompter Overlay */}
                {script && !previewUrl && (
                    <div className="absolute top-10 left-4 right-4 bg-black/40 backdrop-blur-sm p-4 rounded-xl text-white text-lg font-medium leading-relaxed max-h-48 overflow-y-auto z-20 pointer-events-none border border-white/10 shadow-lg">
                        {script}
                    </div>
                )}

                {/* Filter Name Toast */}
                <AnimatePresence>
                    <motion.div 
                        key={currentFilter.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white z-30"
                    >
                        {currentFilter.name}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex flex-col items-center gap-6 z-30">
                
                {/* Timer */}
                {isRecording && (
                    <div className="text-red-500 font-mono font-bold text-xl animate-pulse">
                        {formatTime(timer)}
                    </div>
                )}

                {/* Filter Selector */}
                {!isRecording && !previewUrl && (
                    <div className="flex gap-4 overflow-x-auto w-full px-4 pb-2 no-scrollbar justify-center">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.name}
                                onClick={() => setCurrentFilter(filter)}
                                className={`flex flex-col items-center gap-1 shrink-0 group`}
                            >
                                <div className={`w-12 h-12 rounded-full border-2 overflow-hidden ${currentFilter.name === filter.name ? 'border-purple-500 scale-110' : 'border-gray-500'}`}>
                                    <div className={`w-full h-full bg-gray-800 ${filter.class}`}></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-white">{filter.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex items-center gap-12">
                    {previewUrl ? (
                        <>
                            <button onClick={handleRetake} className="p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                                <RefreshCcw size={24} className="text-white" />
                            </button>
                            <button onClick={() => { if(onVideoRecorded && recordedChunks.length) onVideoRecorded(new Blob(recordedChunks, { type: 'video/webm' })); toast.success("Video saved!") }} className="p-4 bg-purple-600 rounded-full hover:bg-purple-500 transition shadow-lg shadow-purple-900/50">
                                <Check size={32} className="text-white" />
                            </button>
                        </>
                    ) : (
                        <>
                            {!isRecording ? (
                                <button 
                                    onClick={startRecording} 
                                    className="w-20 h-20 rounded-full border-[6px] border-white/30 flex items-center justify-center group transition-all hover:scale-105"
                                >
                                    <div className="w-16 h-16 bg-red-500 rounded-full group-hover:scale-90 transition-transform shadow-lg shadow-red-900/50" />
                                </button>
                            ) : (
                                <button 
                                    onClick={() => { stopRecording(); setTimeout(handleSave, 500); }} 
                                    className="w-20 h-20 rounded-full border-[6px] border-red-500/30 flex items-center justify-center transition-all hover:scale-105"
                                >
                                    <div className="w-8 h-8 bg-red-500 rounded-sm shadow-lg shadow-red-900/50" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
