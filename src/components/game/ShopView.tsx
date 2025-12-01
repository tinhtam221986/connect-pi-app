import { useGameStore, SHOP_ITEMS } from "./store";
import { toast } from "sonner";

export function ShopView() {
  const buyItem = useGameStore(state => state.buyItem);
  const inventory = useGameStore(state => state.inventory);

  const handleBuy = (item: any) => {
      const success = buyItem(item.id, item.price);
      if (success) {
          toast.success(`Đã mua ${item.name}!`);
      } else {
          toast.error("Không đủ Pi!");
      }
  };

  return (
    <div className="h-full overflow-y-auto p-4 pb-20">
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-white">Cửa Hàng Vật Phẩm</h2>
            <p className="text-slate-400 text-sm">Mua nguyên liệu để lai tạo thú cưng.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {SHOP_ITEMS.map(item => (
                <div key={item.id} className="bg-slate-800 rounded-xl p-4 flex gap-4 border border-slate-700 shadow-sm">
                    <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-3xl shrink-0">
                        {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate">{item.name}</h3>
                        <p className="text-xs text-slate-400 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-yellow-400 font-bold">{item.price} Pi</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 hidden sm:inline-block">Đang có: {inventory[item.id] || 0}</span>
                                <button
                                    onClick={() => handleBuy(item)}
                                    className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-full transition-colors active:scale-95"
                                >
                                    Mua
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
