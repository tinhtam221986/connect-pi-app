"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, X, Send } from "lucide-react";
import { AI_RESPONSES } from "@/lib/mock-data";
import { useLanguage } from "@/components/i18n/language-provider";

export function AIAssistant() {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Reset/Init chat when language changes
    useEffect(() => {
        setMessages([{role: 'ai', text: t('ai.intro')}]);
    }, [language, t]); // Add t to dependency

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
            {/* Floating Trigger */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-40 hover:scale-110 transition-transform"
                >
                    <Bot size={24} className="text-white" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-4 w-80 h-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
                    {/* Header */}
                    <div className="p-3 bg-gray-800 flex justify-between items-center border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <Bot size={20} className="text-cyan-400" />
                            <span className="font-bold text-sm">{t('ai.title')}</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-600">
                        {messages.map((m, i) => (
                            <div key={i} className={`max-w-[85%] p-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 self-end text-white rounded-tr-none' : 'bg-gray-700 self-start text-gray-200 rounded-tl-none'}`}>
                                {m.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-gray-900 border border-gray-600 rounded-full px-3 text-sm focus:outline-none focus:border-cyan-500 text-white"
                            placeholder={t('ai.placeholder')}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 text-white">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
