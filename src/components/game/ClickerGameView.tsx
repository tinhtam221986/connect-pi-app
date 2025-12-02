import { useState, useEffect } from "react";
import { Hammer, Zap, Trophy, Bot, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export function ClickerGameView({ onBack }: { onBack: () => void }) {
    const [score, setScore] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [isClicking, setIsClicking] = useState(false);

    // Mock Leaderboard
    const leaderboard = [
        { id: 1, name: "User_9001", score: 9500 },
        { id: 2, name: "User_9002", score: 9000 },
        { id: 3, name: "User_9003", score: 8500 },
        { id: 4, name: "User_9004", score: 8200 },
        { id: 5, name: "User_9005", score: 7800 },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setEnergy(prev => Math.min(prev + 1, 100));
        }, 1000); // Regenerate 1 energy per second
        return () => clearInterval(timer);
    }, []);

    const handleClick = () => {
        if (energy > 0) {
            setScore(prev => prev + 1);
            setEnergy(prev => prev - 1);
            setIsClicking(true);
            setTimeout(() => setIsClicking(false), 100);

            // Haptic feedback if available (mobile)
            if (navigator.vibrate) navigator.vibrate(50);
        } else {
            toast.error("Not enough energy!", { duration: 1000 });
        }
    };

    return (
        <div className="h-full flex flex-col bg-black text-white relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-slate-900 border-b border-slate-800">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full">
                    <ChevronLeft />
                </button>
                <div className="text-center">
                    <h1 className="font-bold text-lg">Pi Mining Clicker</h1>
                    <p className="text-xs text-slate-400">Chạm liên tục để đào Pi!</p>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative p-6">

                {/* Score Display */}
                <div className="absolute top-10 text-center">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600">
                        {score.toLocaleString()}
                    </span>
                    <span className="text-sm ml-1 text-yellow-500 font-bold">Pi</span>
                </div>

                {/* Click Button */}
                <div className="relative">
                     {/* Glow effect */}
                    <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />

                    <button
                        onClick={handleClick}
                        className={`w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-8 border-yellow-300 shadow-[0_0_50px_rgba(234,179,8,0.5)] flex items-center justify-center transition-all duration-75 active:scale-95 ${isClicking ? 'scale-95' : 'scale-100 hover:scale-105'}`}
                    >
                        <Hammer size={80} className="text-white drop-shadow-md" />
                    </button>
                </div>

                {/* Energy Bar */}
                <div className="w-full max-w-xs mt-12">
                    <div className="flex justify-between text-xs font-bold mb-2 text-yellow-400">
                        <span className="flex items-center gap-1"><Zap size={14} fill="currentColor" /> Energy</span>
                        <span>{energy}/100</span>
                    </div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 ease-out"
                            style={{ width: `${energy}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Leaderboard Panel */}
            <div className="bg-slate-900 rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-slate-800">
                <h3 className="flex items-center gap-2 font-bold text-yellow-400 mb-4">
                    <Trophy size={20} className="text-yellow-400" /> Bảng xếp hạng
                </h3>

                <div className="flex flex-col gap-3">
                    {leaderboard.map((user, index) => (
                        <div key={user.id} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-yellow-500 text-black' : index === 1 ? 'bg-slate-400 text-black' : index === 2 ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                    {index + 1}
                                </div>
                                <span className="font-bold text-sm text-slate-200">{user.name}</span>
                            </div>
                            <span className="text-yellow-500 font-mono font-bold">{user.score} Pi</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => toast("Auto-miner coming soon!")}
                className="absolute bottom-24 right-6 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-90 transition-transform z-10"
            >
                <Bot size={28} className="text-white" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
            </button>
        </div>
    );
}
