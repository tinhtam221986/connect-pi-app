"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import { Hammer, Trophy, Zap, Coins, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useEconomy } from "@/components/economy/EconomyContext";

export function GameCenter() {
    const { t } = useLanguage();
    const { addBalance, refresh } = useEconomy();
    const [score, setScore] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [clicks, setClicks] = useState<{id: number, x: number, y: number}[]>([]);

    // Load initial state from backend
    useEffect(() => {
        const loadState = async () => {
            try {
                // Pass user id explicitly for now since auth might be mocked
                const res = await apiClient.game.getState('user_current');
                // Response format from SmartContractService: { score: number, lastActive: string, pets: [], ... }
                // or the API wrapper: { ... }
                
                // Check if res itself is the state object
                if (res && typeof res.score === 'number') {
                    setScore(res.score);
                    // SmartContractService doesn't track energy yet, keep local state for now
                }
            } catch (error) {
                console.error("Failed to load game state", error);
            }
        };
        loadState();
    }, []);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (energy <= 0) {
            toast.error("Out of energy! Wait a moment.");
            return;
        }

        // Optimistic UI Update
        setScore(prev => prev + 1);
        addBalance(1); // Update global context immediately
        setEnergy(prev => Math.max(0, prev - 1));

        // Visual effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setClicks(prev => [...prev, {id, x, y}]);
        setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 1000);

        // Vibration
        if (navigator.vibrate) navigator.vibrate(50);

        // Sync with Backend
        try {
            // Action 'click' maps to logic in route.ts -> SmartContractService.updateGameState
            await apiClient.game.action('click', { points: 1 });
        } catch (error) {
            console.error("Sync failed", error);
        }
    };

    // Recover energy locally
    useEffect(() => {
        const timer = setInterval(() => {
            setEnergy(prev => Math.min(100, prev + 2));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-full bg-black text-white flex flex-col pb-20 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
                 <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600 flex items-center gap-2">
                     <Gamepad2 size={24} className="text-yellow-500" /> {t('game.title')}
                 </h2>
                 <div className="bg-gray-800 px-3 py-1 rounded-full flex items-center gap-2 border border-yellow-500/30">
                     <Coins size={16} className="text-yellow-400" />
                     <span className="font-bold text-yellow-400">{score.toFixed(0)} Pi</span>
                 </div>
            </div>

            {/* Featured Game: Pi Clicker */}
            <div className="p-6 flex flex-col items-center flex-1 justify-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>

                <div className="text-center mb-8 relative z-10">
                    <h3 className="text-2xl font-bold mb-1">{t('game.clicker_title')}</h3>
                    <p className="text-gray-400 text-sm">{t('game.clicker_desc')}</p>
                </div>

                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClick}
                        className="w-48 h-48 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-2xl shadow-orange-500/40 border-8 border-yellow-300 flex items-center justify-center relative group"
                    >
                        <Hammer size={64} className="text-white drop-shadow-md group-active:rotate-12 transition-transform" />
                    </motion.button>

                    {/* Floating Numbers */}
                    <AnimatePresence>
                        {clicks.map(click => (
                            <motion.span
                                key={click.id}
                                initial={{ opacity: 1, y: 0, scale: 1 }}
                                animate={{ opacity: 0, y: -100, scale: 1.5 }}
                                exit={{ opacity: 0 }}
                                className="absolute text-2xl font-bold text-white pointer-events-none"
                                style={{ top: '20%', left: '40%' }} // Centerish
                            >
                                +1
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Energy Bar */}
                <div className="w-64 mt-8">
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1 text-yellow-500"><Zap size={12} fill="currentColor" /> Energy</span>
                        <span>{energy}/100</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <div
                            className="h-full bg-yellow-500 transition-all duration-300"
                            style={{ width: `${energy}%` }}
                        />
                    </div>
                </div>

                {/* Leaderboard Teaser */}
                <div className="mt-12 w-full max-w-sm bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h4 className="flex items-center gap-2 font-bold mb-3 border-b border-gray-800 pb-2">
                        <Trophy size={16} className="text-yellow-500" /> {t('game.leaderboard')}
                    </h4>
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i===1 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                                        {i}
                                    </span>
                                    <span>User_{9000+i}</span>
                                </div>
                                <span className="font-mono text-yellow-500">{10000 - i*500} Pi</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
