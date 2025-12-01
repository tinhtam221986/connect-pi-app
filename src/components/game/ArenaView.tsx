import { useState, useEffect, useRef } from "react";
import { useGameStore, Pet } from "./store";
import { toast } from "sonner";
import { Swords, Trophy, Shield, Zap, Skull } from "lucide-react";
import { gameAudio } from "./lib/audio";
import { Confetti } from "./Confetti";

export function ArenaView() {
    const pets = useGameStore(state => state.pets);
    const recordBattleResult = useGameStore(state => state.recordBattleResult);

    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
    const [enemyPet, setEnemyPet] = useState<Pet | null>(null);

    // Battle State
    const [battleState, setBattleState] = useState<'select' | 'fighting' | 'result'>('select');
    const [winner, setWinner] = useState<'player' | 'enemy' | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    // Visual State
    const [hp1, setHp1] = useState(100);
    const [maxHp1, setMaxHp1] = useState(100);
    const [hp2, setHp2] = useState(100);
    const [maxHp2, setMaxHp2] = useState(100);

    const [anim1, setAnim1] = useState(''); // '', 'attack', 'hit'
    const [anim2, setAnim2] = useState('');

    const logBoxRef = useRef<HTMLDivElement>(null);

    // Auto scroll logs
    useEffect(() => {
        if (logBoxRef.current) {
            logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
        }
    }, [logs]);

    const handleStartBattle = () => {
        if (!selectedPetId) return;

        // Generate Enemy
        const myPet = pets.find(p => p.id === selectedPetId)!;
        const enemy = generateEnemy(myPet);
        setEnemyPet(enemy);
        setBattleState('fighting');
        setLogs([]);

        // Init Stats
        const m1 = myPet.stats.vit * 10;
        const m2 = enemy.stats.vit * 10;
        setMaxHp1(m1); setHp1(m1);
        setMaxHp2(m2); setHp2(m2);

        simulateBattle(myPet, enemy, m1, m2);
    };

    const simulateBattle = async (p1: Pet, p2: Pet, max1: number, max2: number) => {
        const addLog = (msg: string) => setLogs(prev => [...prev, msg]);
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        let curr1 = max1;
        let curr2 = max2;

        await delay(1000);
        addLog(`⚔️ BẮT ĐẦU TRẬN CHIẾN!`);
        await delay(1000);

        // Elemental Check
        const mult1 = getTypeAdvantage(p1.element, p2.element);
        const mult2 = getTypeAdvantage(p2.element, p1.element);

        if (mult1 > 1) {
            addLog(`🔥 ${p1.name} có lợi thế hệ!`);
            await delay(500);
        }
        if (mult2 > 1) {
             addLog(`🔥 ${p2.name} có lợi thế hệ!`);
             await delay(500);
        }

        while (curr1 > 0 && curr2 > 0) {
            // Determine order based on speed + random variance
            const spd1 = p1.stats.spd * (0.9 + Math.random() * 0.2);
            const spd2 = p2.stats.spd * (0.9 + Math.random() * 0.2);
            const p1First = spd1 >= spd2;

            const turn = async (attacker: Pet, defender: Pet, isPlayerAttacking: boolean, mult: number) => {
                if (curr1 <= 0 || curr2 <= 0) return;

                // Skill Trigger Check (20%)
                const useSkill = Math.random() < 0.2;

                // Animate Attack
                if (isPlayerAttacking) setAnim1('attack'); else setAnim2('attack');
                gameAudio.playClick(); // Swing sound
                await delay(300);
                if (isPlayerAttacking) setAnim1(''); else setAnim2('');

                if (useSkill) {
                    const skillName = getSkillName(attacker.element);
                    addLog(`⚡ ${attacker.name} dùng TUYỆT KỸ: ${skillName}!`);
                    gameAudio.playSuccess(); // Skill sound

                    if (attacker.element === 'water') {
                        const heal = 30;
                        if (isPlayerAttacking) {
                            curr1 = Math.min(max1, curr1 + heal);
                            setHp1(curr1);
                        } else {
                             curr2 = Math.min(max2, curr2 + heal);
                             setHp2(curr2);
                        }
                        addLog(`💚 ${attacker.name} hồi phục ${heal} HP!`);
                        await delay(800);
                        return;
                    }

                    let skillMult = 1.5;
                    if (attacker.element === 'fire') skillMult = 2.0; // Inferno

                    const dmg = calculateDamage(attacker, defender, mult * skillMult);

                    // Wood Drain
                    if (attacker.element === 'wood') {
                         const drain = Math.floor(dmg * 0.5);
                         if (isPlayerAttacking) {
                            curr1 = Math.min(max1, curr1 + drain);
                            setHp1(curr1);
                        } else {
                             curr2 = Math.min(max2, curr2 + drain);
                             setHp2(curr2);
                        }
                        addLog(`🌿 ${attacker.name} hút ${drain} HP!`);
                    }

                    // Apply Dmg
                    if (isPlayerAttacking) {
                        curr2 = Math.max(0, curr2 - dmg);
                        setHp2(curr2);
                        setAnim2('hit');
                    } else {
                        curr1 = Math.max(0, curr1 - dmg);
                        setHp1(curr1);
                        setAnim1('hit');
                    }
                    gameAudio.playHit();
                    addLog(`💥 ${dmg} SÁT THƯƠNG CHÍ MẠNG!`);

                } else {
                    // Normal Attack
                    const dmg = calculateDamage(attacker, defender, mult);

                    if (isPlayerAttacking) {
                        curr2 = Math.max(0, curr2 - dmg);
                        setHp2(curr2);
                        setAnim2('hit');
                    } else {
                        curr1 = Math.max(0, curr1 - dmg);
                        setHp1(curr1);
                        setAnim1('hit');
                    }
                    gameAudio.playHit();
                    addLog(`${attacker.name} đánh: ${dmg} sát thương.`);
                }

                await delay(400);
                if (isPlayerAttacking) setAnim2(''); else setAnim1('');
                await delay(400);
            };

            if (p1First) {
                await turn(p1, p2, true, mult1);
                await turn(p2, p1, false, mult2);
            } else {
                await turn(p2, p1, false, mult2);
                await turn(p1, p2, true, mult1);
            }
        }

        const playerWin = curr1 > 0;
        setWinner(playerWin ? 'player' : 'enemy');
        await delay(500);
        setBattleState('result');

        if (playerWin) {
            gameAudio.playWin();
            recordBattleResult(p1.id, true, 20);
            toast.success("Chiến thắng! +20 Pi");
        } else {
            gameAudio.playError();
            recordBattleResult(p1.id, false, 0);
            toast.error("Thất bại...");
        }
    };

    if (battleState === 'select') {
        return (
            <div className="p-4 h-full overflow-y-auto pb-24">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white"><Swords className="text-red-500" /> Đấu Trường</h2>

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

    const myPet = pets.find(p => p.id === selectedPetId)!;

    return (
        <div className="h-full flex flex-col p-4 relative bg-black/50 backdrop-blur-sm overflow-hidden">
            <div className="flex-1 flex flex-col justify-center px-4 relative z-10 gap-12">
                 {/* Enemy Section */}
                 <div className="flex flex-col items-center relative">
                     {/* Sprite */}
                     <div className={`transition-all duration-200 transform ${anim2 === 'hit' ? 'translate-x-2 rotate-6 opacity-80' : ''} ${anim2 === 'attack' ? '-translate-y-10 scale-110' : ''}`}>
                         <div className="text-8xl filter drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                            {enemyPet ? getElementIcon(enemyPet.element) : '?'}
                         </div>
                     </div>

                     {/* HUD */}
                     <div className="w-full max-w-xs mt-6 bg-slate-900/80 p-3 rounded-lg border border-slate-700 backdrop-blur-md">
                         <div className="flex justify-between text-xs font-bold mb-1 text-white">
                             <span className="text-red-400 uppercase">{enemyPet?.name}</span>
                             <span>{Math.ceil(hp2)}/{maxHp2}</span>
                         </div>
                         <HealthBar current={hp2} max={maxHp2} color="bg-red-500" />
                     </div>
                 </div>

                 {/* VS Marker */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                     <Swords size={200} />
                 </div>

                 {/* Player Section */}
                 <div className="flex flex-col items-center relative">
                     {/* Sprite */}
                     <div className={`transition-all duration-200 transform ${anim1 === 'hit' ? '-translate-x-2 -rotate-6 opacity-80' : ''} ${anim1 === 'attack' ? 'translate-y-10 scale-110' : ''}`}>
                         <div className="text-8xl filter drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]">
                            {getElementIcon(myPet.element)}
                         </div>
                     </div>

                     {/* HUD */}
                     <div className="w-full max-w-xs mt-6 bg-slate-900/80 p-3 rounded-lg border border-slate-700 backdrop-blur-md">
                         <div className="flex justify-between text-xs font-bold mb-1 text-white">
                             <span className="text-green-400 uppercase">{myPet.name}</span>
                             <span>{Math.ceil(hp1)}/{maxHp1}</span>
                         </div>
                         <HealthBar current={hp1} max={maxHp1} color="bg-green-500" />
                     </div>
                 </div>
            </div>

            {/* Battle Log Ticker */}
            <div className="h-24 bg-black/60 backdrop-blur-md border-t border-white/10 p-2 overflow-hidden flex flex-col justify-end">
                <div ref={logBoxRef} className="overflow-y-auto max-h-full scroll-smooth">
                    {logs.map((log, i) => (
                        <div key={i} className="text-xs font-mono mb-1 text-white/90 animate-in fade-in slide-in-from-left-2">
                            {log}
                        </div>
                    ))}
                </div>
            </div>

            {/* Result Overlay */}
            {battleState === 'result' && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 animate-in zoom-in p-8 text-center">
                    {winner === 'player' && <Confetti />}
                    <div className="text-8xl mb-6 animate-bounce">{winner === 'player' ? '🏆' : '💀'}</div>
                    <h2 className={`text-4xl font-bold mb-4 ${winner === 'player' ? 'text-yellow-400' : 'text-red-500'}`}>
                        {winner === 'player' ? 'VICTORY!' : 'DEFEATED'}
                    </h2>
                    {winner === 'player' && (
                        <div className="bg-yellow-500/20 px-6 py-3 rounded-xl border border-yellow-500/50 mb-8">
                            <p className="text-2xl text-yellow-400 font-bold font-mono">+20 Pi</p>
                            <p className="text-xs text-yellow-200 uppercase tracking-widest mt-1">Reward</p>
                        </div>
                    )}
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

function HealthBar({ current, max, color }: any) {
    const pct = Math.max(0, Math.min(100, (current / max) * 100));
    return (
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div
                className={`h-full transition-all duration-500 ease-out ${color} shadow-[0_0_10px_currentColor]`}
                style={{ width: `${pct}%` }}
            />
        </div>
    )
}

function calculateDamage(attacker: Pet, defender: Pet, multiplier: number) {
    const atk = Math.max(attacker.stats.str, attacker.stats.int);
    const def = defender.stats.vit;

    // Base damage
    let damage = (atk * 1.5) - (def * 0.5);
    damage = Math.max(5, damage); // Min damage

    // Multiplier
    damage = damage * multiplier;

    // Variance
    damage = damage * (0.8 + Math.random() * 0.4);

    // Crit chance based on Spd
    if (Math.random() < (attacker.stats.spd / 100)) {
        damage *= 1.5;
    }

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
    if (atk === 'water' && def === 'fire') return 1.5;
    if (atk === 'fire' && def === 'wood') return 1.5;
    if (atk === 'wood' && def === 'earth') return 1.5;
    if (atk === 'earth' && def === 'metal') return 1.5;
    if (atk === 'metal' && def === 'water') return 1.5;

    if (atk === 'fire' && def === 'water') return 0.7;
    if (atk === 'wood' && def === 'fire') return 0.7;
    if (atk === 'earth' && def === 'wood') return 0.7;
    if (atk === 'metal' && def === 'earth') return 0.7;
    if (atk === 'water' && def === 'metal') return 0.7;

    return 1.0;
}

function getSkillName(element: string) {
    switch(element) {
        case 'fire': return 'HỎA NGỤC';
        case 'water': return 'THỦY HỒI';
        case 'wood': return 'HÚT SINH';
        case 'metal': return 'THIẾT KÍCH';
        case 'earth': return 'ĐỊA CHẤN';
        default: return 'TẤN CÔNG';
    }
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
