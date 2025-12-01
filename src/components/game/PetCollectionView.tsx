import { useGameStore, Pet } from "./store";

export function PetCollectionView() {
  const pets = useGameStore(state => state.pets);

  return (
    <div className="h-full overflow-y-auto p-4 pb-20">
        <h2 className="text-2xl font-bold mb-4 text-white">Bộ Sưu Tập ({pets.length})</h2>

        {pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <p>Chưa có thú cưng nào.</p>
                <p className="text-sm mt-2">Hãy đến Phòng Lab để tạo!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {pets.map(pet => <PetCard key={pet.id} pet={pet} />)}
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
        <div className={`rounded-xl p-4 border ${colorClass} relative overflow-hidden`}>
            <div className="flex gap-4">
                <div className="w-20 h-20 bg-black/30 rounded-lg flex items-center justify-center text-4xl shrink-0">
                    {/* Placeholder Avatar */}
                    {pet.element === 'fire' ? '🐲' :
                     pet.element === 'water' ? '🦈' :
                     pet.element === 'wood' ? '🐺' :
                     pet.element === 'metal' ? '🦅' :
                     pet.element === 'earth' ? '🐢' : '❓'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg truncate">{pet.name}</h3>
                            <span className="text-xs uppercase tracking-wider opacity-75">{pet.element} Element</span>
                        </div>
                        <div className="text-xs font-mono bg-black/30 px-2 py-1 rounded whitespace-nowrap">
                            Rarity: {pet.rarity}
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

            {/* Gene Details Expand (Simplified) */}
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
            <div className="font-bold text-sm">{value}</div>
        </div>
    )
}
