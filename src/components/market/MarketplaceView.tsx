"use client";

import { useState } from "react";
import { useEconomy } from "@/components/economy/economy-provider";
import { usePiPayment } from "@/hooks/use-pi-payment";
import { useLanguage } from "@/components/i18n/language-provider";
import { ShoppingBag, Star, Zap, Crown, Filter, Search, Loader2, Palette, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function MarketplaceView() {
    const { t } = useLanguage();
    const { inventory, buyItem: economyBuy } = useEconomy();
    const { createPayment, loading } = usePiPayment();
    const [category, setCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const items = [
        { id: "frame_gold", name: "Gold Frame", price: 500, type: "frame", icon: <Crown size={32} className="text-yellow-500" />, desc: "Exclusive Level 50+ Frame" },
        { id: "frame_neon", name: "Neon Frame", price: 300, type: "frame", icon: <Shield size={32} className="text-cyan-500" />, desc: "Cyberpunk aesthetic border" },
        { id: "boost_10x", name: "10x Boost", price: 100, type: "boost", icon: <Zap size={32} className="text-blue-500" />, desc: "Boost your video reach" },
        { id: "boost_live", name: "Live Promo", price: 200, type: "boost", icon: <Zap size={32} className="text-red-500" />, desc: "Featured on Live tab" },
        { id: "theme_neon", name: "Neon Theme", price: 250, type: "theme", icon: <Palette size={32} className="text-pink-500" />, desc: "Unlock Neon Dark Mode" },
        { id: "theme_gold", name: "Luxury Theme", price: 1000, type: "theme", icon: <Star size={32} className="text-yellow-400" />, desc: "Gold-accented interface" },
    ];

    const filteredItems = items.filter(item =>
        (category === "all" || item.type === category) &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBuy = async (item: any) => {
        if (inventory.includes(item.id)) {
            toast.info("You already own this item.");
            return;
        }

        // Initiate Pi Payment
        await createPayment(item.price, `Buy ${item.name}`, { itemId: item.id }, () => {
            // On Success: Update Local Economy (deduct mock balance to keep sync, or just add to inventory)
            // Since usePiPayment simulates real spending, we should ensure local mock balance reflects it if we are treating it as the wallet.
            economyBuy(item.id, item.price, item.name);
        });
    }

    return (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mt-6 min-h-[400px] flex flex-col">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-white text-lg flex items-center gap-2">
                     <ShoppingBag size={24} className="text-purple-500" /> {t('market.title')}
                 </h3>
                 {loading && <div className="flex items-center gap-2 text-yellow-500 text-sm"><Loader2 size={16} className="animate-spin" /> Processing...</div>}
             </div>

             {/* Search & Filter */}
             <div className="flex gap-2 mb-6">
                 <div className="flex-1 relative">
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                     <input
                        className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                 </div>
                 <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
                     {['all', 'frame', 'boost', 'theme'].map(c => (
                         <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-colors ${category === c ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                         >
                             {c}
                         </button>
                     ))}
                 </div>
             </div>

             {/* Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                 <AnimatePresence mode="popLayout">
                     {filteredItems.map(item => {
                         const owned = inventory.includes(item.id);
                         return (
                             <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={item.id}
                                className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors flex flex-col justify-between"
                             >
                                 <div className="flex items-start gap-4">
                                     <div className="w-14 h-14 bg-gray-700/50 rounded-full flex items-center justify-center border border-gray-600">
                                         {item.icon}
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-white">{item.name}</h4>
                                         <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                                         <span className="inline-block mt-2 text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300 capitalize">{item.type}</span>
                                     </div>
                                 </div>

                                 <button
                                    onClick={() => handleBuy(item)}
                                    disabled={owned || loading}
                                    className={`w-full mt-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                        owned
                                        ? 'bg-green-900/50 text-green-400 cursor-default border border-green-900'
                                        : 'bg-white text-black hover:bg-gray-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                                 >
                                     {owned ? (
                                         <>✓ Owned</>
                                     ) : (
                                         <>{loading ? <Loader2 size={14} className="animate-spin" /> : 'Buy for'} {item.price} Pi</>
                                     )}
                                 </button>
                             </motion.div>
                         )
                     })}
                 </AnimatePresence>
                 {filteredItems.length === 0 && (
                     <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-10">
                         <Filter size={48} className="mb-2 opacity-20" />
                         <p>No items found.</p>
                     </div>
                 )}
             </div>
        </div>
    )
}
