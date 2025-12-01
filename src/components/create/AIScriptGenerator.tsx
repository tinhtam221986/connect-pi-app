"use client";

import { useState } from "react";
import { Copy, Loader2, Sparkles, Wand2, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AIScriptGeneratorProps {
    onClose: () => void;
    onApplyScript: (script: string) => void;
}

export function AIScriptGenerator({ onClose, onApplyScript }: AIScriptGeneratorProps) {
    const [topic, setTopic] = useState("");
    const [vibe, setVibe] = useState("funny");
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState("");

    const handleGenerate = () => {
        if (!topic) return;
        setGenerating(true);

        // Mock Generation
        setTimeout(() => {
            const mockScript = `[TITLE]: ${topic} (${vibe})

[SCENE 1]
(Camera starts close up on face)
User: "You won't believe what I just found out about ${topic}!"

[SCENE 2]
(Cut to b-roll or pointing at text overlay)
User: "It actually changes everything we know..."

[SCENE 3]
(Dance or excited gesture)
User: "Try it yourself and tag me!"`;

            setResult(mockScript);
            setGenerating(false);
        }, 1500);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-6 animate-in fade-in slide-in-from-bottom-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles size={24} />
                    <h2 className="text-xl font-bold text-white">AI Script Wizard</h2>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-white">
                    <X size={20} />
                </button>
            </div>

            {/* Input Section */}
            {!result ? (
                <div className="flex-1 flex flex-col gap-6">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">What's your video about?</label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. How to make coffee, My day at the beach..."
                            className="w-full bg-gray-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Choose a vibe</label>
                        <div className="flex gap-2">
                            {['Funny', 'Educational', 'Viral', 'Dramatic'].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setVibe(v.toLowerCase())}
                                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                                        vibe === v.toLowerCase()
                                        ? "bg-purple-600 border-purple-600 text-white"
                                        : "border-gray-600 text-gray-400 hover:border-gray-400"
                                    }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!topic || generating}
                        className="mt-auto w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {generating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        {generating ? "Dreaming up ideas..." : "Generate Script"}
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto bg-gray-800/50 rounded-xl p-4 border border-white/10 mb-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                        {result}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setResult("")}
                            className="flex-1 py-3 bg-gray-800 rounded-xl font-bold text-gray-300"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => {
                                onApplyScript(result);
                                onClose();
                                toast.success("Script loaded to Teleprompter!");
                            }}
                            className="flex-[2] py-3 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <Copy size={18} /> Use this Script
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
