"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, X, Send } from "lucide-react";
import { AI_RESPONSES } from "@/lib/mock-data";
import { useLanguage } from "@/components/i18n/language-provider";
import { motion, AnimatePresence } from "framer-motion";

export function AIAssistant() {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
    const [input, setInput] = useState("");
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
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, {role: 'user', text: input}]);
        setInput("");
        
        // Mock Response
        setTimeout(() => {
            // @ts-ignore
            const responses = AI_RESPONSES[language] || AI_RESPONSES['vi'];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, {role: 'ai', text: randomResponse}]);
        }, 1000);
    }

    return (
        <>
            {/* Floating Trigger (Draggable) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragMomentum={false}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-40 cursor-grab active:cursor-grabbing"
                    >
                        <Bot size={28} className="text-white" />

                        {/* Status Dot */}
                        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window (Draggable) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        drag
                        dragMomentum={false}
                        className="fixed bottom-24 right-4 w-80 sm:w-96 h-[30rem] bg-gray-900/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header - Drag Handle */}
                        <div className="p-4 bg-gradient-to-r from-gray-900 to-cyan-950/30 flex justify-between items-center border-b border-cyan-500/20 cursor-grab active:cursor-grabbing">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30">
                                    <Bot size={18} className="text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">{t('ai.title')}</h4>
                                    <p className="text-[10px] text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-700 rounded-full transition-colors">
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-600">
                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        m.role === 'user'
                                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 self-end text-white rounded-tr-none'
                                        : 'bg-gray-800 border border-gray-700 self-start text-gray-200 rounded-tl-none'
                                    }`}
                                >
                                    {m.text}
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2 items-center">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 text-white transition-all placeholder:text-gray-500"
                                    placeholder={t('ai.placeholder')}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="p-3 bg-cyan-600 rounded-full hover:bg-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-900/20"
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
