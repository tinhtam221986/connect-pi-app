"use client";

import { useState, useRef } from "react";
import { Play, Pause, Save, Scissors, Type, Sticker, Share2, Download, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoEditorProps {
    videoBlob: Blob;
    onCancel: () => void;
    onSave: (blob: Blob) => void;
}

export function VideoEditor({ videoBlob, onCancel, onSave }: VideoEditorProps) {
    const videoUrl = URL.createObjectURL(videoBlob);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleMockEdit = (tool: string) => {
        toast.info(`${tool} tool selected (Mock)`);
    };

    return (
        <div className="h-full bg-black flex flex-col w-full">
            <div className="relative flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="max-h-full max-w-full object-contain"
                    loop
                    playsInline
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />

                {!isPlaying && (
                    <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                        <Play size={64} className="text-white/80 fill-white/80" />
                    </button>
                )}
            </div>

            <div className="h-48 bg-gray-950 border-t border-gray-800 p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center text-gray-400 text-xs px-2">
                    <span>00:00</span>
                    <div className="h-1 flex-1 mx-4 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-yellow-500 rounded-full"></div>
                    </div>
                    <span>00:15</span>
                </div>

                <div className="flex justify-around items-center">
                    <EditorButton icon={<Scissors />} label="Trim" onClick={() => handleMockEdit("Trim")} />
                    <EditorButton icon={<Type />} label="Text" onClick={() => handleMockEdit("Text")} />
                    <EditorButton icon={<Sticker />} label="Sticker" onClick={() => handleMockEdit("Sticker")} />
                    <EditorButton icon={<Settings />} label="Adjust" onClick={() => handleMockEdit("Adjust")} />
                </div>

                <div className="flex gap-4 mt-auto">
                    <Button variant="outline" className="flex-1 bg-gray-800 border-gray-700 text-white" onClick={onCancel}>
                        Discard
                    </Button>
                    <Button className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400 font-bold" onClick={() => onSave(videoBlob)}>
                        Next <Share2 size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function EditorButton({ icon, label, onClick }: any) {
    return (
        <button onClick={onClick} className="flex flex-col items-center gap-2 text-white hover:text-yellow-400 transition-colors">
            <div className="p-3 bg-gray-900 rounded-full border border-gray-800 hover:border-yellow-500/50">
                {icon}
            </div>
            <span className="text-xs font-medium">{label}</span>
        </button>
    )
}
