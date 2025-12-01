import { useGameStore } from "./store";
import { toast } from "sonner";
import { ShoppingBag, User } from "lucide-react";

export function MarketView() {
  const listings = useGameStore(state => state.marketListings);
  const buyPet = useGameStore(state => state.buyPet);
  const cancelListing = useGameStore(state => state.cancelListing);
  const piBalance = useGameStore(state => state.piBalance);

  const handleBuy = (listing: any) => {
      if (listing.sellerId === 'player') {
          cancelListing(listing.id);
          toast.info("Đã hủy bán thú cưng.");
          return;
      }

      if (piBalance < listing.price) {
          toast.error("Không đủ Pi!");
          return;
      }

      const success = buyPet(listing.id);
      if (success) toast.success(`Đã mua ${listing.pet.name}!`);
  };

  return (
    <div className="h-full overflow-y-auto p-4 pb-20">
        <h2 className="text-2xl font-bold mb-4 text-white">Chợ Thú Cưng</h2>

        {listings.length === 0 ? (
            <div className="text-center text-slate-500 mt-20">Chưa có thú cưng nào được bán.</div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {listings.map(listing => (
                    <div key={listing.id} className="bg-slate-800 rounded-xl p-4 flex gap-4 border border-slate-700 shadow-sm relative overflow-hidden">
                        {/* Element Background Glow */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${getElementColor(listing.pet.element)}-500/20 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none`} />

                        <div className="w-20 h-20 bg-black/40 rounded-lg flex items-center justify-center text-4xl shrink-0 z-10">
                            {getElementIcon(listing.pet.element)}
                        </div>
                        <div className="flex-1 min-w-0 z-10">
                            <div className="flex justify-between">
                                <h3 className="font-bold text-white truncate">{listing.pet.name}</h3>
                                <span className="text-xs font-mono text-slate-400">STR {listing.pet.stats.str}</span>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                                <User size={12} />
                                <span>{listing.sellerId === 'player' ? 'Bạn' : listing.sellerId}</span>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <span className="text-yellow-400 font-bold text-lg">{listing.price} Pi</span>
                                <button
                                    onClick={() => handleBuy(listing)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        listing.sellerId === 'player'
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20'
                                    }`}
                                >
                                    {listing.sellerId === 'player' ? 'Hủy Bán' : 'Mua Ngay'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}

function getElementColor(element: string) {
    switch(element) {
        case 'fire': return 'red';
        case 'water': return 'blue';
        case 'wood': return 'green';
        case 'metal': return 'gray';
        case 'earth': return 'amber';
        default: return 'purple';
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
