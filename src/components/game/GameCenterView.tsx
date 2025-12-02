import { useState } from "react";
import { GameLayout } from "./GameLayout";
import { ClickerGameView } from "./ClickerGameView";
import { Gamepad2, Timer, Star, Play, ChevronRight, Search } from "lucide-react";

export function GameCenterView({ onBackToMain }: { onBackToMain: () => void }) {
    const [activeGame, setActiveGame] = useState<string | null>(null);

    if (activeGame === 'gene-lab') {
        return <GameLayout onBack={() => setActiveGame(null)} />;
    }

    if (activeGame === 'mining-clicker') {
        return <ClickerGameView onBack={() => setActiveGame(null)} />;
    }

    const GAMES = [
        {
            id: 'mining-clicker',
            name: 'Pi Mining Clicker',
            desc: 'Đào Pi ngay!',
            icon: '⛏️',
            color: 'from-yellow-500 to-orange-600',
            players: '50k+'
        },
        {
            id: 'gene-lab',
            name: 'Pi Gene Lab',
            desc: 'Lai tạo & Chiến đấu',
            icon: '🧬',
            color: 'from-purple-600 to-pink-600',
            players: '12.5k'
        },
        {
            id: 'pi-racer',
            name: 'Pi Racer',
            desc: 'Đua xe kiếm Pi (Sắp ra mắt)',
            icon: '🏎️',
            color: 'from-blue-600 to-cyan-600',
            players: '--'
        },
        {
            id: 'memory',
            name: 'Mind Blocks',
            desc: 'Rèn luyện trí nhớ',
            icon: '🧩',
            color: 'from-green-600 to-emerald-600',
            players: '--'
        }
    ];

    return (
        <div className="h-full bg-slate-950 text-white overflow-y-auto pb-24 animate-in fade-in">
            {/* Header */}
            <div className="p-6 pt-10 bg-gradient-to-b from-slate-900 to-slate-950 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Game Center</h1>
                        <p className="text-slate-400 text-sm">Khám phá thế giới giải trí trên Pi</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                        <Search size={20} className="text-slate-400" />
                    </div>
                </div>

                {/* Featured Game */}
                <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl cursor-pointer group border border-slate-700" onClick={() => setActiveGame('gene-lab')}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 transition-transform duration-1000 group-hover:scale-105" />

                    <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black via-black/60 to-transparent">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="px-2 py-1 bg-yellow-500 text-black text-[10px] font-bold rounded uppercase mb-2 inline-block shadow-lg">Featured</span>
                                <h2 className="text-2xl font-bold text-white mb-1">Pi Gene Lab</h2>
                                <p className="text-xs text-gray-300">Game nuôi thú NFT số 1 trên Pi Network</p>
                            </div>
                            <button className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-lg">
                                <Play fill="black" size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="px-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                    <Star size={18} className="text-yellow-400 fill-yellow-400" /> Xu Hướng
                </h3>

                <div className="flex flex-col gap-4">
                    {GAMES.map(game => (
                        <div
                            key={game.id}
                            onClick={() => game.id === 'gene-lab' && setActiveGame('gene-lab')}
                            className="bg-slate-900 p-3 rounded-xl flex items-center gap-4 border border-slate-800 active:scale-95 transition-all hover:bg-slate-800/80 cursor-pointer"
                        >
                            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg`}>
                                {game.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-white">{game.name}</h4>
                                <p className="text-xs text-slate-400">{game.desc}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex text-yellow-500 text-[10px]">
                                        <Star size={10} fill="currentColor" />
                                        <Star size={10} fill="currentColor" />
                                        <Star size={10} fill="currentColor" />
                                        <Star size={10} fill="currentColor" />
                                        <Star size={10} fill="currentColor" />
                                    </div>
                                    <span className="text-[10px] text-slate-500">{game.players} playing</span>
                                </div>
                            </div>
                            <button className="p-2 bg-slate-800 rounded-full text-slate-400">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Play / History */}
            <div className="px-4 mt-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                    <Timer size={18} className="text-blue-400" /> Chơi Gần Đây
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                     <div onClick={() => setActiveGame('gene-lab')} className="min-w-[100px] flex flex-col gap-2 cursor-pointer group">
                         <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl shadow-md group-hover:scale-105 transition-transform border border-white/10">
                             🧬
                         </div>
                         <span className="text-xs font-bold text-center text-slate-300 group-hover:text-white">Pi Gene Lab</span>
                     </div>
                </div>
            </div>
        </div>
    )
}
