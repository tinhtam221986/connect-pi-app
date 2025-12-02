"use client";

import { apiClient } from "@/lib/api-client";
import { useLanguage } from "@/components/i18n/language-provider";
import { useEffect, useState } from "react";
import { ShoppingBag, Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";

export function MarketplaceView() {
    const { t } = useLanguage();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMarket() {
            try {
                const data = await apiClient.market.getListings();
                if (Array.isArray(data)) setItems(data);
            } catch (e) {
                console.error(e);
                toast.error("Failed to load marketplace");
            } finally {
                setLoading(false);
            }
        }
        fetchMarket();
    }, []);

    const handleBuy = async (item: any) => {
        toast.info(`Buying ${item.name} for ${item.price} Pi...`);
        // Mock payment flow
        setTimeout(() => {
            toast.success("Purchase successful! Item added to inventory.");
        }, 1500);
    };

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;

    return (
        <div className="h-full bg-black p-4 overflow-y-auto pb-24">
            <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="text-purple-400" size={28} />
                <h1 className="text-2xl font-bold text-white">Marketplace</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                        <div className="h-32 bg-gray-800 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white uppercase font-bold">
                                {item.category}
                            </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <h3 className="font-bold text-white text-sm line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-gray-400 mb-3">@{item.seller}</p>

                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-purple-300 font-bold flex items-center gap-1">
                                    <DollarSign size={12} /> {item.price} Pi
                                </span>
                                <button
                                    onClick={() => handleBuy(item)}
                                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center text-gray-500 mt-10">No items found.</div>
            )}
        </div>
    );
}
