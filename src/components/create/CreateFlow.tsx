"use client";

import { useState } from "react";
import { Camera, Upload, Sparkles, ArrowLeft, FileBox } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { CameraRecorder } from "./CameraRecorder";
import { MediaUploader } from "./MediaUploader";
import { VideoEditor, EditorState } from "./VideoEditor";
import { PostSettings } from "./PostSettings";
import { motion, AnimatePresence } from "framer-motion";
import { saveDraft } from "@/lib/drafts";
import { toast } from "sonner";

export type CreateStage = 'SELECTION' | 'RECORD' | 'UPLOAD' | 'EDIT' | 'POST';

export interface CreateContextState {
    file: File | null;
    previewUrl: string | null;
    type: 'video' | 'image';
    duration?: number;
    editorState?: EditorState;
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
        if (stage === 'EDIT') {
             if (confirm("Discard changes?")) {
                 setStage('SELECTION');
                 setMedia(null);
             }
        }
        else if (stage === 'POST') setStage('EDIT');
        else setStage('SELECTION');
    };

    return (
        <div className="h-full bg-black text-white flex flex-col relative overflow-hidden">

            {/* Navigation Header */}
            {stage !== 'SELECTION' && (
                <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                    <button onClick={handleBack} className="pointer-events-auto p-2 bg-black/40 backdrop-blur rounded-full hover:bg-black/60 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <span className="font-bold text-sm uppercase tracking-wider shadow-black drop-shadow-md">{stage}</span>
                    <div className="w-8"></div>
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
                            onClick={() => toast.info("Drafts loaded from Local Storage")}
                            className="w-full py-4 bg-transparent border border-gray-800/50 rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-900 transition-colors group"
                        >
                            <FileBox size={20} className="text-gray-500 group-hover:text-white" />
                            <span className="text-gray-500 group-hover:text-white font-medium">Drafts</span>
                        </button>
                    </motion.div>
                )}

                {stage === 'RECORD' && (
                    <div className="h-full pt-0">
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

                {stage === 'EDIT' && media && (
                    <VideoEditor
                        media={media}
                        onNext={(editorState) => {
                            setMedia({ ...media, editorState });
                            setStage('POST');
                        }}
                        onSaveDraft={async (state) => {
                             if (!media.file) return;
                             try {
                                 await saveDraft({
                                     id: Date.now().toString(),
                                     videoFile: media.file,
                                     metadata: {
                                         caption: "",
                                         trimStart: state.trim.start,
                                         trimEnd: state.trim.end,
                                         music: state.music,
                                         effects: state.overlays.map(o => o.content)
                                     },
                                     createdAt: Date.now()
                                 });
                                 toast.success("Saved to Drafts (Local)");
                             } catch (e) {
                                 console.error(e);
                                 toast.error("Failed to save draft");
                             }
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
