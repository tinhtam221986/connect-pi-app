"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { useState } from "react";
import { ShoppingBag, Star, Zap, Search } from "lucide-react";
import { toast } from "sonner";
import { usePiPayment } from "@/hooks/use-pi-payment"; // We will create this next
import { cn } from "@/lib/utils";

export default function MarketplaceView() {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");

    const { purchase, loading } = usePiPayment();

    const filteredProducts = MOCK_PRODUCTS.filter(p => {
        if (activeCategory !== "all" && p.category !== activeCategory) return false; // Assuming mock data has category, if not we will fix
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const handleBuy = async (product: any) => {
        await purchase(product);
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 pb-safe safe-area-bottom">
            {/* Header */}
            <div className="p-4 bg-gray-900 sticky top-0 z-10 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        {t('market.title')}
                    </h2>
                    <div className="p-2 bg-gray-800 rounded-full">
                        <ShoppingBag className="text-yellow-500" size={20} />
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-yellow-500 outline-none"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {['all', 'digital', 'physical', 'boost'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-colors",
                                activeCategory === cat
                                    ? "bg-yellow-500 text-black"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 pb-24">
                {filteredProducts.map(p => (
                    <div key={p.id} className="bg-gray-800 rounded-xl p-3 flex flex-col gap-2 shadow-lg border border-gray-700/50 hover:border-yellow-500/50 transition-all">
                        <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-4xl relative overflow-hidden group">
                            <span className="group-hover:scale-110 transition-transform">{p.image}</span>

                            {/* Rarity Badge Mock */}
                            <div className="absolute top-2 right-2">
                                <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/50">
                                    Rare
                                </span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-sm truncate text-gray-100">{p.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                <span>4.8</span>
                                <span className="text-gray-600">•</span>
                                <span>{p.seller}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-1">
                            <span className="text-yellow-400 font-bold text-lg">{p.price} <span className="text-xs">Pi</span></span>
                            <button
                                onClick={() => handleBuy(p)}
                                disabled={loading}
                                className="p-2 bg-yellow-500 rounded-lg text-black hover:bg-yellow-400 active:scale-95 transition-all shadow-lg shadow-yellow-900/20 disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? <span className="animate-spin text-xs">...</span> : <Zap size={16} fill="currentColor" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
