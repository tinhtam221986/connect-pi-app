"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, ChevronLeft, Disc, Flashlight, FlipHorizontal, Mic, Music, Settings, Timer, X, Smile, Sparkles, ScrollText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AIScriptGenerator } from "./AIScriptGenerator";

interface CameraRecorderProps {
    onComplete: (blob: Blob) => void;
}

export function CameraRecorder({ onComplete }: CameraRecorderProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recording, setRecording] = useState(false);
    const [chunks, setChunks] = useState<Blob[]>([]);
    const [duration, setDuration] = useState(0);
    const [cameraType, setCameraType] = useState<"user" | "environment">("user");
    const [filter, setFilter] = useState("none");
    const [speed, setSpeed] = useState(1);
    const [captureMode, setCaptureMode] = useState<"video" | "photo">("video");

    // AI & Teleprompter
    const [showAI, setShowAI] = useState(false);
    const [teleprompterText, setTeleprompterText] = useState("");
    const [showTeleprompter, setShowTeleprompter] = useState(false);

    // Timer state
    const [timerDelay, setTimerDelay] = useState(0); // 0, 3, 10
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Camera
    const startCamera = useCallback(async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: { facingMode: cameraType, width: { ideal: 720 }, height: { ideal: 1280 } },
                audio: true
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Camera access denied or not available");
        }
    }, [cameraType]);

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [startCamera]);

    // Filters
    const filters = [
        { name: "Normal", value: "none" },
        { name: "Gray", value: "grayscale(100%)" },
        { name: "Sepia", value: "sepia(60%)" },
        { name: "Saturate", value: "saturate(200%)" },
        { name: "Invert", value: "invert(100%)" },
        { name: "Hue", value: "hue-rotate(90deg)" },
    ];

    const handleCapture = () => {
        if (!stream || !videoRef.current) return;

        const executeCapture = () => {
            if (captureMode === "photo") {
                // Capture Photo
                const canvas = document.createElement("canvas");
                canvas.width = videoRef.current!.videoWidth;
                canvas.height = videoRef.current!.videoHeight;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    // Apply mirroring if user camera
                    if (cameraType === "user") {
                        ctx.translate(canvas.width, 0);
                        ctx.scale(-1, 1);
                    }
                    // Apply filters (basic support)
                    ctx.filter = filter;
                    ctx.drawImage(videoRef.current!, 0, 0);

                    canvas.toBlob((blob) => {
                        if (blob) onComplete(blob);
                    }, "image/jpeg", 0.9);
                }
            } else {
                // Start Video Recording
                startRecording();
            }
        };

        if (timerDelay > 0) {
            setIsCountingDown(true);
            setCountdown(timerDelay);
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsCountingDown(false);
                        executeCapture();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            executeCapture();
        }
    };

    const startRecording = () => {
         // Create a canvas to process the video with filters
         const canvas = document.createElement("canvas");
         if (!videoRef.current) return;

         canvas.width = videoRef.current.videoWidth;
         canvas.height = videoRef.current.videoHeight;
         const ctx = canvas.getContext("2d");

         if (!ctx || !stream) return;

         // Drawing loop
         const draw = () => {
             if (!videoRef.current || !recording) return; // Stop loop if recording stops (logic to be handled via requestAnimationFrame cancellation ideally, but this simple check works for short clips)

             ctx.filter = filter; // Apply current filter
             if (cameraType === "user") {
                 ctx.save();
                 ctx.translate(canvas.width, 0);
                 ctx.scale(-1, 1);
                 ctx.drawImage(videoRef.current, 0, 0);
                 ctx.restore();
             } else {
                 ctx.drawImage(videoRef.current, 0, 0);
             }
             requestAnimationFrame(draw);
         };

         // Start the capture stream from canvas
         // @ts-ignore - captureStream might need vendor prefix in some envs but standard in modern browsers
         const canvasStream = canvas.captureStream(30); // 30 FPS

         // Add audio track from original stream
         stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));

         const mediaRecorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm;codecs=vp9' });
         mediaRecorderRef.current = mediaRecorder;
         const localChunks: Blob[] = [];

         mediaRecorder.ondataavailable = (e) => {
             if (e.data.size > 0) {
                 localChunks.push(e.data);
             }
         };

         mediaRecorder.onstop = () => {
             const blob = new Blob(localChunks, { type: "video/webm" });
             setChunks(localChunks);
             onComplete(blob);
         };

         mediaRecorder.start(100);
         setRecording(true);
         setDuration(0);

         // Start drawing loop
         // We need a way to stop it, but checking 'recording' state inside 'draw' might be stale due to closure.
         // A ref is better.
         const isRecordingRef = { current: true };
         const animate = () => {
             if (!isRecordingRef.current) return;
             if (videoRef.current && ctx) {
                 ctx.filter = filter;
                 if (cameraType === "user") {
                     ctx.save();
                     ctx.translate(canvas.width, 0);
                     ctx.scale(-1, 1);
                     ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                     ctx.restore();
                 } else {
                     ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                 }
             }
             requestAnimationFrame(animate);
         };
         animate();

         // Store ref to stop animation later
         // Hacky: attach to mediaRecorder instance or use a cleanup function
         (mediaRecorder as any)._stopAnimation = () => { isRecordingRef.current = false; };

         timerRef.current = setInterval(() => {
             setDuration(prev => {
                 if (prev >= 60) {
                     handleStopRecording();
                     return 60;
                 }
                 return prev + 0.1;
             });
         }, 100);
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            // Stop animation loop
            if ((mediaRecorderRef.current as any)._stopAnimation) {
                (mediaRecorderRef.current as any)._stopAnimation();
            }
            setRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const toggleCamera = () => {
        setCameraType(prev => prev === "user" ? "environment" : "user");
    };

    const cycleTimer = () => {
        if (timerDelay === 0) setTimerDelay(3);
        else if (timerDelay === 3) setTimerDelay(10);
        else setTimerDelay(0);
    };

    const cycleSpeed = () => {
        const speeds = [0.5, 1, 2, 3];
        const idx = speeds.indexOf(speed);
        setSpeed(speeds[(idx + 1) % speeds.length]);
    };

    return (
        <div className="h-full w-full bg-black relative flex flex-col items-center overflow-hidden">
            {/* Camera View */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn(
                    "absolute inset-0 h-full w-full object-cover transform",
                    cameraType === "user" && "scale-x-[-1]"
                )}
                style={{ filter: filter }}
            />

            {/* Countdown Overlay */}
            {isCountingDown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
                    <span className="text-9xl font-bold text-white animate-pulse">{countdown}</span>
                </div>
            )}

            {/* AI Script Generator Modal */}
            {showAI && (
                <AIScriptGenerator
                    onClose={() => setShowAI(false)}
                    onApplyScript={(script) => {
                        setTeleprompterText(script);
                        setShowTeleprompter(true);
                    }}
                />
            )}

            {/* Teleprompter Overlay */}
            {showTeleprompter && teleprompterText && (
                <div className="absolute inset-x-4 top-24 bottom-32 z-10 pointer-events-none">
                     <div className="w-full h-full overflow-hidden relative">
                         <div className="absolute inset-0 animate-scroll-up opacity-80">
                             <p className="text-2xl font-bold text-white/90 shadow-black drop-shadow-md text-center leading-relaxed whitespace-pre-wrap">
                                 {teleprompterText}
                             </p>
                         </div>
                     </div>
                     {/* Close Teleprompter Button (pointer-events-auto to capture click) */}
                     <button
                        onClick={() => setShowTeleprompter(false)}
                        className="absolute top-0 right-0 p-2 bg-black/50 rounded-full text-white pointer-events-auto"
                     >
                         <X size={16} />
                     </button>
                </div>
            )}

            {/* Header Controls */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-start z-20 safe-area-top pt-8">
                <button className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white">
                    <X size={24} />
                </button>

                <div className="flex px-4 py-1 bg-black/30 backdrop-blur-md rounded-full items-center gap-2">
                    <Music size={16} className="text-white" />
                    <span className="text-xs font-bold text-white">Add Sound</span>
                </div>

                {/* AI Button (Top Right) */}
                <button
                    onClick={() => setShowAI(true)}
                    className="p-2 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 animate-pulse"
                >
                    <Sparkles size={20} />
                </button>
            </div>

            {/* Right Side Tools */}
            <div className="absolute right-4 top-24 flex flex-col gap-6 z-20">
                <ToolButton
                    icon={<FlipHorizontal size={24} />}
                    label="Flip"
                    onClick={toggleCamera}
                />

                {/* Teleprompter Toggle (if text exists) */}
                {teleprompterText && (
                    <ToolButton
                        icon={<ScrollText size={24} />}
                        label="Script"
                        active={showTeleprompter}
                        onClick={() => setShowTeleprompter(!showTeleprompter)}
                    />
                )}
                <ToolButton
                    icon={<Settings size={24} />}
                    label={`Speed ${speed}x`}
                    onClick={cycleSpeed}
                    active={speed !== 1}
                />
                <ToolButton
                    icon={<Flashlight size={24} />}
                    label="Flash"
                    onClick={() => toast.info("Flash not supported in web version")}
                />
                <ToolButton
                    icon={<Timer size={24} />}
                    label={timerDelay > 0 ? `${timerDelay}s` : "Timer"}
                    onClick={cycleTimer}
                    active={timerDelay > 0}
                />

                {/* Filter Selector (Simple) */}
                 <div className="flex flex-col items-center gap-1 group relative">
                    <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500" />
                    </button>
                    <span className="text-[10px] font-medium text-white drop-shadow-md">Filters</span>

                    {/* Popout for filters */}
                    <div className="absolute right-12 top-0 bg-black/80 p-2 rounded-lg hidden group-hover:grid grid-cols-3 gap-2 w-32">
                         {filters.map(f => (
                             <button
                                key={f.name}
                                onClick={() => setFilter(f.value)}
                                className={cn(
                                    "text-[10px] text-white p-1 rounded",
                                    filter === f.value ? "bg-pink-600" : "hover:bg-gray-700"
                                )}
                             >
                                {f.name}
                             </button>
                         ))}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-1 w-full px-2 z-30">
                <div className="h-1 bg-white/30 rounded-full overflow-hidden w-full">
                     <div
                        className="h-full bg-pink-500 transition-all duration-100 ease-linear"
                        style={{ width: `${(duration / 60) * 100}%` }}
                     />
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 w-full flex flex-col items-center z-20 pb-safe safe-area-bottom">
                 {/* Mode Selector */}
                <div className="flex items-center gap-6 mb-6">
                    <button
                        onClick={() => setCaptureMode("photo")}
                        className={cn(
                            "text-sm font-bold transition-all shadow-black drop-shadow-lg",
                            captureMode === "photo" ? "text-white scale-110" : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        PHOTO
                    </button>
                    <button
                        onClick={() => setCaptureMode("video")}
                        className={cn(
                            "text-sm font-bold transition-all shadow-black drop-shadow-lg",
                            captureMode === "video" ? "text-white scale-110" : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        VIDEO
                    </button>
                </div>

                <div className="flex justify-center items-center gap-8 w-full px-8 pb-8">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-gray-800">
                            {/* Last video thumbnail placeholder */}
                        </div>
                        <span className="text-[10px] text-white">Upload</span>
                    </div>

                    {/* Record/Shutter Button */}
                    <button
                        onClick={recording ? handleStopRecording : handleCapture}
                        className={cn(
                            "w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300",
                            recording ? "bg-red-600 scale-110 border-red-200" :
                            captureMode === "video" ? "bg-red-500 hover:scale-105" : "bg-white hover:scale-105"
                        )}
                    >
                        {recording ? (
                            <div className="w-8 h-8 bg-white rounded-sm" />
                        ) : captureMode === "video" ? (
                            null
                        ) : (
                            <div className="w-16 h-16 rounded-full border-2 border-gray-300" />
                        )}
                    </button>

                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur flex items-center justify-center text-white">
                            <Smile size={20} />
                        </div>
                        <span className="text-[10px] text-white">Effects</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolButton({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-1 group"
        >
            <div className={cn(
                "w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center text-white transition-all",
                active ? "bg-yellow-500 text-black" : "bg-black/40 group-active:scale-90"
            )}>
                {icon}
            </div>
            <span className={cn(
                "text-[10px] font-medium drop-shadow-md",
                active ? "text-yellow-500" : "text-white"
            )}>{label}</span>
        </button>
    )
}
