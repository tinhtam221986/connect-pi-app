"use client";

import { useState } from "react";
import { Search, ShoppingBag, Zap, Shirt, Box, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePiPayment } from "@/hooks/use-pi-payment";
import { toast } from "sonner";

const ITEMS = [
    { id: 1, name: "Giao diện Premium", price: 50, type: "digital", image: "🎨", seller: "ThemeMaster", rating: 4.8 },
    { id: 2, name: "Avatar 3D Độc Quyền", price: 100, type: "digital", image: "👾", seller: "CryptoQueen", rating: 4.8 },
    { id: 3, name: "Áo Thun CONNECT", price: 15, type: "physical", image: "👕", seller: "MerchShop", rating: 4.8 },
    { id: 4, name: "Tăng Tương Tác (Boost)", price: 10, type: "boost", image: "🚀", seller: "BoostService", rating: 4.8 },
    { id: 5, name: "Mũ Snapback", price: 12, type: "physical", image: "🧢", seller: "MerchShop", rating: 4.5 },
    { id: 6, name: "Khung Avatar Vàng", price: 25, type: "digital", image: "🖼️", seller: "ArtHouse", rating: 4.9 },
];

export function MarketplaceView() {
    const [category, setCategory] = useState("all");
    const [search, setSearch] = useState("");
    const { purchase, loading } = usePiPayment();

    const filteredItems = ITEMS.filter(item => {
        const matchCat = category === "all" || item.type === category;
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const handleBuy = (item: any) => {
        purchase(item);
    };

    return (
        <div className="h-full flex flex-col bg-gray-950 pb-20">
            {/* Header */}
            <header className="p-4 border-b border-gray-800 sticky top-0 bg-gray-950/95 backdrop-blur z-10">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        Marketplace
                    </h1>
                    <Button size="icon" variant="ghost" className="text-gray-400">
                        <ShoppingBag size={24} />
                    </Button>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <Input
                        placeholder="Search items..."
                        className="pl-10 bg-gray-900 border-gray-800 text-white focus:ring-yellow-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {["all", "digital", "physical", "boost"].map((cat) => (
                        <Button
                            key={cat}
                            variant={category === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategory(cat)}
                            className={`capitalize ${category === cat ? "bg-yellow-500 text-black hover:bg-yellow-400" : "border-gray-700 text-gray-300"}`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </header>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-all flex flex-col">
                        <div className="aspect-square bg-gray-800 flex items-center justify-center text-6xl relative">
                            {item.image}
                            <Badge className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                                Rare
                            </Badge>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <h3 className="font-bold text-white text-sm line-clamp-1">{item.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                                <span>⭐ {item.rating}</span>
                                <span>•</span>
                                <span>{item.seller}</span>
                            </div>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-yellow-400 font-bold text-lg">{item.price} <span className="text-xs">Pi</span></span>
                                <Button
                                    size="sm"
                                    className="h-8 w-8 rounded-full bg-yellow-500 text-black hover:bg-yellow-400 p-0"
                                    onClick={() => handleBuy(item)}
                                    disabled={loading}
                                >
                                    <Zap size={16} fill="currentColor" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
