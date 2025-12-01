import { useGameStore } from "./store";
import { Trophy, Medal, Users } from "lucide-react";

export function LeaderboardView() {
    const pets = useGameStore(state => state.pets);
    const totalWins = pets.reduce((acc, p) => acc + p.wins, 0);
    // Calc stats safely
    const bestPet = [...pets].sort((a,b) => {
        const powerA = a.stats.str + a.stats.int + a.stats.spd + a.stats.vit;
        const powerB = b.stats.str + b.stats.int + b.stats.spd + b.stats.vit;
        return powerB - powerA;
    })[0];

    const powerScore = bestPet ? (bestPet.stats.str + bestPet.stats.int + bestPet.stats.spd + bestPet.stats.vit) : 0;

    const MOCK_LEADERBOARD: any[] = [
        { id: 1, name: "DragonKing", wins: 1542, power: 450, avatar: "🐲" },
        { id: 2, name: "CryptoQueen", wins: 1205, power: 420, avatar: "👸" },
        { id: 3, name: "PiWhale", wins: 980, power: 410, avatar: "🐋" },
        { id: 4, name: "BeastMaster", wins: 850, power: 395, avatar: "🦁" },
        { id: 5, name: "LuckyCharm", wins: 720, power: 380, avatar: "🍀" },
        { id: 6, name: "NightFury", wins: 650, power: 375, avatar: "🦇" },
        { id: 7, name: "SunGod", wins: 610, power: 370, avatar: "🌞" },
    ];

    // Insert Player into list and sort
    const playerEntry = { id: 999, name: "BẠN", wins: totalWins, power: powerScore, avatar: "👤", isPlayer: true };
    const allPlayers = [...MOCK_LEADERBOARD, playerEntry].sort((a,b) => b.wins - a.wins);

    return (
        <div className="h-full overflow-y-auto p-4 pb-20">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Trophy className="text-yellow-400" /> Bảng Xếp Hạng
            </h2>

            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                {allPlayers.map((p, index) => (
                    <div
                        key={p.id}
                        className={`flex items-center p-4 border-b border-slate-700 last:border-0 transition-colors ${p.isPlayer ? 'bg-yellow-500/10 border-l-4 border-l-yellow-500' : 'hover:bg-slate-750'}`}
                    >
                        <div className={`w-8 text-center font-bold ${index < 3 ? 'text-yellow-400 scale-110' : 'text-slate-500'}`}>
                            {index + 1}
                        </div>
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl mx-4 shadow-inner">
                            {p.avatar}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-white flex items-center gap-2">
                                {p.name}
                                {index === 0 && <Medal size={16} className="text-yellow-400 fill-yellow-400" />}
                                {index === 1 && <Medal size={16} className="text-gray-400 fill-gray-400" />}
                                {index === 2 && <Medal size={16} className="text-amber-600 fill-amber-600" />}
                            </div>
                            <div className="text-xs text-slate-500">Top Pet Power: {p.power}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-yellow-400">{p.wins} Wins</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl text-center shadow-xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy size={100} />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">🏆 Giải Đấu Mùa 1</h3>
                <p className="text-sm text-purple-200 mb-4 max-w-xs mx-auto">
                    Top 10 người chơi mạnh nhất sẽ nhận được danh hiệu <span className="font-bold text-yellow-400">Legendary</span> và phần thưởng 1000 Pi.
                </p>
                <div className="inline-block px-3 py-1 bg-black/30 rounded-full text-xs text-purple-300 border border-purple-500/30">
                    Kết thúc trong: 14 ngày 03:20:15
                </div>
            </div>
        </div>
    )
}
