"use client";

import { useState } from "react";
import { Sparkles, Video, Mic, Wand2, Play, StopCircle, Upload, Film, Radio, Camera } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function AIContentStudio() {
    const { t } = useLanguage();
    const [mode, setMode] = useState<'script' | 'record' | 'live'>('script');
    const [topic, setTopic] = useState("");
    const [script, setScript] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const generateScript = () => {
        if (!topic) {
            toast.error("Please enter a topic");
            return;
        }
        setIsGenerating(true);
        setTimeout(() => {
            setScript("Title: " + topic + "\n\n[Intro]: Hello everyone! Welcome back to my channel.\n[Scene 1]: Today we are talking about " + topic + " on Pi Network.\n[Outro]: Don't forget to like and subscribe!");
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="h-full bg-black text-white flex flex-col">
             {/* Header */}
             <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
                 <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center gap-2">
                     <Sparkles size={20} className="text-purple-400" /> {t('studio.title')}
                 </h2>
             </div>

             {/* Mode Switcher */}
             <div className="flex p-2 gap-2 bg-gray-900 justify-center shrink-0">
                 <button onClick={() => setMode('script')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'script' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                     <Wand2 size={16} /> {t('studio.magic_script')}
                 </button>
                 <button onClick={() => setMode('record')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'record' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                     <Camera size={16} /> {t('studio.record')}
                 </button>
                 <button onClick={() => setMode('live')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'live' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                     <Radio size={16} /> {t('studio.start_live')}
                 </button>
             </div>

             {/* Content Area */}
             <div className="flex-1 overflow-y-auto p-4 relative">
                 <AnimatePresence mode="wait">
                     {mode === 'script' && (
                         <motion.div
                             key="script"
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: 20 }}
                             className="space-y-4 pb-20"
                         >
                             <div className="bg-gray-900 rounded-xl p-4 border border-purple-500/30">
                                 <label className="text-sm font-bold text-purple-300 mb-2 block">{t('studio.topic_placeholder')}</label>
                                 <div className="flex gap-2">
                                     <input
                                         value={topic}
                                         onChange={(e) => setTopic(e.target.value)}
                                         className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                         placeholder="e.g. Crypto Trends 2024"
                                     />
                                     <button onClick={generateScript} disabled={isGenerating} className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                                         <Wand2 size={24} className={isGenerating ? "animate-spin" : ""} />
                                     </button>
                                 </div>
                             </div>

                             {script && (
                                 <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 animate-in fade-in zoom-in">
                                     <h3 className="font-bold mb-2 text-green-400">{t('studio.script_result')}</h3>
                                     <div className="bg-black/50 p-3 rounded-lg border border-gray-700">
                                         <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">{script}</pre>
                                     </div>
                                     <button onClick={() => setMode('record')} className="w-full mt-4 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">
                                         {t('studio.record')} (Use Script)
                                     </button>
                                 </div>
                             )}

                             <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                 <h4 className="font-bold text-sm text-gray-400 mb-2">{t('studio.tips')}</h4>
                                 <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                                     <li>Keep videos under 60 seconds for better reach.</li>
                                     <li>Use trending hashtags.</li>
                                     <li>Engage with your audience in the first 3 seconds.</li>
                                 </ul>
                             </div>
                         </motion.div>
                     )}

                     {mode === 'record' && (
                         <motion.div
                            key="record"
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="flex flex-col items-center justify-center h-full pb-20"
                         >
                             <div className="w-full max-w-sm aspect-[9/16] bg-gray-800 rounded-2xl relative overflow-hidden flex items-center justify-center border-2 border-gray-700 shadow-2xl">
                                 {/* Camera Preview Mock */}
                                 <div className="text-gray-500 flex flex-col items-center">
                                     <Camera size={48} />
                                     <p className="mt-2 text-sm text-center px-4">{t('create.permission')}</p>
                                 </div>

                                 {/* Overlay Controls */}
                                 <div className="absolute bottom-4 w-full flex justify-center items-center gap-8 z-20">
                                     <button className="p-3 bg-gray-900/50 rounded-full text-white backdrop-blur-md hover:bg-gray-800 transition-colors"><Upload size={24} /></button>
                                     <button
                                        onClick={() => setIsRecording(!isRecording)}
                                        className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all shadow-lg ${isRecording ? 'bg-red-600 scale-110' : 'bg-red-500'}`}
                                     >
                                         {isRecording ? <div className="w-6 h-6 bg-white rounded-sm" /> : <div className="w-14 h-14 bg-red-500 rounded-full" />}
                                     </button>
                                     <button className="p-3 bg-gray-900/50 rounded-full text-white backdrop-blur-md hover:bg-gray-800 transition-colors"><Film size={24} /></button>
                                 </div>

                                 {/* Script Overlay */}
                                 {script && (
                                     <div className="absolute top-4 left-4 right-4 bg-black/60 p-3 rounded-lg text-xs text-white max-h-32 overflow-y-auto backdrop-blur-sm border border-white/10 z-10">
                                         {script}
                                     </div>
                                 )}

                                 {/* Recording Indicator */}
                                 {isRecording && (
                                     <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse z-20">
                                         <div className="w-2 h-2 bg-white rounded-full"></div> REC
                                     </div>
                                 )}
                             </div>
                         </motion.div>
                     )}

                     {mode === 'live' && (
                         <motion.div
                            key="live"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center pb-20"
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
