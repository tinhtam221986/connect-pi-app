"use client";

import { useState } from "react";
import { Sparkles, Wand2, Radio, Camera } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CameraRecorder } from "./CameraRecorder";
import { VideoEditor } from "./VideoEditor";
import { AIScriptGenerator } from "./AIScriptGenerator";
import { apiClient } from "@/lib/api-client";

export function AIContentStudio() {
    const { t } = useLanguage();
    const [mode, setMode] = useState<'script' | 'record' | 'live'>('script');
    const [script, setScript] = useState("");
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [creationStep, setCreationStep] = useState<'generate' | 'camera' | 'edit'>('generate');

    const handleUpload = async (blob: Blob) => {
        try {
            toast.info("Uploading video...");
            const uploadRes = await apiClient.video.upload(blob);

            if (uploadRes.success) {
                toast.success("Video uploaded! Creating post...");
                await apiClient.feed.create({
                    description: script || "Check out my new AI video! 🚀 #PiNetwork",
                    videoUrl: uploadRes.url,
                    language: 'en'
                });
                toast.success("Posted successfully!");
            }
        } catch (e: any) {
            toast.error("Upload failed: " + e.message);
        }
        setRecordedBlob(null);
        setCreationStep('generate');
        setMode('script');
    };

    return (
        <div className="h-full bg-black text-white flex flex-col">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
                 <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center gap-2">
                     <Sparkles size={20} className="text-purple-400" /> {t('studio.title')}
                 </h2>
             </div>

             {creationStep === 'generate' && mode !== 'live' && (
                 <div className="flex p-2 gap-2 bg-gray-900 justify-center shrink-0">
                     <button onClick={() => setMode('script')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'script' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                         <Wand2 size={16} /> {t('studio.magic_script')}
                     </button>
                     <button onClick={() => { setMode('record'); setCreationStep('camera'); }} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'record' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                         <Camera size={16} /> {t('studio.record')}
                     </button>
                     <button onClick={() => setMode('live')} className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors text-gray-400 hover:bg-gray-800">
                         <Radio size={16} /> {t('studio.start_live')}
                     </button>
                 </div>
             )}

             {mode === 'live' && (
                 <div className="flex p-2 gap-2 bg-gray-900 justify-center shrink-0">
                     <button onClick={() => setMode('script')} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:bg-gray-800">
                         &larr; Back
                     </button>
                 </div>
             )}

             <div className="flex-1 overflow-hidden relative">
                 <AnimatePresence mode="wait">

                     {mode === 'script' && creationStep === 'generate' && (
                         <motion.div key="script-gen" className="h-full overflow-y-auto" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <AIScriptGenerator onSelectScript={(s) => { setScript(s); setCreationStep('camera'); }} />

                            <div className="p-4">
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                    <h4 className="font-bold text-sm text-gray-400 mb-2">{t('studio.tips')}</h4>
                                    <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                                        <li>Keep videos under 60 seconds for better reach.</li>
                                        <li>Use trending hashtags.</li>
                                        <li>Engage with your audience in the first 3 seconds.</li>
                                    </ul>
                                </div>
                            </div>
                         </motion.div>
                     )}

                     {(creationStep === 'camera') && (
                         <motion.div key="camera" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <CameraRecorder
                                script={script}
                                onCapture={(blob) => { setRecordedBlob(blob); setCreationStep('edit'); }}
                                onClose={() => { setCreationStep('generate'); setMode('script'); }}
                            />
                         </motion.div>
                     )}

                     {(creationStep === 'edit' && recordedBlob) && (
                         <motion.div key="editor" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <VideoEditor
                                videoBlob={recordedBlob}
                                onCancel={() => setCreationStep('camera')}
                                onSave={handleUpload}
                            />
                         </motion.div>
                     )}

                     {mode === 'live' && (
                         <motion.div
                            key="live"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center pb-20 overflow-y-auto p-4"
                         >
                             <div className="w-32 h-32 rounded-full bg-blue-900/20 flex items-center justify-center mb-6 animate-blob relative">
                                 <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                                 <Radio size={64} className="text-blue-500 relative z-10" />
                             </div>
                             <h3 className="text-3xl font-bold mb-2">Ready to Go Live?</h3>
                             <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">Interact with your fans in real-time, host battles, and earn Pi Gifts directly.</p>

                             <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-xs">
                                 <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                                     <span className="text-xs text-gray-500 uppercase font-bold">Followers</span>
                                     <p className="text-xl font-bold text-white">1.2k</p>
                                 </div>
                                 <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                                     <span className="text-xs text-gray-500 uppercase font-bold">Pi Gifts</span>
                                     <p className="text-xl font-bold text-yellow-500">Enabled</p>
                                 </div>
                             </div>

                             <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full font-bold text-white shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                                 <Radio size={20} /> Start Live Stream
                             </button>
                         </motion.div>
                     )}
                 </AnimatePresence>
             </div>
        </div>
    )
}
