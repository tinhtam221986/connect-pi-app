"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, StopCircle, RefreshCcw, Check, Music, Video, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { VIDEO_FILTERS } from "@/lib/video-filters";

interface CameraRecorderProps {
    onVideoRecorded?: (blob: Blob) => void;
    script?: string;
}

export function CameraRecorder({ onVideoRecorded, script }: CameraRecorderProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [currentFilter, setCurrentFilter] = useState(VIDEO_FILTERS[0]);
    const [timer, setTimer] = useState(0);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Music State
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

    // Initialize Camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user", aspectRatio: 9/16, width: { ideal: 720 } },
                audio: true 
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play(); // Ensure it plays for the canvas to capture
            }

            // Start the canvas render loop
            drawToCanvas();

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
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
            if (backgroundAudioRef.current) {
                backgroundAudioRef.current.pause();
                backgroundAudioRef.current = null;
            }
        };
    }, []);

    // Canvas Render Loop (Burns filters in)
    const drawToCanvas = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Match canvas size to video
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth || 360;
                canvas.height = video.videoHeight || 640;
            }

            // Apply filter
            ctx.filter = currentFilter.filter;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Reset filter for next frame (optional, but good practice)
            ctx.filter = 'none';
        }

        animationFrameRef.current = requestAnimationFrame(drawToCanvas);
    };

    // Handle Music Upload
    const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioFile(file);
            const url = URL.createObjectURL(file);
            setAudioPreviewUrl(url);

            // Setup Audio Context for mixing
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            // Create audio element for playback
            if (backgroundAudioRef.current) {
                 backgroundAudioRef.current.src = url;
            } else {
                 const audio = new Audio(url);
                 audio.loop = true;
                 backgroundAudioRef.current = audio;
            }

            toast.success("Music added! It will play when recording.");
        }
    };

    const clearMusic = () => {
        setAudioFile(null);
        setAudioPreviewUrl(null);
        if (backgroundAudioRef.current) {
            backgroundAudioRef.current.pause();
            backgroundAudioRef.current = null;
        }
    };

    // Handle Recording
    const startRecording = () => {
        if (!canvasRef.current) return;

        setRecordedChunks([]);
        
        // 1. Get Video Stream from Canvas (Burned Filters)
        const canvasStream = canvasRef.current.captureStream(30); // 30 FPS
        
        // 2. Get Audio Stream
        let finalAudioStream: MediaStream;

        // If we have music, we need to mix microphone + music
        if (audioFile && backgroundAudioRef.current && audioContextRef.current) {
             const ctx = audioContextRef.current;
             const dest = ctx.createMediaStreamDestination();
             destinationRef.current = dest;

             // Mic Source
             if (videoRef.current && videoRef.current.srcObject) {
                 const micStream = videoRef.current.srcObject as MediaStream;
                 const micSource = ctx.createMediaStreamSource(micStream);
                 micSource.connect(dest);
             }

             // Music Source
             // Note: Creating element source only once
             if (!sourceNodeRef.current) {
                 sourceNodeRef.current = ctx.createMediaElementSource(backgroundAudioRef.current);
             }
             // Connect music to destination AND speakers (so user can hear it)
             sourceNodeRef.current.connect(dest);
             sourceNodeRef.current.connect(ctx.destination);

             // Play music
             backgroundAudioRef.current.play();

             finalAudioStream = dest.stream;
        } else {
             // Just use Mic
             const stream = videoRef.current?.srcObject as MediaStream;
             finalAudioStream = stream;
        }

        // Combine Video + Audio
        const tracks = [
            ...canvasStream.getVideoTracks(),
            ...finalAudioStream.getAudioTracks()
        ];
        const combinedStream = new MediaStream(tracks);
        
        try {
            const mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9' });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                }
            };

            mediaRecorder.onstop = () => {
                 // Stop timer
                 if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                 // Stop music
                 if (backgroundAudioRef.current) {
                     backgroundAudioRef.current.pause();
                     backgroundAudioRef.current.currentTime = 0;
                 }
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
    };

    const handleRetake = () => {
        setRecordedChunks([]);
        setPreviewUrl(null);
        setTimer(0);
        // Music resets automatically in onStop
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            
            {/* Hidden Video Source (Raw) */}
            <video ref={videoRef} autoPlay playsInline muted className="hidden" />

            {/* Canvas Preview (Filtered) or Result Video */}
            <div className="relative w-full flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
                {!previewUrl ? (
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <video
                        src={previewUrl}
                        controls
                        className="w-full h-full object-cover"
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

                 {/* Music Indicator */}
                 {audioFile && (
                    <div className="absolute top-4 right-4 bg-purple-500/80 backdrop-blur px-3 py-1 rounded-full text-xs flex items-center gap-1 text-white z-30">
                        <Music size={12} />
                        <span className="max-w-[100px] truncate">{audioFile.name}</span>
                        {!isRecording && <button onClick={clearMusic}><X size={12} /></button>}
                    </div>
                )}
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
                        {VIDEO_FILTERS.map((filter) => (
                            <button
                                key={filter.name}
                                onClick={() => setCurrentFilter(filter)}
                                className={`flex flex-col items-center gap-1 shrink-0 group`}
                            >
                                <div className={`w-12 h-12 rounded-full border-2 overflow-hidden ${currentFilter.name === filter.name ? 'border-purple-500 scale-110' : 'border-gray-500'}`}>
                                    <div className="w-full h-full bg-gray-800" style={{ filter: filter.filter, backgroundColor: '#555' }}></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-white">{filter.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex items-center gap-8">
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
                             {/* Music Button */}
                             {!isRecording && (
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        onChange={handleMusicUpload}
                                    />
                                    <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                                        <Music size={20} className={audioFile ? "text-purple-400" : "text-white"} />
                                    </button>
                                </div>
                            )}

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

                             {/* Placeholder to balance layout */}
                             {!isRecording && <div className="w-12" />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
