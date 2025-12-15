"use client";

import React, { useState, useRef } from "react";
import { CreateContextState } from "./CreateFlow";
import { Play, Type, Music, Sticker as StickerIcon, ArrowRight, X, Maximize2, Move, Scissors, Save, Check } from "lucide-react";
import { toast } from "sonner";

export interface EditorState {
    overlays: Overlay[];
    trim: { start: number; end: number };
    music: string | null;
}

interface VideoEditorProps {
    media: CreateContextState;
    onNext: (state: EditorState) => void;
    onSaveDraft?: (state: EditorState) => void;
    initialState?: EditorState;
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

export function VideoEditor({ media, onNext, onSaveDraft, initialState }: VideoEditorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    // State
    const [overlays, setOverlays] = useState<Overlay[]>(initialState?.overlays || []);
    const [trim, setTrim] = useState(initialState?.trim || { start: 0, end: 100 });
    const [duration, setDuration] = useState(0);

    const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

    // Tools State
    const [activeTool, setActiveTool] = useState<'none' | 'text' | 'sticker' | 'music' | 'trim'>('none');
    const [textInput, setTextInput] = useState("");

    // Load duration
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            if (!initialState) {
                setTrim({ start: 0, end: videoRef.current.duration });
            }
        }
    };

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
        // Enforce max 60s
        const duration = trim.end - trim.start;
        if (duration > 61) { // slight buffer
            toast.error("Video duration max 60s. Please trim it.");
            setActiveTool('trim');
            return;
        }
        onNext({ overlays, trim, music: null });
    };

    const handleSaveDraft = () => {
        if (onSaveDraft) {
            onSaveDraft({ overlays, trim, music: null });
            toast.success("Draft Saved!");
        }
    };

    // Trim Loop
    const handleTimeUpdate = () => {
        if (videoRef.current) {
             if (videoRef.current.currentTime >= trim.end) {
                 videoRef.current.currentTime = trim.start;
                 if (!isPlaying && isPlaying) videoRef.current.pause(); // logic fix
             }
        }
    };

    const selectedOverlay = overlays.find(o => o.id === selectedOverlayId);

    return (
        <div className="h-full flex flex-col bg-black relative">

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-between bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                 {/* Save Draft */}
                 {onSaveDraft && (
                     <button onClick={handleSaveDraft} className="pointer-events-auto p-2 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20">
                         <Save size={20} />
                     </button>
                 )}
                 <div />
                 {/* Next */}
                 <button
                    onClick={handleNext}
                    className="pointer-events-auto px-6 py-2 bg-primary rounded-full font-bold flex items-center gap-2 hover:bg-primary/80 transition-colors shadow-lg shadow-primary/30"
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
                        loop={false}
                        autoPlay
                        playsInline
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
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

            {/* Editor Tools Bottom Bar (Smart Layout) */}
            {!selectedOverlayId && activeTool === 'none' && (
                 <div className="bg-black border-t border-white/10 p-4 pb-safe flex justify-around items-center z-40">
                    <button onClick={() => setActiveTool('text')} className="flex flex-col items-center gap-1 group">
                         <Type size={24} className="text-white group-hover:text-primary transition-colors" />
                         <span className="text-[10px] text-gray-400">Text</span>
                    </button>

                    <button onClick={() => setActiveTool('sticker')} className="flex flex-col items-center gap-1 group">
                         <StickerIcon size={24} className="text-white group-hover:text-primary transition-colors" />
                         <span className="text-[10px] text-gray-400">Sticker</span>
                    </button>

                    <button onClick={() => setActiveTool('trim')} className="flex flex-col items-center gap-1 group">
                         <Scissors size={24} className="text-white group-hover:text-primary transition-colors" />
                         <span className="text-[10px] text-gray-400">Trim</span>
                    </button>

                    <button onClick={() => toast.info("Music Library Coming Soon")} className="flex flex-col items-center gap-1 group">
                         <Music size={24} className="text-white group-hover:text-primary transition-colors" />
                         <span className="text-[10px] text-gray-400">Sound</span>
                    </button>
                 </div>
            )}

            {/* Trim Tool UI */}
            {activeTool === 'trim' && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 pb-safe z-50 animate-in slide-in-from-bottom">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white font-bold text-sm">Trim Video ({Math.round(trim.end - trim.start)}s)</span>
                        <button onClick={() => setActiveTool('none')} className="p-1 bg-white/10 rounded-full"><Check size={20} className="text-green-400" /></button>
                    </div>

                    <div className="relative h-12 bg-gray-800 rounded-lg overflow-hidden mb-2">
                        {/* Fake waveform */}
                         <div className="absolute inset-0 flex items-end gap-[1px] opacity-30 px-2">
                             {[...Array(50)].map((_, i) => (
                                 <div key={i} style={{ height: `${20 + Math.random() * 80}%` }} className="flex-1 bg-white rounded-t-sm" />
                             ))}
                         </div>

                         {/* Sliders - Simplified as two HTML ranges for now */}
                         <input
                            type="range"
                            min={0}
                            max={duration}
                            step={0.1}
                            value={trim.start}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (val < trim.end - 1) setTrim(prev => ({ ...prev, start: val }));
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                         />
                          <input
                            type="range"
                            min={0}
                            max={duration}
                            step={0.1}
                            value={trim.end}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (val > trim.start + 1) setTrim(prev => ({ ...prev, end: val }));
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                         />

                         {/* Visual Handles */}
                         <div className="absolute top-0 bottom-0 bg-primary/30 pointer-events-none" style={{ left: `${(trim.start / duration) * 100}%`, width: `${((trim.end - trim.start) / duration) * 100}%` }}>
                             <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary flex items-center justify-center"><div className="w-[1px] h-4 bg-white" /></div>
                             <div className="absolute right-0 top-0 bottom-0 w-2 bg-primary flex items-center justify-center"><div className="w-[1px] h-4 bg-white" /></div>
                         </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                        <span>{trim.start.toFixed(1)}s</span>
                        <span>{trim.end.toFixed(1)}s</span>
                    </div>
                </div>
            )}

            {/* Selected Overlay Controls (Same as before) */}
            {selectedOverlay && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50 flex flex-col gap-4 animate-in slide-in-from-bottom pb-safe">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                        <span>Edit {selectedOverlay.type}</span>
                        <button onClick={() => setSelectedOverlayId(null)} className="text-white bg-gray-800 px-3 py-1 rounded-full">Done</button>
                    </div>

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
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={selectedOverlay.y}
                                    onChange={(e) => updateOverlay(selectedOverlay.id, { y: parseFloat(e.target.value) })}
                                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
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

            {/* Text Input Modal */}
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
                        <button onClick={addText} className="flex-1 py-3 bg-primary rounded-full text-white font-bold shadow-lg shadow-primary/30">Done</button>
                    </div>
                </div>
            )}

            {/* Sticker Modal */}
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
