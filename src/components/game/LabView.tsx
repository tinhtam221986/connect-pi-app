import { useState } from "react";
import { useGameStore, SHOP_ITEMS, BREEDING_FEE, Pet } from "./store";
import { toast } from "sonner";
import { Dna, Plus, Heart } from "lucide-react";
import { gameAudio } from "./lib/audio";

export function LabView() {
  const inventory = useGameStore(state => state.inventory);
  const createPet = useGameStore(state => state.createPet);
  const breedPets = useGameStore(state => state.breedPets);
  const pets = useGameStore(state => state.pets);

  const [mode, setMode] = useState<'create' | 'breed'>('create');

  // Creation State
  const [selectedEmbryo, setSelectedEmbryo] = useState<string | null>(null);
  const [selectedCrystal, setSelectedCrystal] = useState<string | null>(null);
  const [selectedMutagen, setSelectedMutagen] = useState<string | null>(null);
  const [isBreeding, setIsBreeding] = useState(false);

  // Breeding State
  const [sireId, setSireId] = useState<string | null>(null);
  const [damId, setDamId] = useState<string | null>(null);

  // Filter items from inventory
  const embryos = SHOP_ITEMS.filter(i => i.type === 'embryo' && (inventory[i.id] || 0) > 0);
  const crystals = SHOP_ITEMS.filter(i => i.type === 'crystal' && (inventory[i.id] || 0) > 0);
  const mutagens = SHOP_ITEMS.filter(i => i.type === 'mutagen' && (inventory[i.id] || 0) > 0);

  const handleCreate = () => {
      if (!selectedEmbryo) {
          toast.error("Cần phải có Phôi gốc!");
          return;
      }

      setIsBreeding(true);

      setTimeout(() => {
          try {
              createPet({
                  embryoId: selectedEmbryo,
                  crystalId: selectedCrystal || undefined,
                  mutagenId: selectedMutagen || undefined
              });
              gameAudio.playBreed();
              toast.success("Tạo hóa thành công!");
              setSelectedEmbryo(null);
              setSelectedCrystal(null);
              setSelectedMutagen(null);
          } catch (e: any) {
              toast.error(e.message || "Có lỗi xảy ra");
          } finally {
              setIsBreeding(false);
          }
      }, 2000);
  };

  const handleBreed = () => {
      if (!sireId || !damId) {
          toast.error("Chọn đủ cha và mẹ!");
          return;
      }

      setIsBreeding(true);
      setTimeout(() => {
          try {
              breedPets(sireId, damId);
              gameAudio.playBreed();
              toast.success("Lai giống thành công!");
              setSireId(null);
              setDamId(null);
          } catch (e: any) {
              toast.error(e.message || "Có lỗi xảy ra");
          } finally {
              setIsBreeding(false);
          }
      }, 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Phòng Thí Nghiệm</h2>

        <div className="flex bg-slate-800 rounded-full p-1 mb-8 w-full max-w-xs shadow-inner">
            <button
                onClick={() => setMode('create')}
                className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${mode==='create' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Tạo Hóa
            </button>
            <button
                onClick={() => setMode('breed')}
                className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${mode==='breed' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Lai Giống
            </button>
        </div>

        {mode === 'create' ? (
            <>
                <div className="relative w-64 h-64 mb-8">
                    <div className={`absolute inset-0 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center ${isBreeding ? 'animate-spin' : ''}`} style={{ animationDuration: isBreeding ? '3s' : '0s' }}>
                         <Dna size={64} className="text-slate-600 opacity-20" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ItemSlot type="embryo" selectedId={selectedEmbryo} items={embryos} onSelect={setSelectedEmbryo} label="Phôi" />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <ItemSlot type="crystal" selectedId={selectedCrystal} items={crystals} onSelect={setSelectedCrystal} label="Hệ" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                         <ItemSlot type="mutagen" selectedId={selectedMutagen} items={mutagens} onSelect={setSelectedMutagen} label="Biến đổi" />
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    disabled={isBreeding || !selectedEmbryo}
                    className={`w-full max-w-xs py-4 rounded-xl font-bold text-lg shadow-lg transition-all text-white
                        ${isBreeding || !selectedEmbryo
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 hover:shadow-purple-500/20'}`}
                >
                    {isBreeding ? 'Đang phân tích gen...' : `TẠO HÓA (-${BREEDING_FEE} Pi)`}
                </button>
                <p className="mt-4 text-xs text-slate-500 text-center max-w-xs">Sử dụng nguyên liệu để tạo thú cưng mới với các đặc tính ngẫu nhiên.</p>
            </>
        ) : (
            <>
                 <div className="flex items-center justify-center gap-4 mb-10 w-full relative">
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isBreeding ? 'animate-pulse scale-150' : ''}`}>
                          <Heart className="text-pink-600 opacity-20" size={100} />
                      </div>

                      <PetSelectSlot
                        label="Cha (Sire)"
                        selectedId={sireId}
                        onSelect={setSireId}
                        pets={pets.filter(p => p.id !== damId)}
                      />

                      <div className="z-10 bg-slate-900 rounded-full p-2 border border-slate-700">
                          <Plus className="text-pink-500" />
                      </div>

                      <PetSelectSlot
                        label="Mẹ (Dam)"
                        selectedId={damId}
                        onSelect={setDamId}
                        pets={pets.filter(p => p.id !== sireId)}
                      />
                 </div>

                 <button
                    onClick={handleBreed}
                    disabled={isBreeding || !sireId || !damId}
                    className={`w-full max-w-xs py-4 rounded-xl font-bold text-lg shadow-lg transition-all text-white
                        ${isBreeding || !sireId || !damId
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:scale-105 hover:shadow-pink-500/20'}`}
                >
                    {isBreeding ? 'Đang ấp trứng...' : `LAI GIỐNG (-${BREEDING_FEE} Pi)`}
                </button>
                <p className="mt-4 text-xs text-slate-500 text-center max-w-xs">Ghép đôi 2 thú cưng để thừa hưởng gen tốt. Cần thời gian nghỉ ngơi giữa các lần lai giống.</p>
            </>
        )}
    </div>
  );
}

function ItemSlot({ type, selectedId, items, onSelect, label }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedItem = SHOP_ITEMS.find(i => i.id === selectedId);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-lg transition-all z-10 relative bg-slate-900
                ${selectedId ? 'border-green-500' : 'border-slate-600 hover:border-slate-400'}`}
            >
                {selectedItem ? <span className="text-2xl">{selectedItem.image}</span> : <Plus size={24} className="text-slate-500" />}
            </button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap">{label}</span>

            {isOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-lg p-2 w-48 shadow-xl z-50 flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {items.length === 0 ? (
                        <p className="text-xs text-center text-slate-500 p-2">Không có vật phẩm.</p>
                    ) : (
                        <>
                            <button onClick={() => { onSelect(null); setIsOpen(false); }} className="text-xs text-red-400 p-2 hover:bg-slate-700 rounded text-left w-full">Bỏ chọn</button>
                            {items.map((i: any) => (
                                <button key={i.id} onClick={() => { onSelect(i.id); setIsOpen(false); }} className="flex items-center gap-2 p-2 hover:bg-slate-700 rounded transition-colors text-left w-full">
                                    <span className="text-lg">{i.image}</span>
                                    <div className="flex flex-col"><span className="text-xs font-bold text-white">{i.name}</span><span className="text-[10px] text-slate-400">x{useGameStore.getState().inventory[i.id]}</span></div>
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}
            {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
        </div>
    )
}

function PetSelectSlot({ label, selectedId, onSelect, pets }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedPet = pets.find((p: Pet) => p.id === selectedId);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center shadow-lg transition-all z-10 relative bg-slate-900
                ${selectedId ? 'border-pink-500' : 'border-slate-600 hover:border-slate-400'}`}
            >
                {selectedPet ? (
                    <div className="flex flex-col items-center">
                        <span className="text-2xl">
                        {selectedPet.element === 'fire' ? '🐲' : selectedPet.element === 'water' ? '🦈' : selectedPet.element === 'wood' ? '🐺' : selectedPet.element === 'metal' ? '🦅' : '🐢'}
                        </span>
                        <span className="text-[8px] mt-1 max-w-[60px] truncate">{selectedPet.name}</span>
                    </div>
                ) : <Plus size={24} className="text-slate-500" />}
            </button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap">{label}</span>

            {isOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-lg p-2 w-56 shadow-xl z-50 flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {pets.length === 0 ? (
                        <p className="text-xs text-center text-slate-500 p-2">Không có thú cưng khả dụng.</p>
                    ) : (
                        <>
                            <button onClick={() => { onSelect(null); setIsOpen(false); }} className="text-xs text-red-400 p-2 hover:bg-slate-700 rounded text-left w-full">Bỏ chọn</button>
                            {pets.map((p: any) => (
                                <button key={p.id} onClick={() => { onSelect(p.id); setIsOpen(false); }} className="flex items-center gap-2 p-2 hover:bg-slate-700 rounded transition-colors text-left w-full border-b border-slate-700/50 last:border-0">
                                    <span className="text-lg">{p.element === 'fire' ? '🐲' : p.element === 'water' ? '🦈' : p.element === 'wood' ? '🐺' : p.element === 'metal' ? '🦅' : '🐢'}</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white">{p.name}</span>
                                        <span className="text-[10px] text-slate-400">Power: {p.stats.str+p.stats.int+p.stats.spd+p.stats.vit}</span>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}
            {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
        </div>
    )
}
