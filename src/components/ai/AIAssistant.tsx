"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Mic, Sparkles, Volume2, TrendingUp, Users, Globe, ExternalLink, ArrowUpRight, Image as ImageIcon, Camera } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import { parseCommand } from "./AICommandSystem";
import { toast } from "sonner";

export function AIAssistant({ onNavigate, currentTab }: { onNavigate?: (tab: string) => void, currentTab?: string }) {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user'|'ai', text: string, type?: string, payload?: any}[]>([]);
    const [input, setInput] = useState("");
    const [isVoice, setIsVoice] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Reset/Init chat when language changes
    useEffect(() => {
        setMessages([{role: 'ai', text: t('ai.intro')}]);
    }, [language, t]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, {role: 'user', text: input}]);
        const userInput = input;
        setInput("");
        setIsThinking(true);

        // Process Intent
        const { response, action } = parseCommand(userInput, currentTab);
        
        setTimeout(() => {
            setIsThinking(false);

            // Text to Speech
            if (isVoice && typeof window !== 'undefined' && window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(response);
                utterance.rate = 1.1;
                utterance.pitch = 1.0;
                window.speechSynthesis.speak(utterance);
            }

            if (action.type === 'SHOW_USERS') {
                setMessages(prev => [...prev, {role: 'ai', text: response, type: 'users', payload: action.payload}]);
            } else if (action.type === 'SHOW_TRENDS') {
                setMessages(prev => [...prev, {role: 'ai', text: response, type: 'trends', payload: action.payload}]);
            } else if (action.type === 'SHOW_WEB_RESULTS') {
                setMessages(prev => [...prev, {role: 'ai', text: response, type: 'web', payload: action.payload}]);
            } else if (action.type === 'SHOW_CRYPTO_DATA') {
                setMessages(prev => [...prev, {role: 'ai', text: response, type: 'crypto', payload: action.payload}]);
            } else if (action.type === 'SHOW_GENERATED_IMAGE') {
                setMessages(prev => [...prev, {role: 'ai', text: response, type: 'image', payload: action.payload}]);
            } else {
                setMessages(prev => [...prev, {role: 'ai', text: response}]);
            }

            if (action.type === 'NAVIGATE' && onNavigate) {
                toast.info(`AI: Navigating to ${action.payload}...`);
                setTimeout(() => {
                    onNavigate(action.payload);
                }, 1000);
            } else if (action.type === 'TOAST') {
                toast.success(action.payload);
            }
        }, 1500);
    }

    const toggleVoice = () => {
        setIsVoice(!isVoice);
        if (!isVoice) {
            toast.info("Voice Mode Activated (TTS Enabled)");
        } else {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        }
    }

    const handleImageUpload = () => {
        toast.info("AI Vision: Analyzing uploaded image... (Simulated)");
        setTimeout(() => {
            setMessages(prev => [...prev, {role: 'ai', text: "I see a futuristic cityscape with neon lights. Is this for your next video?"}]);
        }, 2000);
    }

    const renderMessageContent = (m: any) => {
        if (m.type === 'users') {
            return (
                <div className="flex flex-col gap-2 w-full">
                    <p>{m.text}</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none w-full">
                        {m.payload.map((u: any) => (
                            <div key={u.id} className="bg-gray-800/80 p-3 rounded-xl min-w-[120px] flex flex-col items-center border border-cyan-500/30 backdrop-blur-md hover:bg-gray-700 transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-2 shadow-lg" />
                                <span className="font-bold text-xs text-white truncate w-full text-center">@{u.username}</span>
                                <span className="text-[10px] text-cyan-400 mb-2">{u.role}</span>
                                <button className="bg-cyan-600 hover:bg-cyan-500 text-[10px] px-3 py-1 rounded-full text-white w-full transition-colors font-bold flex items-center justify-center gap-1">
                                    <Users size={10} /> Connect
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
        if (m.type === 'trends') {
            return (
                <div className="flex flex-col gap-2 w-full">
                    <p>{m.text}</p>
                    <div className="grid grid-cols-1 gap-2 mt-1">
                        {m.payload.map((t: any) => (
                            <div key={t.id} className="bg-gray-800/50 p-2 rounded-lg border border-pink-500/20 flex justify-between items-center hover:bg-gray-800 cursor-pointer transition-colors">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-pink-500" />
                                    <span className="font-bold text-xs text-white">{t.title}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 bg-black/30 px-2 py-0.5 rounded-full">{t.views}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
        if (m.type === 'web') {
            return (
                <div className="flex flex-col gap-2 w-full">
                    <p>{m.text}</p>
                    <div className="flex flex-col gap-2 mt-1">
                        {m.payload.map((res: any, idx: number) => (
                            <div key={idx} className="bg-gray-800/60 p-3 rounded-xl border border-blue-500/20 hover:bg-gray-800 transition-colors cursor-pointer group">
                                <h4 className="text-blue-400 font-bold text-xs flex items-center gap-1 group-hover:underline">
                                    <Globe size={12} /> {res.title} <ExternalLink size={10} className="opacity-50" />
                                </h4>
                                <p className="text-[10px] text-gray-300 mt-1 line-clamp-2">{res.snippet}</p>
                                <span className="text-[9px] text-gray-500 mt-1 block font-mono">{res.url}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
        if (m.type === 'crypto') {
            const data = m.payload;
            return (
                <div className="flex flex-col gap-2 w-full">
                    <p>{m.text}</p>
                    <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-green-500/30 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-20">
                            <TrendingUp size={48} className="text-green-500" />
                        </div>
                        <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider">{data.symbol} / USD</h3>
                        <div className="flex items-end gap-2 mt-1">
                            <span className="text-3xl font-bold text-white">${data.price}</span>
                            <span className="text-green-400 text-xs font-bold mb-1 flex items-center">
                                <ArrowUpRight size={12} /> {data.change}
                            </span>
                        </div>
                        <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-2/3 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )
        }
        if (m.type === 'image') {
            return (
                <div className="flex flex-col gap-2 w-full">
                    <p>{m.text}</p>
                    <div className="rounded-xl overflow-hidden border border-purple-500/30 shadow-lg relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.payload.url} alt={m.payload.prompt} className="w-full h-auto object-cover min-h-[200px] bg-gray-900" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur">Generated: {m.payload.prompt}</span>
                        </div>
                    </div>
                </div>
            )
        }
        return m.text;
    }

    return (
        <>
            {/* Holographic Trigger (Draggable) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragMomentum={false}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-24 right-4 w-16 h-16 rounded-full flex items-center justify-center z-40 cursor-grab active:cursor-grabbing group"
                    >
                         {/* Holographic Orb Effect */}
                         <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-md animate-pulse"></div>
                         <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 opacity-80 border border-white/30 backdrop-blur-sm"></div>

                         <Bot size={32} className="text-white relative z-10 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />

                         {/* Orbiting particles */}
                         <div className="absolute inset-0 rounded-full border border-cyan-400/30 w-full h-full animate-[spin_4s_linear_infinite]"></div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        drag
                        dragMomentum={false}
                        className="fixed bottom-24 right-4 w-80 sm:w-96 h-[32rem] bg-gray-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 flex justify-between items-center border-b border-white/10 cursor-grab active:cursor-grabbing">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                     <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                                         <Bot size={20} className="text-cyan-300" />
                                     </div>
                                     <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white tracking-wide">CONNECT SUPER AI</h4>
                                    <p className="text-[10px] text-cyan-400 font-mono">WEB3 ONLINE</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setMessages([])} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-400" title="Clear Chat">
                                    <Sparkles size={16} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors text-gray-400">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-cyan-900/50">
                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`max-w-[90%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-md ${
                                        m.role === 'user'
                                        ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 self-end text-white rounded-tr-none border border-white/20'
                                        : 'bg-white/5 border border-white/10 self-start text-cyan-50 rounded-tl-none shadow-[0_0_10px_rgba(0,255,255,0.05)] w-full'
                                    }`}
                                >
                                    {renderMessageContent(m)}
                                </motion.div>
                            ))}
                            {isThinking && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white/5 border border-white/10 self-start text-cyan-400 rounded-2xl rounded-tl-none p-3 max-w-[85%]"
                                >
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                    <p className="text-[10px] mt-1 opacity-70">Computing in Neural Cloud...</p>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Voice Viz (Mock) */}
                        {isVoice && (
                            <div className="h-12 flex items-center justify-center gap-1 bg-black/50 border-t border-cyan-500/20">
                                {[1,2,3,4,5,4,3,2,1,2,3,4].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [5, h*6, 5] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                        className="w-1 bg-cyan-400 rounded-full opacity-80"
                                    />
                                ))}
                                <span className="text-[10px] text-cyan-500 ml-4 font-mono animate-pulse">LISTENING MODE</span>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2 items-center relative z-20">
                            <button
                                onClick={handleImageUpload}
                                className="p-2.5 rounded-full bg-white/5 hover:bg-white/20 transition-all border border-white/10 text-gray-400 hover:text-white"
                                title="Upload Image for AI Analysis"
                            >
                                <Camera size={18} />
                            </button>

                            <button
                                onClick={toggleVoice}
                                className={`p-2.5 rounded-full transition-all border ${isVoice ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-cyan-400'}`}
                            >
                                {isVoice ? <Volume2 size={18} className="animate-pulse" /> : <Mic size={18} />}
                            </button>

                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 text-white transition-all placeholder:text-gray-500"
                                    placeholder={isVoice ? "Say 'Draw a Cat'..." : t('ai.placeholder')}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full hover:scale-105 active:scale-95 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
