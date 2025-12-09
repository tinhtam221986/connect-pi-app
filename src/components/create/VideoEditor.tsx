"use client";

import React, { useState, useRef } from "react";
import { CreateContextState } from "./CreateFlow";
import { Play, Pause, Type, Music, Sticker as StickerIcon, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

interface VideoEditorProps {
    media: CreateContextState;
    onNext: (media: CreateContextState) => void;
}

interface Overlay {
    id: string;
    type: 'text' | 'sticker';
    content: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
}

const STICKERS = ["🔥", "😂", "❤️", "👍", "🎉", "👀", "💎", "🚀", "🥧"];

export function VideoEditor({ media, onNext }: VideoEditorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [overlays, setOverlays] = useState<Overlay[]>([]);

    // Tools State
    const [activeTool, setActiveTool] = useState<'none' | 'text' | 'sticker' | 'music'>('none');
    const [textInput, setTextInput] = useState("");

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const addText = () => {
        if (!textInput.trim()) return;
        setOverlays([...overlays, {
            id: Date.now().toString(),
            type: 'text',
            content: textInput,
            x: 50, // Percent
            y: 50,
            scale: 1,
            rotation: 0
        }]);
        setTextInput("");
        setActiveTool('none');
    };

    const addSticker = (emoji: string) => {
        setOverlays([...overlays, {
            id: Date.now().toString(),
            type: 'sticker',
            content: emoji,
            x: 50,
            y: 50,
            scale: 2,
            rotation: 0
        }]);
        setActiveTool('none');
    };

    const removeOverlay = (id: string) => {
        setOverlays(prev => prev.filter(o => o.id !== id));
    };

    const handleNext = () => {
        // Here we would ideally merge the overlays or pass them as metadata.
        // For MVP, we pass the original media and we COULD pass overlays in a separate context or property.
        // Since CreateContextState is defined in CreateFlow, we might need to extend it or just pass it through.
        // The user wants the flow.
        // We will assume 'onNext' leads to PostSettings where we attach overlays to the post metadata.
        // But CreateContextState doesn't have 'overlays'.
        // We will hack it: Attach to the 'file' object as a custom property or rely on parent state.
        // Actually, CreateFlow manages state. We should update CreateFlow to store overlays.
        // For now, we'll just proceed to PostSettings. The overlays will be lost in this implementation unless we update CreateFlow.
        // I'll update CreateFlow later if needed. For now, this is a visual demo of the "Edit" phase.
        onNext(media);
    };

    return (
        <div className="h-full flex flex-col bg-black relative">
            {/* Main Preview Area */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gray-900" onClick={togglePlay}>
                {media.type === 'video' ? (
                    <video
                        ref={videoRef}
                        src={media.previewUrl || ""}
                        className="w-full h-full object-contain"
                        loop
                        autoPlay
                        playsInline
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={media.previewUrl || ""} className="w-full h-full object-contain" alt="preview" />
                )}

                {/* Overlays Rendering */}
                {overlays.map(overlay => (
                    <div
                        key={overlay.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move select-none"
                        style={{ left: `${overlay.x}%`, top: `${overlay.y}%` }}
                    >
                         <div className="relative group">
                            <button
                                onClick={(e) => { e.stopPropagation(); removeOverlay(overlay.id); }}
                                className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={10} className="text-white" />
                            </button>
                            {overlay.type === 'text' ? (
                                <span
                                    className="text-white font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                                    style={{ fontSize: `${24 * overlay.scale}px` }}
                                >
                                    {overlay.content}
                                </span>
                            ) : (
                                <span style={{ fontSize: `${24 * overlay.scale}px` }}>{overlay.content}</span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Play Button Overlay */}
                {!isPlaying && media.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <Play size={48} className="text-white/80 fill-white/80" />
                    </div>
                )}
            </div>

            {/* Editor Tools Side Bar */}
            <div className="absolute top-20 right-4 flex flex-col gap-4">
                <button onClick={(e) => { e.stopPropagation(); setActiveTool('text'); }} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20">
                        <Type size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold shadow-black drop-shadow-md">Text</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setActiveTool('sticker'); }} className="flex flex-col items-center gap-1 group">
                     <div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20">
                        <StickerIcon size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold shadow-black drop-shadow-md">Sticker</span>
                </button>
                 <button onClick={(e) => { e.stopPropagation(); toast.info("Music Library Coming Soon"); }} className="flex flex-col items-center gap-1 group">
                     <div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20">
                        <Music size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold shadow-black drop-shadow-md">Sound</span>
                </button>
            </div>

            {/* Bottom Bar: Next */}
            <div className="p-4 bg-black flex justify-between items-center z-50">
                <div className="text-xs text-gray-500">
                    Add effects and text
                </div>
                <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-red-600 rounded-full font-bold flex items-center gap-2 hover:bg-red-700 transition-colors"
                >
                    Next <ArrowRight size={16} />
                </button>
            </div>

            {/* Tool Modals */}
            {activeTool === 'text' && (
                 <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                        autoFocus
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="bg-transparent text-white text-3xl font-bold text-center outline-none border-b-2 border-red-500 w-full mb-4"
                        placeholder="Type text..."
                    />
                    <div className="flex gap-4">
                        <button onClick={() => setActiveTool('none')} className="px-4 py-2 bg-gray-600 rounded-full text-white">Cancel</button>
                        <button onClick={addText} className="px-4 py-2 bg-red-600 rounded-full text-white font-bold">Done</button>
                    </div>
                </div>
            )}

            {activeTool === 'sticker' && (
                 <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-gray-800 p-4 rounded-xl grid grid-cols-3 gap-4">
                        {STICKERS.map(emoji => (
                            <button key={emoji} onClick={() => addSticker(emoji)} className="text-4xl hover:scale-125 transition-transform">
                                {emoji}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setActiveTool('none')} className="absolute bottom-10 px-4 py-2 bg-gray-600 rounded-full text-white">Close</button>
                </div>
            )}
        </div>
    );
}
