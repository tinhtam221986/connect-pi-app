"use client";

import { useState } from "react";
import { useEconomy } from "@/components/economy/EconomyContext";
import { Dna, TestTube, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function GeneLab({ onClose }: { onClose: () => void }) {
    const { inventory, useItem, addItem } = useEconomy();
    const [incubating, setIncubating] = useState(false);

    // Filter materials
    const materials = inventory.filter(i => i.type === 'material');

    const handleCreate = (materialId: string) => {
        if (useItem(materialId)) {
            setIncubating(true);
            setTimeout(() => {
                setIncubating(false);
                const pet = {
                    id: `pet_${Date.now()}`,
                    name: "Pi Pet #" + Math.floor(Math.random()*1000),
                    type: "digital",
                    image: "🐉",
                    quantity: 1
                };
                addItem(pet as any, 1);
                toast.success("Gene Synthesis Complete! New Pet created.");
            }, 3000);
        } else {
            toast.error("Not enough material!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-purple-500/30 overflow-hidden flex flex-col h-[80vh]">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0">
                    <h3 className="font-bold text-xl flex items-center gap-2 text-purple-400">
                        <Dna size={24} /> Gene Lab
                    </h3>
                    <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full border-4 border-purple-500/20 bg-black/50 flex items-center justify-center mb-8 relative">
                        {incubating ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles size={64} className="text-purple-500" />
                            </motion.div>
                        ) : (
                            <TestTube size={64} className="text-gray-600" />
                        )}

                        {incubating && (
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        )}
                    </div>

                    <h4 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider">Available Materials</h4>

                    <div className="grid grid-cols-3 gap-3 w-full">
                        {materials.map(item => (
                            <button
                                key={item.id}
                                onClick={() => !incubating && handleCreate(item.id)}
                                disabled={incubating}
                                className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex flex-col items-center hover:border-purple-500 transition-colors disabled:opacity-50"
                            >
                                <span className="text-2xl mb-2">{item.image}</span>
                                <span className="text-xs font-bold text-center leading-tight">{item.name}</span>
                                <span className="mt-1 text-xs text-purple-400 font-mono">x{item.quantity}</span>
                            </button>
                        ))}
                    </div>

                    {materials.length === 0 && (
                        <p className="text-gray-500 text-sm mt-4">No DNA materials found. Buy some in the Shop!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
