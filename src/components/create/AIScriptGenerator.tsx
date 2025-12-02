"use client";

import { useState } from "react";
import { Wand2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AIScriptGeneratorProps {
    onSelectScript: (script: string) => void;
}

export function AIScriptGenerator({ onSelectScript }: AIScriptGeneratorProps) {
    const [topic, setTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedScript, setGeneratedScript] = useState("");

    const handleGenerate = () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            const scripts = [
                `Title: The Future of ${topic}\n\n[Intro] (0:00-0:05)\nHey guys! Did you know that ${topic} is changing everything?\n\n[Body] (0:05-0:45)\nHere are 3 reasons why:\n1. It's decentralized.\n2. It's fast.\n3. It's community driven.\n\n[Outro]\nHit like if you agree!`,
                `Title: ${topic} Explained\n\n[Hook]\nStop scrolling! You need to hear this about ${topic}.\n\n[Value]\nEveryone is talking about it, but few understand that...\n\n[Call to Action]\nFollow for more daily tips!`
            ];
            setGeneratedScript(scripts[Math.floor(Math.random() * scripts.length)]);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="space-y-4 p-4">
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Wand2 className="text-purple-400" /> AI Script Writer
                </h3>
                <p className="text-purple-200 text-sm mb-4">Enter a topic and let AI write a viral script for you.</p>

                <div className="flex gap-2">
                    <input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Pi Network KYC, Web3 Gaming..."
                        className="flex-1 bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6"
                    >
                        {isGenerating ? "Thinking..." : "Generate"}
                    </Button>
                </div>
            </div>

            {generatedScript && (
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Generated Script</span>
                        <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(generatedScript); toast.success("Copied!"); }}>
                            <Copy size={14} />
                        </Button>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                        {generatedScript}
                    </div>
                    <Button
                        onClick={() => onSelectScript(generatedScript)}
                        className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold"
                    >
                        Use This Script <Check size={16} className="ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );
}
