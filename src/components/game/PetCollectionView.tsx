import { useState } from "react";
import { useGameStore, Pet } from "./store";
import { toast } from "sonner";
import { DollarSign, Share2 } from "lucide-react";

export function PetCollectionView() {
  const pets = useGameStore(state => state.pets);
  const listPet = useGameStore(state => state.listPet);

  const [sellingPet, setSellingPet] = useState<Pet | null>(null);
  const [price, setPrice] = useState("100");

  const handleSell = (pet: Pet) => {
      setSellingPet(pet);
      setPrice("100");
  };

  const confirmSell = () => {
      if (!sellingPet) return;
      const p = parseInt(price);
      if (isNaN(p) || p <= 0) {
          toast.error("Giá không hợp lệ");
          return;
      }

      listPet(sellingPet.id, p);
      toast.success(`Đã đăng bán ${sellingPet.name} với giá ${p} Pi`);
      setSellingPet(null);
  };

  return (
    <div className="h-full overflow-y-auto p-4 pb-20 relative">
        <h2 className="text-2xl font-bold mb-4 text-white">Bộ Sưu Tập ({pets.length})</h2>

        {pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <p>Chưa có thú cưng nào.</p>
                <p className="text-sm mt-2">Hãy đến Phòng Lab để tạo!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {pets.map(pet => (
                    <div key={pet.id} className="relative group">
                        <PetCard pet={pet} />
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                             <button
                                onClick={() => toast.success("Đã chia sẻ lên Bảng tin Connect!")}
                                className="p-2 bg-slate-900/80 rounded-full text-blue-400 hover:bg-slate-800 border border-slate-700 backdrop-blur-sm opacity-100 transition-all shadow-lg active:scale-95"
                                title="Chia sẻ"
                             >
                                <Share2 size={16} />
                             </button>
                             <button
                                onClick={() => handleSell(pet)}
                                className="p-2 bg-slate-900/80 rounded-full text-yellow-400 hover:bg-slate-800 border border-slate-700 backdrop-blur-sm opacity-100 transition-all shadow-lg active:scale-95"
                                title="Bán thú cưng"
                             >
                                <DollarSign size={16} />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Sell Modal */}
        {sellingPet && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in">
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-bold mb-4 text-white">Bán {sellingPet.name}</h3>
                    <label className="text-sm text-slate-400 block mb-2">Giá bán (Pi)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 mb-6 text-white font-mono text-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                    />
                    <div className="flex gap-4">
                        <button onClick={() => setSellingPet(null)} className="flex-1 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-white font-bold">Hủy</button>
                        <button onClick={confirmSell} className="flex-1 py-3 bg-green-600 rounded-lg font-bold hover:bg-green-500 transition-colors text-white shadow-lg shadow-green-500/20">Đăng Bán</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

function PetCard({ pet }: { pet: Pet }) {
    const elementColors: any = {
        fire: 'text-red-500 border-red-500/30 bg-red-500/10',
        water: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
        wood: 'text-green-500 border-green-500/30 bg-green-500/10',
        metal: 'text-gray-400 border-gray-400/30 bg-gray-500/10',
        earth: 'text-amber-600 border-amber-600/30 bg-amber-600/10',
    };

    const colorClass = elementColors[pet.element] || 'text-white border-white/30 bg-white/10';

    return (
        <div className={`rounded-xl p-4 border ${colorClass} relative overflow-hidden transition-all hover:border-opacity-100 hover:scale-[1.01]`}>
            <div className="flex gap-4">
                <div className="w-20 h-20 bg-black/30 rounded-lg flex items-center justify-center text-4xl shrink-0">
                    {pet.element === 'fire' ? '🐲' :
                     pet.element === 'water' ? '🦈' :
                     pet.element === 'wood' ? '🐺' :
                     pet.element === 'metal' ? '🦅' :
                     pet.element === 'earth' ? '🐢' : '❓'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg truncate text-white">{pet.name}</h3>
                            <span className="text-xs uppercase tracking-wider opacity-75">{pet.element} Element</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                             <div className="text-xs font-mono bg-black/30 px-2 py-1 rounded whitespace-nowrap">
                                Rarity: {pet.rarity}
                            </div>
                            {pet.wins > 0 && (
                                <span className="text-[10px] text-green-400 font-bold">Win: {pet.wins}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                        <StatBox label="STR" value={pet.stats.str} />
                        <StatBox label="INT" value={pet.stats.int} />
                        <StatBox label="SPD" value={pet.stats.spd} />
                        <StatBox label="VIT" value={pet.stats.vit} />
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 text-xs opacity-70 flex flex-wrap gap-2">
                {Object.values(pet.genes).map((g: any, i) => (
                    <span key={i} className={g.rarity !== 'common' ? 'text-yellow-400 font-bold' : ''}>
                        {g.name}
                    </span>
                ))}
            </div>
        </div>
    )
}

function StatBox({ label, value }: any) {
    return (
        <div className="bg-black/20 rounded p-1">
            <div className="text-[10px] opacity-50">{label}</div>
            <div className="font-bold text-sm text-white">{value}</div>
        </div>
    )
}
