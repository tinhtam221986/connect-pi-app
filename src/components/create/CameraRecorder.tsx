"use client";

import React, { useRef, useState, useEffect } from "react";
import { RefreshCw, X, Zap, Settings, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CameraRecorderProps {
    onCapture: (blob: Blob) => void;
    script?: string;
    onClose: () => void;
}

const FILTERS = [
    { name: "Normal", class: "brightness-100 contrast-100 saturate-100" },
    { name: "Vivid", class: "brightness-110 contrast-125 saturate-150" },
    { name: "Vintage", class: "sepia contrast-110 brightness-90" },
    { name: "B&W", class: "grayscale contrast-125" },
    { name: "Cyber", class: "hue-rotate-180 contrast-125" },
];

export function CameraRecorder({ onCapture, script, onClose }: CameraRecorderProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [chunks, setChunks] = useState<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
    const [filter, setFilter] = useState(FILTERS[0]);
    const [timer, setTimer] = useState(0);
    const [countdown, setCountdown] = useState<number | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        let currentStream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                if (stream) {
                    stream.getTracks().forEach(t => t.stop());
                }
                const constraints = {
                    video: { facingMode: facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
                    audio: true
                };
                currentStream = await navigator.mediaDevices.getUserMedia(constraints);
                setStream(currentStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = currentStream;
                }
            } catch (err) {
                console.error("Camera Error:", err);
                toast.error("Could not access camera");
            }
        };

        startCamera();

        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]);

    // Cleanup timer
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = () => {
        if (!stream) return;
        setCountdown(3);
        let count = 3;
        const countInterval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                clearInterval(countInterval);
                setCountdown(null);
                actuallyStartRecording();
            }
        }, 1000);
    };

    const actuallyStartRecording = () => {
        if (!stream) return;
        chunksRef.current = [];
        setChunks([]);

        let recorder: MediaRecorder;
        try {
             recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        } catch (e) {
             recorder = new MediaRecorder(stream);
        }

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                setChunks(prev => [...prev, e.data]);
                chunksRef.current.push(e.data);
            }
        };

        recorder.start(100);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);

        const startTime = Date.now();
        timerRef.current = setInterval(() => {
            setTimer(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
    };

    const handleStop = () => {
         if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);

            setTimeout(() => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                onCapture(blob);
            }, 500);
         }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative h-full w-full bg-black flex flex-col items-center overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`flex-1 w-full object-cover transition-all duration-300 ${filter.class}`}
            />

            {countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
                    <span className="text-9xl font-bold text-white animate-ping">{countdown}</span>
                </div>
            )}

            {script && (
                <div className="absolute top-20 left-4 right-4 h-32 overflow-y-auto bg-black/40 backdrop-blur-sm p-4 rounded-xl text-lg font-medium text-white/90 text-center z-20 pointer-events-auto border border-white/10 shadow-xl mask-linear">
                    {script}
                </div>
            )}

            <div className="absolute top-4 w-full px-4 flex justify-between items-center z-30">
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white bg-black/20 hover:bg-black/40 rounded-full">
                    <X size={24} />
                </Button>
                <div className="flex gap-2">
                     <Button variant="ghost" size="icon" className="text-white bg-black/20 hover:bg-black/40 rounded-full">
                         <Zap size={20} />
                     </Button>
                     <Button variant="ghost" size="icon" className="text-white bg-black/20 hover:bg-black/40 rounded-full">
                         <Settings size={20} />
                     </Button>
                </div>
            </div>

            <div className="absolute bottom-32 w-full overflow-x-auto px-4 pb-2 z-30 scrollbar-hide">
                <div className="flex gap-4 justify-center">
                    {FILTERS.map((f) => (
                        <button
                            key={f.name}
                            onClick={() => setFilter(f)}
                            className={`flex flex-col items-center gap-1 min-w-[60px] ${filter.name === f.name ? "text-yellow-400 scale-110" : "text-white/70"} transition-all`}
                        >
                            <div className={`w-12 h-12 rounded-full border-2 ${filter.name === f.name ? "border-yellow-400" : "border-white/30"} bg-gray-800 overflow-hidden`}>
                                <div className={`w-full h-full bg-gradient-to-tr from-purple-500 to-orange-500 ${f.class}`}></div>
                            </div>
                            <span className="text-[10px] font-medium shadow-black drop-shadow-md">{f.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-around z-30 pb-4">
                 <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 w-12 h-12 rounded-full">
                     <div className="flex flex-col items-center">
                        <Upload size={24} />
                        <span className="text-[10px] mt-1">Upload</span>
                     </div>
                 </Button>

                 <button
                    onClick={isRecording ? handleStop : startRecording}
                    className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-900/30 ${isRecording ? "bg-red-600 scale-110" : "bg-red-500 hover:scale-105"}`}
                 >
                    {isRecording ? (
                        <div className="w-8 h-8 bg-white rounded-sm" />
                    ) : (
                        <div className="w-18 h-18 bg-red-500 rounded-full" />
                    )}
                 </button>

                 <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 w-12 h-12 rounded-full"
                    onClick={() => setFacingMode(prev => prev === "user" ? "environment" : "user")}
                >
                     <div className="flex flex-col items-center">
                        <RefreshCw size={24} className={facingMode === "environment" ? "rotate-180 transition-transform" : "transition-transform"} />
                        <span className="text-[10px] mt-1">Flip</span>
                     </div>
                 </Button>
            </div>

            {isRecording && (
                <div className="absolute bottom-36 bg-red-600/90 text-white px-3 py-1 rounded-full text-sm font-mono font-bold flex items-center gap-2 animate-pulse z-30">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    {formatTime(timer)}
                </div>
            )}
        </div>
    );
}
