"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import { Dna, ShoppingCart, TestTube, Zap, X, FlaskConical, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useEconomy } from "@/components/economy/EconomyContext";
import { usePiPayment } from "@/hooks/use-pi-payment";
import { usePi } from "@/components/pi/pi-provider";

export function GameCenter() {
    const { t } = useLanguage();
    const { user } = usePi();
    const { inventory, refresh, balance } = useEconomy();
    const { createPayment } = usePiPayment();

    const [view, setView] = useState<'lab' | 'market'>('lab');
    const [slots, setSlots] = useState<{ [key: string]: any | null }>({
        embryo: null,
        crystal: null,
        morph: null,
        mutagen: null
    });
    const [breeding, setBreeding] = useState(false);
    const [newPet, setNewPet] = useState<any>(null);

    // Filter inventory for ease of use
    const materials = inventory.filter((i: any) => i.category === 'MATERIAL');
    const pets = inventory.filter((i: any) => i.category === 'PET');

    const handleSlotClick = (type: string, item: any) => {
        setSlots(prev => ({ ...prev, [type]: item }));
    };

    const handleRemoveSlot = (type: string) => {
        setSlots(prev => ({ ...prev, [type]: null }));
    };

    const handleBreed = async () => {
        if (!slots.embryo) {
            toast.error("Base Embryo is required!");
            return;
        }

        setBreeding(true);
        try {
            // Collect IDs
            const materialIds = Object.values(slots)
                .filter(item => item !== null)
                .map(item => item.id);

            const res = await apiClient.game.breed(user?.username || 'user_current', materialIds);

            if (res.success) {
                setNewPet(res.pet);
                setSlots({ embryo: null, crystal: null, morph: null, mutagen: null });
                toast.success("Breeding Successful!");
                await refresh();
            } else {
                toast.error("Breeding Failed: " + res.error);
            }
        } catch (e) {
            console.error(e);
            toast.error("An error occurred during synthesis.");
        } finally {
            setBreeding(false);
        }
    };

    const shopItems = [
        { id: "101", name: "Base Embryo", price: 100, type: "embryo", icon: "🥚" },
        { id: "102", name: "Fire Crystal", price: 50, type: "crystal", icon: "🔥" },
        { id: "103", name: "Water Crystal", price: 50, type: "crystal", icon: "💧" },
        { id: "104", name: "Wings Gene", price: 200, type: "morph", icon: "🕊️" },
        { id: "105", name: "Mutagen X", price: 500, type: "mutagen", icon: "🧪" },
    ];

    const handleBuy = async (item: any) => {
        try {
            await createPayment(
                item.price,
                `Buy ${item.name}`,
                { type: 'marketplace_buy', itemId: item.id, userId: user?.username || 'user_current' },
                {
                    onSuccess: async () => {
                        // toast handled by hook
                        await refresh();
                    }
                }
            );
        } catch (e) {
            console.error("Payment failed", e);
            // toast handled by hook
        }
    };

    return (
        <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-20 relative">
             {/* Header */}
             <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
                 <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex items-center gap-2">
                     <Dna size={24} className="text-blue-500" /> Pi Gene Lab
                 </h2>
                 <div className="flex gap-2">
                     <button
                        onClick={() => setView('lab')}
                        className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${view === 'lab' ? 'bg-blue-600' : 'bg-gray-800'}`}
                     >
                        <FlaskConical size={14} /> Lab
                     </button>
                     <button
                        onClick={() => setView('market')}
                        className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${view === 'market' ? 'bg-green-600' : 'bg-gray-800'}`}
                     >
                        <ShoppingCart size={14} /> Shop
                     </button>
                 </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 relative">
                {view === 'lab' ? (
                    <div className="flex flex-col items-center gap-8 mt-4">
                        {/* Synthesis Circle */}
                        <div className="relative w-64 h-64">
                             {/* Central Result / Button */}
                             <div className="absolute inset-0 flex items-center justify-center z-10">
                                 <motion.button
                                     whileHover={{ scale: 1.05 }}
                                     whileTap={{ scale: 0.95 }}
                                     onClick={handleBreed}
                                     disabled={breeding}
                                     className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-purple-500/30 flex flex-col items-center justify-center border-4 border-blue-300 z-20"
                                 >
                                     {breeding ? <Sparkles className="animate-spin" size={32} /> : <Dna size={40} />}
                                     <span className="text-xs font-bold mt-1 uppercase">{breeding ? "Synthesizing..." : "Create"}</span>
                                 </motion.button>
                             </div>

                             {/* Slots */}
                             {['embryo', 'crystal', 'morph', 'mutagen'].map((type, i) => {
                                 const angle = (i * 90) * (Math.PI / 180);
                                 const radius = 100;
                                 const x = Math.cos(angle) * radius; // correct math for positioning?
                                 // Simple CSS positioning might be easier
                                 const positions = [
                                     'top-0 left-1/2 -translate-x-1/2', // Top
                                     'right-0 top-1/2 -translate-y-1/2', // Right
                                     'bottom-0 left-1/2 -translate-x-1/2', // Bottom
                                     'left-0 top-1/2 -translate-y-1/2', // Left
                                 ];
                                 const labels = ['Embryo (Required)', 'Crystal', 'Morph', 'Mutagen'];

                                 return (
                                     <div key={type} className={`absolute ${positions[i]} w-20 h-20 rounded-xl bg-gray-800 border-2 border-dashed ${slots[type] ? 'border-green-500 bg-gray-800' : 'border-gray-600'} flex items-center justify-center flex-col`}>
                                         {slots[type] ? (
                                             <div onClick={() => handleRemoveSlot(type)} className="relative w-full h-full p-2 flex items-center justify-center">
                                                 <img src={slots[type].imageUrl} className="w-12 h-12 object-contain" />
                                                 <X size={12} className="absolute top-1 right-1 text-red-500 bg-white rounded-full" />
                                             </div>
                                         ) : (
                                             <span className="text-[10px] text-gray-500 text-center">{labels[i]}</span>
                                         )}
                                     </div>
                                 )
                             })}
                        </div>

                        {/* Inventory Strip */}
                        <div className="w-full mt-8">
                            <h3 className="font-bold text-gray-400 mb-2 flex items-center gap-2"><TestTube size={16}/> Your Materials</h3>
                            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                {materials.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic p-2">No materials. Buy some in Shop!</p>
                                ) : (
                                    materials.map((item: any) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                // Auto-assign to slot based on name/id logic or category
                                                if (item.name.includes("Embryo")) handleSlotClick('embryo', item);
                                                else if (item.name.includes("Crystal")) handleSlotClick('crystal', item);
                                                else if (item.name.includes("Gene")) handleSlotClick('morph', item);
                                                else handleSlotClick('mutagen', item);
                                            }}
                                            className="min-w-[80px] h-24 bg-gray-900 rounded-lg border border-gray-700 p-2 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
                                        >
                                            <img src={item.imageUrl} className="w-10 h-10" />
                                            <span className="text-[10px] text-center line-clamp-2 leading-tight">{item.name}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Pets Display */}
                        <div className="w-full">
                             <h3 className="font-bold text-gray-400 mb-2 flex items-center gap-2">🧬 Your Gen Pets</h3>
                             <div className="grid grid-cols-2 gap-2">
                                 {pets.map((pet: any) => (
                                     <div key={pet.id} className="bg-gray-900 rounded-xl p-3 border border-gray-800 flex items-center gap-2">
                                         <img src={pet.imageUrl} className="w-12 h-12 bg-black rounded-full" />
                                         <div>
                                             <p className="font-bold text-sm">{pet.name}</p>
                                             <div className="flex gap-1 mt-1">
                                                 <span className="text-[10px] bg-red-900 text-red-200 px-1 rounded">STR {pet.stats?.strength}</span>
                                                 <span className="text-[10px] bg-blue-900 text-blue-200 px-1 rounded">INT {pet.stats?.intellect}</span>
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
                ) : (
                    // Market View
                    <div className="grid grid-cols-2 gap-3">
                        {shopItems.map((item) => (
                            <div key={item.id} className="bg-gray-800 rounded-xl p-4 flex flex-col items-center border border-gray-700">
                                <div className="text-4xl mb-2">{item.icon}</div>
                                <h3 className="font-bold text-sm text-center">{item.name}</h3>
                                <p className="text-xs text-yellow-500 font-mono mb-3">{item.price} Pi</p>
                                <button
                                    onClick={() => handleBuy(item)}
                                    className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg text-xs"
                                >
                                    Buy
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* New Pet Modal */}
            <AnimatePresence>
                {newPet && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-gray-900 border border-blue-500 rounded-2xl p-6 flex flex-col items-center max-w-sm w-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/10 blur-xl"></div>
                            <h2 className="text-2xl font-bold mb-4 z-10">Creation Successful!</h2>
                            <img src={newPet.imageUrl} className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] z-10 mb-4" />
                            <p className="text-xl font-bold text-blue-400 z-10">{newPet.name}</p>

                            <div className="grid grid-cols-3 gap-2 w-full mt-4 z-10">
                                <div className="text-center bg-gray-800 p-2 rounded">
                                    <div className="text-xs text-gray-400">STR</div>
                                    <div className="font-bold text-red-400">{newPet.stats.strength}</div>
                                </div>
                                <div className="text-center bg-gray-800 p-2 rounded">
                                    <div className="text-xs text-gray-400">INT</div>
                                    <div className="font-bold text-blue-400">{newPet.stats.intellect}</div>
                                </div>
                                <div className="text-center bg-gray-800 p-2 rounded">
                                    <div className="text-xs text-gray-400">SPD</div>
                                    <div className="font-bold text-green-400">{newPet.stats.speed}</div>
                                </div>
                            </div>

                            <button
                                onClick={() => setNewPet(null)}
                                className="mt-6 w-full py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 z-10"
                            >
                                Collect
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
