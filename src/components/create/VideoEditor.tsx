"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Check, Music, Smile, Type } from "lucide-react";

interface VideoEditorProps {
    blob: Blob;
    onBack: () => void;
    onNext: (blob: Blob) => void;
}

export function VideoEditor({ blob, onBack, onNext }: VideoEditorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const isImage = blob.type.startsWith("image/");

    useEffect(() => {
        if (videoRef.current && blob && !isImage) {
            videoRef.current.src = URL.createObjectURL(blob);
            videoRef.current.play().catch(e => console.log("Autoplay failed", e));
        }
    }, [blob, isImage]);

    const togglePlay = () => {
        if (isImage) return;
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="h-full w-full bg-black relative flex flex-col">
            {/* Header */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={onBack} className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white">
                    <ArrowLeft size={24} />
                </button>
                <button
                    onClick={() => onNext(blob)}
                    className="px-4 py-2 bg-pink-600 rounded-full text-white font-bold text-sm"
                >
                    Next
                </button>
            </div>

            {/* Main Preview */}
            <div className="flex-1 relative flex items-center justify-center bg-gray-900" onClick={togglePlay}>
                {isImage ? (
                    <img
                        src={URL.createObjectURL(blob)}
                        className="h-full w-full object-contain"
                        alt="Preview"
                    />
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            className="h-full w-full object-contain"
                            loop
                            playsInline
                        />
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1" />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Editing Tools (Right Side) */}
            <div className="absolute right-4 top-20 flex flex-col gap-6 z-20">
                <ToolButton icon={<Type size={20} />} label="Text" />
                <ToolButton icon={<Smile size={20} />} label="Stickers" />
                <ToolButton icon={<Music size={20} />} label="Sound" />
                <ToolButton icon={<Check size={20} />} label="Effects" />
            </div>

            {/* Bottom Timeline (Mock) */}
            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent p-4 pb-8 safe-area-bottom z-20">
                <div className="text-xs text-center text-white/70 mb-2">Editor Timeline (Coming Soon)</div>
                <div className="w-full h-12 bg-white/10 rounded-lg border border-white/20 overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-yellow-500/30 border-r-2 border-yellow-500" />
                    {/* Mock waveform */}
                    <div className="flex items-center justify-center h-full gap-1 opacity-50">
                        {[...Array(20)].map((_, i) => (
                             <div key={i} className="w-1 bg-white rounded-full" style={{height: `${Math.random() * 80 + 20}%`}} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolButton({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex flex-col items-center gap-1 group">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-active:scale-90 transition-transform">
                {icon}
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md">{label}</span>
        </button>
    )
}
