"use client";

import React, { useState, useRef } from "react";
import { CreateContextState } from "./CreateFlow";
import { Play, Pause, Type, Music, Sticker as StickerIcon, ArrowRight, X, Maximize2, Move } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider"; // Assuming Shadcn UI Slider exists or standard input range

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
    const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

    // Tools State
    const [activeTool, setActiveTool] = useState<'none' | 'text' | 'sticker' | 'music'>('none');
    const [textInput, setTextInput] = useState("");

    const togglePlay = () => {
        if (selectedOverlayId) {
            setSelectedOverlayId(null);
            return;
        }

        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const addText = () => {
        if (!textInput.trim()) return;
        const newId = Date.now().toString();
        setOverlays([...overlays, {
            id: newId,
            type: 'text',
            content: textInput,
            x: 50,
            y: 50,
            scale: 1,
            rotation: 0
        }]);
        setTextInput("");
        setActiveTool('none');
        setSelectedOverlayId(newId);
    };

    const addSticker = (emoji: string) => {
        const newId = Date.now().toString();
        setOverlays([...overlays, {
            id: newId,
            type: 'sticker',
            content: emoji,
            x: 50,
            y: 50,
            scale: 2,
            rotation: 0
        }]);
        setActiveTool('none');
        setSelectedOverlayId(newId);
    };

    const updateOverlay = (id: string, updates: Partial<Overlay>) => {
        setOverlays(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    };

    const removeOverlay = (id: string) => {
        setOverlays(prev => prev.filter(o => o.id !== id));
        if (selectedOverlayId === id) setSelectedOverlayId(null);
    };

    const handleNext = () => {
        onNext(media);
    };

    const selectedOverlay = overlays.find(o => o.id === selectedOverlayId);

    return (
        <div className="h-full flex flex-col bg-black relative">

            {/* Top Bar with Next Button */}
            <div className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-end bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                 <button
                    onClick={handleNext}
                    className="pointer-events-auto px-6 py-2 bg-red-600 rounded-full font-bold flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-900/50"
                >
                    Next <ArrowRight size={16} />
                </button>
            </div>

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
                        onClick={(e) => { e.stopPropagation(); setSelectedOverlayId(overlay.id); }}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 select-none transition-all duration-75 ${selectedOverlayId === overlay.id ? 'z-50 ring-2 ring-white rounded-lg p-2 bg-black/20 backdrop-blur-sm' : 'z-10'}`}
                        style={{
                            left: `${overlay.x}%`,
                            top: `${overlay.y}%`,
                            transform: `translate(-50%, -50%) rotate(${overlay.rotation}deg)`
                        }}
                    >
                        {selectedOverlayId === overlay.id && (
                            <button
                                onClick={(e) => { e.stopPropagation(); removeOverlay(overlay.id); }}
                                className="absolute -top-4 -right-4 bg-red-500 rounded-full p-1.5 shadow-md z-50"
                            >
                                <X size={12} className="text-white" />
                            </button>
                        )}

                        {overlay.type === 'text' ? (
                            <span
                                className="text-white font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] whitespace-nowrap"
                                style={{ fontSize: `${24 * overlay.scale}px` }}
                            >
                                {overlay.content}
                            </span>
                        ) : (
                            <span style={{ fontSize: `${24 * overlay.scale}px` }}>{overlay.content}</span>
                        )}
                    </div>
                ))}

                {/* Play Button Overlay */}
                {!isPlaying && media.type === 'video' && !selectedOverlayId && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <Play size={48} className="text-white/80 fill-white/80" />
                    </div>
                )}
            </div>

            {/* Editor Tools Side Bar (Hidden if overlay selected) */}
            {!selectedOverlayId && (
                <div className="absolute top-20 right-4 flex flex-col gap-4 z-40">
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
            )}

            {/* Selected Overlay Controls (Bottom Sheet) */}
            {selectedOverlay && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50 flex flex-col gap-4 animate-in slide-in-from-bottom">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                        <span>Edit {selectedOverlay.type}</span>
                        <button onClick={() => setSelectedOverlayId(null)} className="text-white bg-gray-800 px-3 py-1 rounded-full">Done</button>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-4">
                            <Maximize2 size={16} className="text-gray-400" />
                            <input
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.1"
                                value={selectedOverlay.scale}
                                onChange={(e) => updateOverlay(selectedOverlay.id, { scale: parseFloat(e.target.value) })}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                         <div className="flex items-center gap-4">
                            <Move size={16} className="text-gray-400" />
                            <div className="flex gap-2 flex-1">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={selectedOverlay.x}
                                    onChange={(e) => updateOverlay(selectedOverlay.id, { x: parseFloat(e.target.value) })}
                                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    title="Horizontal Position"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={selectedOverlay.y}
                                    onChange={(e) => updateOverlay(selectedOverlay.id, { y: parseFloat(e.target.value) })}
                                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                    title="Vertical Position"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-xs w-4">Rot</span>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                value={selectedOverlay.rotation}
                                onChange={(e) => updateOverlay(selectedOverlay.id, { rotation: parseFloat(e.target.value) })}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tool Modals */}
            {activeTool === 'text' && (
                 <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                        autoFocus
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="bg-transparent text-white text-3xl font-bold text-center outline-none border-b-2 border-red-500 w-full mb-8 pb-2"
                        placeholder="Type text..."
                    />
                    <div className="flex gap-4 w-full max-w-xs">
                        <button onClick={() => setActiveTool('none')} className="flex-1 py-3 bg-gray-800 rounded-full text-white font-medium">Cancel</button>
                        <button onClick={addText} className="flex-1 py-3 bg-red-600 rounded-full text-white font-bold shadow-lg shadow-red-900/50">Done</button>
                    </div>
                </div>
            )}

            {activeTool === 'sticker' && (
                 <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-gray-800 p-6 rounded-2xl grid grid-cols-3 gap-6 w-full max-w-sm">
                        {STICKERS.map(emoji => (
                            <button key={emoji} onClick={() => addSticker(emoji)} className="text-5xl hover:scale-125 transition-transform p-2">
                                {emoji}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setActiveTool('none')} className="absolute bottom-10 px-8 py-3 bg-gray-800 rounded-full text-white font-medium">Close</button>
                </div>
            )}
        </div>
    );
}
