import { useState } from "react";
import { useGameStore, SHOP_ITEMS } from "./store";
import { toast } from "sonner";
import { Dna, Plus } from "lucide-react";

export function LabView() {
  const inventory = useGameStore(state => state.inventory);
  const createPet = useGameStore(state => state.createPet);

  const [selectedEmbryo, setSelectedEmbryo] = useState<string | null>(null);
  const [selectedCrystal, setSelectedCrystal] = useState<string | null>(null);
  const [selectedMutagen, setSelectedMutagen] = useState<string | null>(null);
  const [isBreeding, setIsBreeding] = useState(false);

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

      // Animation delay
      setTimeout(() => {
          try {
              createPet({
                  embryoId: selectedEmbryo,
                  crystalId: selectedCrystal || undefined,
                  mutagenId: selectedMutagen || undefined
              });
              toast.success("Lai tạo thành công!");
              // Reset
              setSelectedEmbryo(null);
              setSelectedCrystal(null);
              setSelectedMutagen(null);
          } catch (e) {
              toast.error("Có lỗi xảy ra");
          } finally {
              setIsBreeding(false);
          }
      }, 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Phòng Thí Nghiệm</h2>

        {/* Main Breeding Circle */}
        <div className="relative w-64 h-64 mb-8 my-10">
            <div className={`absolute inset-0 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center ${isBreeding ? 'animate-spin' : ''}`} style={{ animationDuration: isBreeding ? '3s' : '0s' }}>
                 <Dna size={64} className="text-slate-600 opacity-20" />
            </div>

            {/* Embryo Slot (Center) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <ItemSlot
                    type="embryo"
                    selectedId={selectedEmbryo}
                    items={embryos}
                    onSelect={setSelectedEmbryo}
                    label="Phôi"
                />
            </div>

            {/* Crystal Slot (Top) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <ItemSlot
                    type="crystal"
                    selectedId={selectedCrystal}
                    items={crystals}
                    onSelect={setSelectedCrystal}
                    label="Hệ"
                />
            </div>

            {/* Mutagen Slot (Bottom) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                 <ItemSlot
                    type="mutagen"
                    selectedId={selectedMutagen}
                    items={mutagens}
                    onSelect={setSelectedMutagen}
                    label="Biến đổi"
                />
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
            {isBreeding ? 'Đang phân tích gen...' : 'TẠO HÓA'}
        </button>

        <div className="mt-8 text-center text-sm text-slate-400 max-w-xs">
            <p>Chọn nguyên liệu để bắt đầu. <br/>Phôi là bắt buộc. Tinh thể và Thuốc là tùy chọn.</p>
        </div>
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

            {/* Dropdown / Modal replacement */}
            {isOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-lg p-2 w-48 shadow-xl z-50 flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {items.length === 0 ? (
                        <p className="text-xs text-center text-slate-500 p-2">Không có vật phẩm. Hãy mua ở Cửa hàng.</p>
                    ) : (
                        <>
                            <button
                                onClick={() => { onSelect(null); setIsOpen(false); }}
                                className="text-xs text-red-400 p-2 hover:bg-slate-700 rounded text-left w-full"
                            >
                                Bỏ chọn
                            </button>
                            {items.map((i: any) => (
                                <button
                                    key={i.id}
                                    onClick={() => { onSelect(i.id); setIsOpen(false); }}
                                    className="flex items-center gap-2 p-2 hover:bg-slate-700 rounded transition-colors text-left w-full"
                                >
                                    <span className="text-lg">{i.image}</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white">{i.name}</span>
                                        <span className="text-[10px] text-slate-400">x{useGameStore.getState().inventory[i.id]}</span>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* Backdrop to close */}
            {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
        </div>
    )
}
