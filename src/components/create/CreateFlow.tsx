"use client";

import { useState } from "react";
import { Camera, Upload, Sparkles, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { CameraRecorder } from "./CameraRecorder";
import { MediaUploader } from "./MediaUploader";
import { AIContentStudio } from "./AIContentStudio"; // We'll wrap the old one for "Magic" mode
import { VideoEditor } from "./VideoEditor"; // To be created
import { PostSettings } from "./PostSettings"; // To be created
import { motion, AnimatePresence } from "framer-motion";

export type CreateStage = 'SELECTION' | 'RECORD' | 'UPLOAD' | 'AI_SCRIPT' | 'EDIT' | 'POST';

export interface CreateContextState {
    file: File | null;
    previewUrl: string | null;
    type: 'video' | 'image';
    duration?: number;
}

export function CreateFlow() {
    const { t } = useLanguage();
    const [stage, setStage] = useState<CreateStage>('SELECTION');
    const [media, setMedia] = useState<CreateContextState | null>(null);

    const handleMediaCaptured = (file: File, url: string, type: 'video'|'image') => {
        setMedia({ file, previewUrl: url, type });
        setStage('EDIT');
    };

    const handleBack = () => {
        if (stage === 'EDIT') setStage('SELECTION'); // Or confirm discard
        else if (stage === 'POST') setStage('EDIT');
        else setStage('SELECTION');
    };

    return (
        <div className="h-full bg-black text-white flex flex-col relative overflow-hidden">

            {/* Navigation Header (except on SELECTION which has its own header) */}
            {stage !== 'SELECTION' && (
                <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
                    <button onClick={handleBack} className="p-2 bg-black/40 backdrop-blur rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <span className="font-bold text-sm uppercase tracking-wider">{stage}</span>
                    <div className="w-8"></div> {/* Spacer */}
                </div>
            )}

            <AnimatePresence mode="wait">
                {stage === 'SELECTION' && (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col justify-end pb-24 px-6 gap-4"
                    >
                        <h2 className="text-3xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Create Content
                        </h2>

                        <button
                            onClick={() => setStage('RECORD')}
                            className="w-full py-6 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-800 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Camera size={24} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg">Camera</h3>
                                <p className="text-xs text-gray-400">Record directly in-app</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setStage('UPLOAD')}
                            className="w-full py-6 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-800 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Upload size={24} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg">Upload</h3>
                                <p className="text-xs text-gray-400">From Device Gallery</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setStage('AI_SCRIPT')}
                            className="w-full py-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl flex items-center justify-center gap-4 hover:bg-purple-900/50 transition-colors group"
                        >
                             <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-pulse-slow">
                                <Sparkles size={24} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg">AI Studio</h3>
                                <p className="text-xs text-purple-200">Generate scripts & ideas</p>
                            </div>
                        </button>
                    </motion.div>
                )}

                {stage === 'RECORD' && (
                    <div className="h-full pt-16">
                        <CameraRecorder
                            onVideoRecorded={(blob) => {
                                const file = new File([blob], `rec_${Date.now()}.webm`, { type: 'video/webm' });
                                const url = URL.createObjectURL(blob);
                                handleMediaCaptured(file, url, 'video');
                            }}
                        />
                    </div>
                )}

                {stage === 'UPLOAD' && (
                     <div className="h-full pt-20 flex items-center justify-center">
                        <MediaUploader
                            onMediaSelect={handleMediaCaptured}
                        />
                     </div>
                )}

                {stage === 'AI_SCRIPT' && (
                    <div className="h-full pt-16">
                        {/* We reuse the old component but maybe need to tweak it to callback instead of upload directly?
                            For now, let's let it run its own flow or wrap it.
                            The old AIContentStudio handles upload internally.
                            We might want to intercept it.
                            For MVP, we just render it. It has its own header.
                         */}
                         <AIContentStudio />
                    </div>
                )}

                {stage === 'EDIT' && media && (
                    <VideoEditor
                        media={media}
                        onNext={(editedMedia) => {
                            // editedMedia might be a new blob if filters applied
                            // For MVP pass through
                            setStage('POST');
                        }}
                    />
                )}

                {stage === 'POST' && media && (
                    <PostSettings
                        media={media}
                        onPostComplete={() => {
                            setStage('SELECTION');
                            setMedia(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
