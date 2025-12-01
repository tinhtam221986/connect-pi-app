import { useState } from "react";
import { useGameStore, Pet } from "./store";
import { toast } from "sonner";
import { Swords, Trophy, Shield, Zap } from "lucide-react";

export function ArenaView() {
    const pets = useGameStore(state => state.pets);
    const recordBattleResult = useGameStore(state => state.recordBattleResult);

    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
    const [enemyPet, setEnemyPet] = useState<Pet | null>(null);
    const [battleLog, setBattleLog] = useState<string[]>([]);
    const [battleState, setBattleState] = useState<'select' | 'fighting' | 'result'>('select');
    const [winner, setWinner] = useState<'player' | 'enemy' | null>(null);

    const handleStartBattle = () => {
        if (!selectedPetId) return;

        // Generate Enemy
        const myPet = pets.find(p => p.id === selectedPetId)!;
        const enemy = generateEnemy(myPet);
        setEnemyPet(enemy);
        setBattleState('fighting');
        setBattleLog([]);

        simulateBattle(myPet, enemy);
    };

    const simulateBattle = async (p1: Pet, p2: Pet) => {
        const logs: string[] = [];
        const addLog = (msg: string) => {
            logs.push(msg);
            setBattleLog([...logs]); // React update
        };

        // Helper to delay
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        addLog(`⚔️ BẮT ĐẦU: ${p1.name} VS ${p2.name}`);
        await delay(1000);

        let hp1 = p1.stats.vit * 5; // HP Multiplier
        let hp2 = p2.stats.vit * 5;

        const mult1 = getTypeAdvantage(p1.element, p2.element);
        const mult2 = getTypeAdvantage(p2.element, p1.element);

        if (mult1 > 1) addLog(`🔥 ${p1.name} khắc hệ đối thủ! (+${Math.floor((mult1-1)*100)}% dmg)`);
        if (mult2 > 1) addLog(`🔥 ${p2.name} khắc hệ bạn! (+${Math.floor((mult2-1)*100)}% dmg)`);
        await delay(1000);

        // Turn loop
        let turn = 1;
        while (hp1 > 0 && hp2 > 0) {
            addLog(`--- Lượt ${turn} ---`);

            // Speed check
            const p1First = p1.stats.spd >= p2.stats.spd;

            if (p1First) {
                // P1 Atk
                const dmg1 = calculateDamage(p1, p2, mult1);
                hp2 -= dmg1;
                addLog(`⚡ ${p1.name} tung chiêu! Đối thủ mất ${dmg1} HP.`);
                if (hp2 <= 0) break;
                await delay(800);

                // P2 Atk
                const dmg2 = calculateDamage(p2, p1, mult2);
                hp1 -= dmg2;
                addLog(`🛡️ ${p2.name} phản công! Bạn mất ${dmg2} HP.`);
                await delay(800);
            } else {
                 // P2 Atk
                const dmg2 = calculateDamage(p2, p1, mult2);
                hp1 -= dmg2;
                addLog(`⚡ ${p2.name} nhanh hơn! Bạn mất ${dmg2} HP.`);
                if (hp1 <= 0) break;
                await delay(800);

                 // P1 Atk
                const dmg1 = calculateDamage(p1, p2, mult1);
                hp2 -= dmg1;
                addLog(`🛡️ ${p1.name} đánh trả! Đối thủ mất ${dmg1} HP.`);
                await delay(800);
            }
            turn++;
        }

        const playerWin = hp1 > 0;
        setWinner(playerWin ? 'player' : 'enemy');
        setBattleState('result');

        if (playerWin) {
            recordBattleResult(p1.id, true, 20); // Reward 20 Pi
            toast.success("Chiến thắng! +20 Pi");
        } else {
            recordBattleResult(p1.id, false, 0);
            toast.error("Thất bại...");
        }
    };

    if (battleState === 'select') {
        return (
            <div className="p-4 h-full overflow-y-auto pb-24">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white"><Swords className="text-red-500" /> Đấu Trường</h2>
                <p className="text-slate-400 mb-6">Chọn thú cưng để chiến đấu kiếm Pi.</p>

                <div className="grid grid-cols-1 gap-4">
                    {pets.map(pet => (
                        <div
                            key={pet.id}
                            onClick={() => setSelectedPetId(pet.id)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedPetId === pet.id ? 'border-red-500 bg-red-500/10' : 'border-slate-700 bg-slate-800'}`}
                        >
                            <div className="flex gap-3 items-center">
                                <span className="text-3xl">{getElementIcon(pet.element)}</span>
                                <div>
                                    <h3 className="font-bold text-white">{pet.name}</h3>
                                    <div className="flex gap-2 text-xs text-slate-400">
                                        <span className="text-green-400">W: {pet.wins}</span>
                                        <span className="text-red-400">L: {pet.losses}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-sm text-yellow-400">PWR {pet.stats.str + pet.stats.int + pet.stats.spd + pet.stats.vit}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-24 left-0 w-full p-4 z-20">
                    <button
                        disabled={!selectedPetId}
                        onClick={handleStartBattle}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:scale-105 transition-transform"
                    >
                        TÌM ĐỐI THỦ
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col p-4 relative bg-black/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-center mb-4 text-white">Trận Đấu</h2>

            {/* Visuals */}
            <div className="flex justify-between items-center mb-6 px-4">
                 <div className="text-center">
                     <div className="text-5xl mb-2 animate-bounce">{getElementIcon(pets.find(p=>p.id===selectedPetId)!.element)}</div>
                     <div className="font-bold text-green-400">YOU</div>
                 </div>
                 <div className="text-2xl font-bold text-red-500 animate-pulse">VS</div>
                 <div className="text-center">
                     <div className="text-5xl mb-2 animate-pulse">{enemyPet ? getElementIcon(enemyPet.element) : '?'}</div>
                     <div className="font-bold text-red-400">ENEMY</div>
                 </div>
            </div>

            {/* Log */}
            <div className="flex-1 bg-slate-900/80 rounded-xl p-4 overflow-y-auto font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
                {battleLog.map((log, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-bottom-2 text-white border-b border-white/5 pb-1">{log}</div>
                ))}
                <div id="log-end" />
            </div>

            {/* Result Overlay */}
            {battleState === 'result' && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 animate-in zoom-in p-8 text-center">
                    <div className="text-8xl mb-6">{winner === 'player' ? '🏆' : '💀'}</div>
                    <h2 className={`text-4xl font-bold mb-4 ${winner === 'player' ? 'text-yellow-400' : 'text-red-500'}`}>
                        {winner === 'player' ? 'VICTORY' : 'DEFEAT'}
                    </h2>
                    {winner === 'player' && <p className="text-2xl text-green-400 mb-8 font-mono">+20 Pi</p>}
                    <button
                        onClick={() => setBattleState('select')}
                        className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    >
                        Tiếp Tục
                    </button>
                </div>
            )}
        </div>
    )
}

function calculateDamage(attacker: Pet, defender: Pet, multiplier: number) {
    // Damage = (Atk * Mult) - (Def * 0.2)
    // Atk = Str (Phys) or Int (Mag) - let's simplify to average or max
    const atk = Math.max(attacker.stats.str, attacker.stats.int);
    const def = defender.stats.vit; // Vit acts as Def

    let damage = (atk * multiplier) - (def * 0.3);
    // Random variance
    damage = damage * (0.9 + Math.random() * 0.2); // +/- 10%

    return Math.max(1, Math.floor(damage));
}

function generateEnemy(playerPet: Pet): Pet {
    const totalStats = playerPet.stats.str + playerPet.stats.int + playerPet.stats.spd + playerPet.stats.vit;
    const variance = Math.floor(totalStats * 0.2);
    const targetTotal = totalStats + (Math.random() * variance * 2 - variance);

    const stats = { str: 0, int: 0, spd: 0, vit: 0 };
    let remaining = targetTotal;

    stats.str = Math.floor(Math.random() * (remaining * 0.4)); remaining -= stats.str;
    stats.int = Math.floor(Math.random() * (remaining * 0.5)); remaining -= stats.int;
    stats.spd = Math.floor(Math.random() * (remaining * 0.6)); remaining -= stats.spd;
    stats.vit = Math.max(10, remaining);

    const elements: any[] = ['fire', 'water', 'wood', 'earth', 'metal'];
    const element = elements[Math.floor(Math.random() * elements.length)];

    return {
        id: 'enemy_bot',
        name: `Wild ${element.charAt(0).toUpperCase() + element.slice(1)}`,
        element,
        genes: {} as any,
        stats,
        rarity: 1,
        createdAt: Date.now(),
        wins: 0,
        losses: 0
    };
}

function getTypeAdvantage(atk: string, def: string) {
    // Cycle: Water > Fire > Wood > Earth > Metal > Water
    if (atk === 'water' && def === 'fire') return 1.5;
    if (atk === 'fire' && def === 'wood') return 1.5;
    if (atk === 'wood' && def === 'earth') return 1.5;
    if (atk === 'earth' && def === 'metal') return 1.5;
    if (atk === 'metal' && def === 'water') return 1.5;

    // Resist
    if (atk === 'fire' && def === 'water') return 0.7;
    if (atk === 'wood' && def === 'fire') return 0.7;
    if (atk === 'earth' && def === 'wood') return 0.7;
    if (atk === 'metal' && def === 'earth') return 0.7;
    if (atk === 'water' && def === 'metal') return 0.7;

    return 1.0;
}

function getElementIcon(element: string) {
    switch(element) {
        case 'fire': return '🐲';
        case 'water': return '🦈';
        case 'wood': return '🐺';
        case 'metal': return '🦅';
        case 'earth': return '🐢';
        default: return '❓';
    }
}
