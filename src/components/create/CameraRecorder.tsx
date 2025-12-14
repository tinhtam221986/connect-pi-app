"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, StopCircle, RefreshCcw, Check, Music, Video, X, Image as ImageIcon, RotateCcw, Timer, Zap, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { VIDEO_FILTERS } from "@/lib/video-filters";

interface CameraRecorderProps {
    onVideoRecorded?: (blob: Blob) => void;
    script?: string;
}

const SPEEDS = [0.3, 0.5, 1, 2, 3];

export function CameraRecorder({ onVideoRecorded, script }: CameraRecorderProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]); // All chunks from a single session
    const [currentFilter, setCurrentFilter] = useState(VIDEO_FILTERS[0]);
    const [timer, setTimer] = useState(0); // Total duration
    const [countdown, setCountdown] = useState(0); 
    const [timerMode, setTimerMode] = useState<0|3|10>(0); // 0, 3s, 10s
    const [flashActive, setFlashActive] = useState(false);
    const [facingMode, setFacingMode] = useState<'user'|'environment'>('user');
    const [speed, setSpeed] = useState(1);

    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startCamera = async () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: facingMode, aspectRatio: 9/16, width: { ideal: 720 } },
                audio: true 
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play(); 
            }
            drawToCanvas();

        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Could not access camera");
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

    const drawToCanvas = () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth || 360;
                canvas.height = video.videoHeight || 640;
            }
            
            // Draw Video (Mirror if user facing)
            ctx.save();
            if (facingMode === 'user') {
                 ctx.translate(canvas.width, 0);
                 ctx.scale(-1, 1);
            }
            ctx.filter = currentFilter.filter;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
        animationFrameRef.current = requestAnimationFrame(drawToCanvas);
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    useEffect(() => {
        startCamera();
    }, [facingMode]);

    
    const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioFile(file);
            const url = URL.createObjectURL(file);
            setAudioPreviewUrl(url);
            
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            
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

    const startRecording = async () => {
        if (!canvasRef.current) return;

        // If resuming from pause
        if (isPaused && mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            setIsRecording(true);
            timerIntervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);

            // Resume Music
            if (backgroundAudioRef.current) {
                backgroundAudioRef.current.play();
                backgroundAudioRef.current.playbackRate = speed;
            }
            return;
        }

        if (timerMode > 0) {
            setCountdown(timerMode);
            const countInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countInterval);
                        performStartRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            performStartRecording();
        }
    };

    const performStartRecording = () => {
        if (!canvasRef.current) return;
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 200);

        setRecordedChunks([]);
        const canvasStream = canvasRef.current.captureStream(30);
        let finalAudioStream: MediaStream;

        if (audioFile && backgroundAudioRef.current && audioContextRef.current) {
             const ctx = audioContextRef.current;
             const dest = ctx.createMediaStreamDestination();
             destinationRef.current = dest;

             if (videoRef.current && videoRef.current.srcObject) {
                 const micStream = videoRef.current.srcObject as MediaStream;
                 const micSource = ctx.createMediaStreamSource(micStream);
                 micSource.connect(dest);
             }

             if (!sourceNodeRef.current) {
                 sourceNodeRef.current = ctx.createMediaElementSource(backgroundAudioRef.current);
             }
             sourceNodeRef.current.connect(dest);
             sourceNodeRef.current.connect(ctx.destination);

             backgroundAudioRef.current.play();
             backgroundAudioRef.current.playbackRate = speed;

             finalAudioStream = dest.stream;
        } else {
             const stream = videoRef.current?.srcObject as MediaStream;
             finalAudioStream = stream;
        }

        const tracks = [
            ...canvasStream.getVideoTracks(),
            ...(finalAudioStream ? finalAudioStream.getAudioTracks() : [])
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
                 if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                 if (backgroundAudioRef.current) {
                     backgroundAudioRef.current.pause();
                 }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);
            setTimer(0);
            timerIntervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);

        } catch (e) {
            console.error("MediaRecorder error:", e);
            toast.error("Recording failed to start.");
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.pause();
            setIsRecording(false);
            setIsPaused(true);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

            if (backgroundAudioRef.current) {
                backgroundAudioRef.current.pause();
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

            // Wait for dataavailable
            setTimeout(() => {
                handleFinish();
            }, 500);
        }
    };

    const handleFinish = () => {
        // Blob construction needs to happen after state update in a useEffect or here if we trust closure (we don't fully).
        // Actually, we should trigger a save in a separate effect that watches 'recordedChunks' OR rely on the fact that stopRecording triggers it.
        // We will do it simple:
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        // However, recordedChunks in closure might be stale? No, 'setRecordedChunks' is async.
        // Let's use a ref or just rely on the onStop to trigger a state that triggers save.
        // But for this code block, we will just call onVideoRecorded if chunks exist.
        // Wait, 'recordedChunks' state won't be updated immediately inside this function after 'ondataavailable' fires.
        // This is tricky.
        // Better:
        // We will let the user click "Check" (Done) button explicitly.
        // But if they just hit "Stop", maybe that IS done?
        // TikTok flow: Tap Record -> Tap Stop (Pause) -> Tap Next (Finish).
    };

    // Explicit Finish Button Handler
    const onDoneClick = () => {
         // Stop if recording
         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
             mediaRecorderRef.current.stop();
         }

         // Give time for last chunk
         setTimeout(() => {
             // We need to read the LATEST state of recordedChunks.
             // Since we are in a closure, we might need a Ref to track chunks.
             // But for now, we assume standard React behavior.
             // A cleaner way is to use a ref for chunks.
         }, 500);
    };

    // Use Ref for chunks to avoid closure staleness during save
    const chunksRef = useRef<Blob[]>([]);
    useEffect(() => {
        chunksRef.current = recordedChunks;
    }, [recordedChunks]);

    const finalSave = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        if (onVideoRecorded && blob.size > 0) {
            onVideoRecorded(blob);
        } else {
            toast.error("No video recorded!");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            
            <video ref={videoRef} autoPlay playsInline muted className="hidden" />

            {/* Top Controls */}
            <div className="absolute top-4 right-4 z-40 flex flex-col gap-4">
                 <button onClick={toggleCamera} className="p-2 bg-black/40 backdrop-blur rounded-full text-white">
                     <RotateCcw size={20} />
                     <span className="text-[10px] block text-center">Flip</span>
                 </button>
                 <button onClick={() => setTimerMode(prev => prev === 0 ? 3 : prev === 3 ? 10 : 0)} className="p-2 bg-black/40 backdrop-blur rounded-full text-white">
                     <Timer size={20} className={timerMode > 0 ? "text-blue-400" : ""} />
                     <span className="text-[10px] block text-center">{timerMode > 0 ? `${timerMode}s` : 'Off'}</span>
                 </button>
            </div>

            <div className="relative w-full flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
                <AnimatePresence>
                    {flashActive && (
                        <motion.div 
                            initial={{ opacity: 0.8 }} 
                            animate={{ opacity: 0 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white z-50 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {countdown > 0 && (
                        <motion.div 
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                        >
                            <span className="text-9xl font-bold text-white drop-shadow-2xl">{countdown}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <canvas ref={canvasRef} className="w-full h-full object-cover" />

                {/* Script Overlay */}
                {script && (
                    <div className="absolute top-10 left-4 right-16 bg-black/40 backdrop-blur-sm p-4 rounded-xl text-white text-lg font-medium leading-relaxed max-h-48 overflow-y-auto z-20 pointer-events-none border border-white/10 shadow-lg">
                        {script}
                    </div>
                )}

                <AnimatePresence>
                    <motion.div 
                        key={currentFilter.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white z-30"
                    >
                        {currentFilter.name}
                    </motion.div>
                </AnimatePresence>

                 {audioFile && (
                    <div className="absolute top-4 left-20 bg-purple-500/80 backdrop-blur px-3 py-1 rounded-full text-xs flex items-center gap-1 text-white z-30">
                        <Music size={12} />
                        <span className="max-w-[100px] truncate">{audioFile.name}</span>
                        {!isRecording && <button onClick={clearMusic}><X size={12} /></button>}
                    </div>
                )}

                {/* Speed Controls Overlay */}
                {!isRecording && !isPaused && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-30">
                        <div className="bg-black/50 backdrop-blur rounded-full p-1 flex gap-1">
                            {SPEEDS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSpeed(s)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${speed === s ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
                                >
                                    {s}x
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex flex-col items-center gap-6 z-30">
                
                {/* Timer / Progress */}
                <div className="flex flex-col items-center gap-1">
                     <div className="text-white font-mono font-bold text-xl drop-shadow-md">
                        {formatTime(timer)}
                     </div>
                </div>

                {!isRecording && !isPaused && (
                    <div className="flex gap-4 overflow-x-auto w-full px-4 pb-2 no-scrollbar justify-start md:justify-center">
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

                <div className="flex items-center gap-8">
                     {/* Left Button Group */}
                     <div className="flex flex-col items-center gap-2 w-10">
                        {!isRecording && !isPaused && (
                             <>
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
                                <span className="text-[10px] font-bold text-gray-400">Sound</span>
                            </>
                        )}
                        {/* Clear/Reset button if paused */}
                        {isPaused && (
                             <button
                                onClick={() => {
                                    if(mediaRecorderRef.current) mediaRecorderRef.current.stop();
                                    setRecordedChunks([]);
                                    setIsPaused(false);
                                    setTimer(0);
                                }}
                                className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                            >
                                <RotateCcw size={20} className="text-white" />
                            </button>
                        )}
                    </div>

                    {/* Record Button */}
                    {!isRecording && !isPaused ? (
                        <button
                            onClick={startRecording}
                            className="w-20 h-20 rounded-full border-[6px] border-white/30 flex items-center justify-center group transition-all hover:scale-105"
                        >
                            <div className="w-16 h-16 bg-red-500 rounded-full group-hover:scale-90 transition-transform shadow-lg shadow-red-900/50" />
                        </button>
                    ) : isRecording ? (
                        <button
                            onClick={pauseRecording}
                            className="w-20 h-20 rounded-full border-[6px] border-red-500/30 flex items-center justify-center transition-all hover:scale-105"
                        >
                            <div className="w-8 h-8 bg-white rounded-sm shadow-lg" />
                            {/* Pause Icon representation */}
                        </button>
                    ) : (
                         // Is Paused -> Resume
                        <button
                            onClick={startRecording}
                            className="w-20 h-20 rounded-full border-[6px] border-red-500/30 flex items-center justify-center transition-all hover:scale-105"
                        >
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                                <Play size={32} className="text-white fill-white ml-1" />
                            </div>
                        </button>
                    )}

                     {/* Right Button Group (Finish / Upload) */}
                     <div className="flex flex-col items-center gap-2 w-10">
                         {isPaused ? (
                             <button
                                onClick={() => {
                                    if(mediaRecorderRef.current) mediaRecorderRef.current.stop();
                                    setTimeout(finalSave, 200);
                                }}
                                className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-bounce shadow-lg"
                             >
                                 <Check size={20} className="text-white" />
                             </button>
                         ) : (
                             !isRecording && !isPaused && (
                                 <div className="relative">
                                     {/* Reuse Native Upload logic */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-10 h-10 rounded-lg bg-gray-800 border-2 border-gray-600 flex items-center justify-center overflow-hidden hover:border-gray-400 transition"
                                    >
                                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-50" />
                                        <ImageIcon size={16} className="absolute text-white drop-shadow" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="video/*,image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={(e) => {
                                            if(e.target.files?.[0] && onVideoRecorded) {
                                                const file = e.target.files[0];
                                                onVideoRecorded(new Blob([file], {type: file.type}));
                                            }
                                        }}
                                    />
                                    <span className="text-[10px] font-bold text-gray-400">Upload</span>
                                 </div>
                             )
                         )}
                         {isPaused && <span className="text-[10px] font-bold text-white">Next</span>}
                     </div>
                </div>
            </div>
        </div>
    );
}
