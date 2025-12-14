"use client";

import { useState } from "react";
import { usePi } from "@/components/pi/pi-provider";
import { MOCK_USERS } from "@/lib/mock-data";
import { BadgeCheck, Settings, GripVertical, Award, Globe, Play, Lock, Heart, Gamepad2, Grid } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { ThemeCustomizer } from "@/components/ui/theme-customizer";
import { ProfileFrame } from "./ProfileFrame";
import { useEconomy } from "@/components/economy/EconomyContext";

type ProfileTab = 'videos' | 'liked' | 'saved' | 'games';

export function UserProfile() {
    const { user } = usePi();
    const { myVideos } = useEconomy();
    const { t, language, setLanguage } = useLanguage();
    const [showSettings, setShowSettings] = useState(false);
    const [activeTab, setActiveTab] = useState<ProfileTab>('videos');
    const [isEditing, setIsEditing] = useState(false);

    const mockUser = MOCK_USERS[0];
    const username = user?.username || mockUser.username;
    const userLevel = 42;
    
    const toggleLanguage = () => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
    }

    const renderTabContent = () => {
        switch(activeTab) {
            case 'videos':
                return (
                    <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                        {myVideos.length > 0 ? myVideos.map((video) => (
                             <div key={video.id} className="aspect-[3/4] bg-gray-900 relative group cursor-pointer hover:opacity-90">
                                <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                                <div className="absolute bottom-1 right-1 flex items-center gap-1 text-[10px] text-white font-bold drop-shadow-md">
                                    <Play size={10} fill="currentColor" />
                                    <span>{video.likes}</span>
                                </div>
                             </div>
                        )) : (
                            <div className="col-span-3 py-10 text-center text-gray-500">No videos yet</div>
                        )}
                    </div>
                );
            case 'liked':
                return <div className="py-20 text-center text-gray-500 text-sm">Videos you liked will appear here</div>;
            case 'saved':
                return <div className="py-20 text-center text-gray-500 text-sm">Saved posts will appear here</div>;
            case 'games':
                return (
                    <div className="p-4 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Gamepad2 size={16}/> My Games</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {[1].map(i => (
                                    <div key={i} className="min-w-[100px] aspect-square bg-purple-900/20 border border-purple-500/30 rounded-xl flex flex-col items-center justify-center gap-2">
                                        <div className="w-10 h-10 bg-purple-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs">Pet Raise</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="text-sm font-bold text-white mb-3">Top Games</h3>
                            <div className="space-y-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className="flex gap-3 items-center bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                                        <div>
                                            <div className="font-bold text-sm">Space Miner {i}</div>
                                            <div className="text-xs text-gray-500">Play & Earn</div>
                                        </div>
                                        <button className="ml-auto px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold hover:bg-white/20">Play</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-black pb-20 relative">
             {showSettings && <ThemeCustomizer onClose={() => setShowSettings(false)} />}

             {/* Edit Profile Modal Placeholder */}
             {isEditing && (
                 <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setIsEditing(false)}>
                     <div className="bg-gray-900 w-full max-w-sm rounded-2xl p-6 border border-gray-800" onClick={e => e.stopPropagation()}>
                         <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="text-xs text-gray-400">Phone</label>
                                 <input type="tel" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-sm" placeholder="+84..." />
                             </div>
                              <div>
                                 <label className="text-xs text-gray-400">Email</label>
                                 <input type="email" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-sm" placeholder="email@example.com" />
                             </div>
                             <div className="flex gap-2 mt-6">
                                 <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-gray-800 rounded-lg text-sm">Cancel</button>
                                 <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-purple-600 rounded-lg text-sm font-bold">Save</button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}

             {/* Header */}
             <div className="flex justify-between items-center p-4 sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800/50">
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
             <div className="flex flex-col items-center gap-4 mt-6 px-4">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                     <ProfileFrame
                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                        level={userLevel}
                        size={100}
                     />
                     <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-white">CHANGE</span>
                     </div>
                     <div className="absolute -bottom-2 right-0 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-black shadow-lg">
                        LVL {userLevel}
                     </div>
                     {/* Hidden File Input for Avatar Upload */}
                     <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                            if (e.target.files?.[0]) {
                                const file = e.target.files[0];
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('upload_preset', 'Connect_pi_app'); // Using same preset for now

                                toast.loading("Updating avatar...");
                                try {
                                    // Direct upload to Cloudinary for speed/simplicity
                                    const res = await fetch(`https://api.cloudinary.com/v1_1/dv1hnl0wo/image/upload`, {
                                        method: 'POST',
                                        body: formData
                                    });
                                    const data = await res.json();

                                    if (data.secure_url) {
                                        // Update profile in backend
                                        await apiClient.user.updateProfile({ avatar: data.secure_url });
                                        toast.success("Avatar updated!");
                                        window.location.reload(); // Simple reload to reflect changes
                                    }
                                } catch (err) {
                                    toast.error("Failed to update avatar");
                                }
                            }
                        }}
                     />
                </div>
                
                <div className="text-center">
                    <h2 className="text-xl font-bold flex items-center justify-center gap-1">
                        @{username} <BadgeCheck size={16} className="text-blue-500" />
                    </h2>
                     <p className="text-sm text-gray-400 max-w-xs mt-1 line-clamp-2">
                        {mockUser.bio}
                    </p>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-10 text-center w-full justify-center py-2">
                    <div className="flex flex-col items-center">
                        <span className="block font-bold text-lg">142</span>
                        <span className="text-xs text-gray-500">Following</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="block font-bold text-lg">{mockUser.followers}</span>
                        <span className="text-xs text-gray-500">Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                         <span className="block font-bold text-lg">5.2k</span>
                         <span className="text-xs text-gray-500">Likes</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-2 w-full max-w-xs">
                    <button onClick={() => setIsEditing(true)} className="flex-1 py-2.5 bg-gray-800 border border-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">Edit Profile</button>
                    <button className="p-2.5 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors"><GripVertical size={20}/></button>
                </div>
             </div>

             {/* Tabs */}
             <div className="flex justify-around border-b border-gray-800 mt-6 sticky top-14 bg-black z-10">
                 <button onClick={() => setActiveTab('videos')} className={`flex-1 py-3 flex justify-center ${activeTab === 'videos' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}>
                    <Grid size={20} />
                 </button>
                 <button onClick={() => setActiveTab('liked')} className={`flex-1 py-3 flex justify-center ${activeTab === 'liked' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}>
                    <Heart size={20} />
                 </button>
                  <button onClick={() => setActiveTab('saved')} className={`flex-1 py-3 flex justify-center ${activeTab === 'saved' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}>
                    <Lock size={20} />
                 </button>
                  <button onClick={() => setActiveTab('games')} className={`flex-1 py-3 flex justify-center ${activeTab === 'games' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}>
                    <Gamepad2 size={20} />
                 </button>
             </div>

             {/* Tab Content */}
             <div className="min-h-[300px]">
                {renderTabContent()}
             </div>
        </div>
    )
}
