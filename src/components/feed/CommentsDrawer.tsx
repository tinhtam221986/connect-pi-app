"use client";

import { X, Send, Heart } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

export function CommentsDrawer({ isOpen, onClose, commentsCount }: { isOpen: boolean, onClose: () => void, commentsCount: number }) {
    const [comments, setComments] = useState([
        { id: 1, user: "pi_fan_99", text: "Amazing content! 🔥", likes: 12 },
        { id: 2, user: "crypto_king", text: "To the moon! 🚀", likes: 8 },
        { id: 3, user: "web3_dev", text: "Great quality.", likes: 2 },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setComments(prev => [...prev, { id: Date.now(), user: "you", text: input, likes: 0 }]);
        setInput("");
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="bg-gray-900 border-t border-gray-800 text-white max-h-[70vh] flex flex-col">
                <div className="p-4 h-full flex flex-col">
                    <h3 className="text-center font-bold mb-4 border-b border-gray-800 pb-2">{commentsCount} Comments</h3>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {comments.map(c => (
                            <div key={c.id} className="flex gap-3 animate-in slide-in-from-bottom-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-400">@{c.user}</p>
                                    <p className="text-sm">{c.text}</p>
                                </div>
                                <div className="flex flex-col items-center text-gray-500 hover:text-red-500 cursor-pointer transition-colors">
                                    <Heart size={14} />
                                    <span className="text-[10px]">{c.likes}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-2 pt-2 border-t border-gray-800">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none border border-gray-700 focus:border-blue-500 transition-colors"
                            placeholder="Add a comment..."
                        />
                        <button onClick={handleSend} disabled={!input.trim()} className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 transition-colors">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
