"use client";

import { useState } from "react";
import { usePi } from "@/components/pi/pi-provider";
import { MOCK_USERS } from "@/lib/mock-data";
import { BadgeCheck, Settings, GripVertical, Award, Globe } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { ThemeCustomizer } from "@/components/ui/theme-customizer";
import { ProfileFrame } from "./ProfileFrame";

import { useEconomy } from "@/components/economy/EconomyContext";

export function UserProfile() {
    const { user } = usePi();
    const { t, language, setLanguage } = useLanguage();
    const { inventory } = useEconomy();
    const [showSettings, setShowSettings] = useState(false);
    const [activeTab, setActiveTab] = useState<'video'|'liked'|'inventory'>('video');

    const mockUser = MOCK_USERS[0];
    const username = user?.username || mockUser.username;
    const userLevel = 42; // Mock level
    
    const toggleLanguage = () => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
    }

    return (
        <div className="h-full overflow-y-auto bg-black pb-20 relative">
             {/* Theme Customizer Modal */}
             {showSettings && <ThemeCustomizer onClose={() => setShowSettings(false)} />}

             {/* Header */}
             <div className="flex justify-between items-center p-4 sticky top-0 bg-black/80 backdrop-blur-md z-10">
                <span className="font-bold text-lg">{username}</span>
                <div className="flex gap-4 items-center">
                    <button 
                        onClick={toggleLanguage} 
                        className="flex items-center gap-1 text-xs font-bold bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors border border-gray-700"
                    >
                        <Globe size={14} className="text-blue-400" />
                        {language === 'vi' ? 'VN' : 'EN'}
                    </button>
                    <button onClick={() => setShowSettings(true)}>
                        <Settings size={20} className="cursor-pointer hover:text-gray-300" />
                    </button>
                </div>
             </div>

             {/* Profile Info */}
             <div className="flex flex-col items-center gap-4 mt-4 px-4">
                <div className="relative">
                     <ProfileFrame
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                        level={userLevel}
                        size={120}
                     />
                     <div className="absolute bottom-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border-2 border-black shadow-lg translate-y-1">
                        <Award size={10} />
                        LVL {userLevel}
                     </div>
                </div>
                
                <h2 className="text-xl font-bold flex items-center gap-1 mt-2">
                    @{username} <BadgeCheck size={16} className="text-blue-500" />
                </h2>
                
                {/* Stats */}
                <div className="flex items-center gap-8 text-center w-full justify-center">
                    <div className="flex flex-col items-center">
                        <span className="block font-bold text-lg">142</span>
                        <span className="text-xs text-gray-400">{t('profile.following')}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="block font-bold text-lg">{mockUser.followers}</span>
                        <span className="text-xs text-gray-400">{t('profile.followers')}</span>
                    </div>
                    <div className="flex flex-col items-center">
                         <span className="block font-bold text-lg">5.2k</span>
                         <span className="text-xs text-gray-400">{t('profile.likes')}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-2 w-full max-w-xs">
                    <button className="flex-1 py-2 bg-pink-600 rounded-md font-semibold text-sm hover:bg-pink-700 transition-colors">{t('profile.edit')}</button>
                    <button className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"><GripVertical size={20}/></button>
                </div>
                
                <p className="text-sm text-center text-gray-300 max-w-sm">
                    {mockUser.bio}
                </p>
             </div>

             {/* Tabs */}
             <div className="flex justify-around border-t border-gray-800 mt-8 sticky top-14 bg-black z-10">
                 <button onClick={() => setActiveTab('video')} className={`flex-1 py-3 text-center font-bold text-sm ${activeTab === 'video' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}>{t('profile.tab_video')}</button>
                 <button onClick={() => setActiveTab('inventory')} className={`flex-1 py-3 text-center font-bold text-sm ${activeTab === 'inventory' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}>Inventory</button>
                 <button onClick={() => setActiveTab('liked')} className={`flex-1 py-3 text-center font-bold text-sm ${activeTab === 'liked' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}>{t('profile.tab_liked')}</button>
             </div>

             {/* Grid */}
             <div className="min-h-[300px] bg-black">
                 {activeTab === 'inventory' ? (
                     <div className="grid grid-cols-4 gap-2 p-2">
                         {inventory.map((item, idx) => (
                             <div key={idx} className="aspect-square bg-gray-900 rounded-lg flex flex-col items-center justify-center border border-gray-800 relative">
                                 <span className="text-2xl">{item.image}</span>
                                 <span className="text-[10px] text-gray-400 mt-1 text-center line-clamp-1 px-1">{item.name}</span>
                                 <span className="absolute top-1 right-1 bg-blue-600 text-xs rounded-full px-1.5 min-w-[20px] text-center">{item.quantity}</span>
                             </div>
                         ))}
                         {inventory.length === 0 && <div className="col-span-4 text-center text-gray-500 py-8">Empty Inventory</div>}
                     </div>
                 ) : (
                     <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                         {[1,2,3,4,5,6,7,8,9].map((i) => (
                             <div key={i} className="aspect-[3/4] bg-gray-900 relative group cursor-pointer hover:opacity-90">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold group-hover:text-gray-500 transition-colors">
                                    VIDEO
                                </div>
                             </div>
                         ))}
                     </div>
                 )}
             </div>
        </div>
    )
}
