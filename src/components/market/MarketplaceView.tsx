"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useLanguage } from "@/components/i18n/language-provider";
import { ShoppingBag, Search, Filter } from "lucide-react";
import { toast } from "sonner";

export function MarketplaceView() {
    const { t } = useLanguage();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const res = await apiClient.market.getListings();
            if (res.success) setItems(res.items);
        } catch (e) {
            toast.error("Failed to load market");
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (item: any) => {
        try {
            const res = await apiClient.market.buy(item.id);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.error);
            }
        } catch (e) {
            toast.error("Purchase failed");
        }
    };

    return (
        <div className="h-full bg-black text-white flex flex-col pb-20 overflow-y-auto">
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
                 <h2 className="font-bold text-xl flex items-center gap-2">
                     <ShoppingBag size={20} className="text-pink-500" /> {t('market.title')}
                 </h2>
                 {/* Search Bar */}
                 <div className="mt-2 flex gap-2">
                     <div className="flex-1 bg-gray-800 rounded-lg flex items-center px-3 py-2">
                         <Search size={16} className="text-gray-400 mr-2" />
                         <input className="bg-transparent outline-none text-sm w-full" placeholder="Search items..." />
                     </div>
                     <button className="p-2 bg-gray-800 rounded-lg"><Filter size={18} /></button>
                 </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
                {loading ? <p className="text-center w-full text-gray-500 mt-4">Loading items...</p> : items.map(item => (
                    <div key={item.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group">
                        <div className="aspect-square bg-gray-800 relative">
                            {/* Use simple placeholder if image fails, but mocked items have valid-ish URLs */}
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold uppercase backdrop-blur-sm">{item.type}</div>
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-sm truncate">{item.name}</h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-yellow-500 font-bold">{item.price} Pi</span>
                                <button
                                    onClick={() => handleBuy(item)}
                                    className="px-3 py-1 bg-pink-600 rounded-full text-xs font-bold hover:bg-pink-500 transition-colors"
                                >
                                    {t('market.buy_now')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
