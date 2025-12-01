"use client";

import { useState, useEffect } from "react";
import { X, Heart, Gift, Send, Users } from "lucide-react";
import { useEconomy } from "@/components/economy/economy-provider";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function LiveStreamView({ onClose }: { onClose: () => void }) {
    const { spend } = useEconomy();
    const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
    const [input, setInput] = useState("");
    const [viewers, setViewers] = useState(1240);

    // Mock incoming messages
    useEffect(() => {
        const timer = setInterval(() => {
            const users = ["fan123", "pi_lover", "crypto_dude", "alice", "bob"];
            const texts = ["Hello!", "Cool stream", "Sent a gift! 🎁", "Pi to the moon", "🔥"];
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            setMessages(prev => [...prev.slice(-10), {user: randomUser, text: randomText}]);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const handleSend = () => {
        if (!input) return;
        setMessages(prev => [...prev, {user: "Me", text: input}]);
        setInput("");
    };

    const handleGift = () => {
        if(spend(5, "Live Stream Boost")) {
            toast.success("Sent Super Gift! 🚀");
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in slide-in-from-bottom duration-500">
            {/* Video Placeholder */}
            <div className="flex-1 bg-gray-900 relative overflow-hidden">
                 <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full z-10">
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                     <span className="text-white text-xs font-bold">LIVE</span>
                     <span className="text-white text-xs ml-2 flex items-center gap-1"><Users size={12}/> {viewers}</span>
                 </div>
                 <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white z-10 hover:bg-black/70">
                     <X size={20} />
                 </button>

                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     {/* Animated Background */}
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 animate-pulse"></div>
                     <h1 className="text-4xl font-bold text-white/10">CAMERA FEED</h1>
                 </div>
            </div>

            {/* Chat & Controls */}
            <div className="h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-0 w-full flex flex-col justify-end p-4 pb-8">
                 <div className="flex-1 overflow-y-auto space-y-2 mask-image-linear-to-t pb-4 scrollbar-none">
                     {messages.map((m, i) => (
                         <div key={i} className="text-sm text-white drop-shadow-md animate-in slide-in-from-left-2 fade-in">
                             <span className="font-bold text-gray-400">{m.user}: </span>
                             <span>{m.text}</span>
                         </div>
                     ))}
                 </div>

                 <div className="flex items-center gap-3 mt-2">
                     <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-white border border-white/20 focus:outline-none focus:border-pink-500 text-sm backdrop-blur-md"
                        placeholder="Say something..."
                     />
                     <button className="p-2.5 bg-pink-600 rounded-full text-white hover:bg-pink-500 active:scale-95 transition-all shadow-lg shadow-pink-500/30" onClick={handleGift}>
                         <Gift size={20} />
                     </button>
                     <button className="p-2.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-500/30" onClick={handleSend}>
                         <Send size={20} />
                     </button>
                 </div>
            </div>
        </div>
    )
}
