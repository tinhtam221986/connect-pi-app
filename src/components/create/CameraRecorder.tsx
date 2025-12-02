"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Video, StopCircle, Download, Mic, Monitor, Settings2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const FILTERS = [
    { name: "Normal", value: "" },
    { name: "Cinematic", value: "contrast(1.2) saturate(1.3)" },
    { name: "Noir", value: "grayscale(1) contrast(1.2)" },
    { name: "Vaporwave", value: "hue-rotate(20deg) contrast(1.1) saturate(1.5)" },
    { name: "Sepia", value: "sepia(0.8)" },
];

export function CameraRecorder({ script, onUpload }: { script?: string, onUpload?: (blob: Blob) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [chunks, setChunks] = useState<Blob[]>([]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    const startCamera = async () => {
        try {
            if (stream) stopCamera();
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: true
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            toast.error("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const startRecording = () => {
        if (!stream) return;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const localChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) localChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(localChunks, { type: "video/webm" });
            setChunks(localChunks);
            if (onUpload) onUpload(blob);
            toast.success("Recording saved!");
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden flex flex-col">
            {/* Video Preview */}
            <div className="relative flex-1 bg-gray-900 overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-all duration-500 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    style={{ filter: activeFilter.value }}
                />

                {/* Teleprompter Overlay */}
                {script && (
                    <div className="absolute top-4 left-4 right-4 bg-black/40 backdrop-blur-sm p-4 rounded-xl text-white text-lg font-medium leading-relaxed max-h-48 overflow-y-auto z-10 border border-white/10 shadow-lg animate-in slide-in-from-top">
                        <p className="opacity-90 drop-shadow-md">{script}</p>
                    </div>
                )}

                {/* Filter Selector */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    <button onClick={toggleCamera} className="p-2 bg-black/50 rounded-full text-white backdrop-blur hover:bg-black/70">
                        <RefreshCcw size={20} />
                    </button>
                    {FILTERS.map(f => (
                        <button
                            key={f.name}
                            onClick={() => setActiveFilter(f)}
                            className={`w-8 h-8 rounded-full border-2 ${activeFilter.name === f.name ? 'border-white scale-110' : 'border-transparent opacity-70'} overflow-hidden shadow-lg`}
                            style={{ background: 'gray', filter: f.value }}
                            title={f.name}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-white/20 to-black/20"></div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-black/80 backdrop-blur-md p-6 flex justify-between items-center border-t border-gray-800">
                <div className="w-12"></div> {/* Spacer */}

                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-xl ${isRecording ? 'border-red-500 bg-transparent scale-110' : 'border-white bg-red-600 hover:scale-105'}`}
                >
                    {isRecording ? (
                        <div className="w-8 h-8 bg-red-500 rounded-sm animate-pulse" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-red-600 border-4 border-black" />
                    )}
                </button>

                <div className="w-12 flex justify-end">
                    {chunks.length > 0 && !isRecording && (
                        <button className="p-3 bg-blue-600 rounded-full text-white animate-bounce shadow-lg shadow-blue-500/30">
                            <Download size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
