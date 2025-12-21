"use client";
import React from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreationModalProps {
    onClose: () => void;
}

export function CreationModal({ onClose }: CreationModalProps) {
    const router = useRouter();

    const handleOption = (type: 'camera' | 'upload') => {
        onClose();
        // Navigate to /upload with query param or state to pre-select tab
        // For now, simpler to just go to /upload, which we will revamp.
        router.push(`/upload?mode=${type}`);
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#111] border-t border-white/10 rounded-t-3xl p-6 pb-10 flex flex-col gap-6 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Create New</h3>
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleOption('camera')}
                        className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 rounded-2xl hover:bg-white/5 transition-all active:scale-95"
                    >
                        <div className="p-4 bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white font-medium">Camera</span>
                    </button>

                    <button
                        onClick={() => handleOption('upload')}
                        className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl hover:bg-white/5 transition-all active:scale-95"
                    >
                         <div className="p-4 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white font-medium">Upload</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
