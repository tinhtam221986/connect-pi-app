"use client";

import { useEconomy } from "@/components/economy/economy-provider";
import { useLanguage } from "@/components/i18n/language-provider";
import { ShoppingBag, Star, Zap, Crown } from "lucide-react";

export function Marketplace() {
    const { t } = useLanguage();
    const { balance, buyItem, inventory } = useEconomy();

    const items = [
        { id: "frame_gold", name: "Gold Frame", price: 500, icon: <Crown size={32} className="text-yellow-500" />, desc: "Exclusive Level 50+ Frame" },
        { id: "boost_10x", name: "10x Boost", price: 100, icon: <Zap size={32} className="text-blue-500" />, desc: "Boost your video reach" },
        { id: "theme_neon", name: "Neon Theme", price: 250, icon: <Star size={32} className="text-pink-500" />, desc: "Unlock Neon Dark Mode" },
    ];

    return (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mt-6">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <ShoppingBag size={20} className="text-purple-500" /> Marketplace
             </h3>
             <div className="grid grid-cols-1 gap-4">
                 {items.map(item => {
                     const owned = inventory.includes(item.id);
                     return (
                         <div key={item.id} className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                     {item.icon}
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-sm">{item.name}</h4>
                                     <p className="text-xs text-gray-400">{item.desc}</p>
                                 </div>
                             </div>
                             <button
                                onClick={() => buyItem(item.id, item.price, item.name)}
                                disabled={owned || balance < item.price}
                                className={`px-4 py-2 rounded-lg text-xs font-bold ${owned ? 'bg-green-900 text-green-400' : 'bg-white text-black hover:bg-gray-200 disabled:opacity-50'}`}
                             >
                                 {owned ? "Owned" : `${item.price} Pi`}
                             </button>
                         </div>
                     )
                 })}
             </div>
        </div>
    )
}
