"use client";

import { usePi } from "@/components/pi/pi-provider";
import { PiNetworkStatus } from "@/components/pi/PiNetworkStatus";
import { VideoFeed } from "@/components/feed/VideoFeed";
import { UserProfile } from "@/components/profile/UserProfile";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { Heart, Home, MessageCircle, PlusSquare, ShoppingBag, User, Wallet, CalendarCheck, Upload, Loader2, CheckCircle2, Gamepad2 } from "lucide-react";
import { GameCenterView } from "@/components/game/GameCenterView";
import { useXpStore } from "@/components/gamification/xp-store";
import PaymentTester from "@/components/PaymentTester";
import { useState, useRef, useEffect } from "react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { toast } from "sonner";
import { useLanguage } from "@/components/i18n/language-provider";

export default function MainAppView() {
  const { user } = usePi();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
      useXpStore.persist.rehydrate();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black text-white relative">
      <PiNetworkStatus />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "game" && <div className="absolute inset-0 z-50 bg-black"><GameCenterView onBackToMain={() => setActiveTab("home")} /></div>}

        {activeTab === "home" && <VideoFeed />}
        
        {activeTab === "market" && <MarketplaceView />}
        
        {activeTab === "create" && <CreateView />}
        
        {activeTab === "wallet" && <WalletView />}
        
        {activeTab === "profile" && <UserProfile />}
      </main>

      <AIAssistant />

      {/* Bottom Navigation */}
      {activeTab !== "game" && (
      <nav className="absolute bottom-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-800 flex justify-around py-2 z-30 pb-safe safe-area-bottom">
        <NavButton icon={<Home size={24} />} label={t('nav.home')} active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <NavButton icon={<Gamepad2 size={24} />} label="Game Center" active={activeTab === "game"} onClick={() => setActiveTab("game")} />
        
        {/* Center Create Button */}
        <div className="relative -top-6">
             <button 
                onClick={() => setActiveTab("create")}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 border-4 border-black transition-transform active:scale-95"
             >
                <PlusSquare size={28} className="text-white" />
             </button>
        </div>

        <NavButton icon={<Wallet size={24} />} label={t('nav.wallet')} active={activeTab === "wallet"} onClick={() => setActiveTab("wallet")} />
        <NavButton icon={<User size={24} />} label={t('nav.profile')} active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
      </nav>
      )}
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center gap-1 w-12 pt-1 ${active ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
        >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    )
}

function MarketplaceView() {
    const { t } = useLanguage();
    return (
        <div className="h-full overflow-y-auto p-4 pb-24 bg-gray-900">
             <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 sticky top-0 bg-gray-900 py-2 z-10">{t('market.title')}</h2>
             <div className="grid grid-cols-2 gap-4">
                 {MOCK_PRODUCTS.map(p => (
                     <div key={p.id} className="bg-gray-800 rounded-lg p-3 flex flex-col gap-2 shadow-lg">
                         <div className="aspect-square bg-gray-700 rounded-md flex items-center justify-center text-4xl">
                             {p.image}
                         </div>
                         <h3 className="font-bold text-sm truncate">{p.name}</h3>
                         <div className="flex justify-between items-center">
                             <span className="text-yellow-400 font-bold">{p.price} Pi</span>
                             <span className="text-xs text-gray-400">{p.seller}</span>
                         </div>
                         <button className="w-full py-2 bg-yellow-600 rounded text-xs font-bold mt-1 hover:bg-yellow-500 active:scale-95 transition-all">{t('market.buy_now')}</button>
                     </div>
                 ))}
             </div>
        </div>
    )
}

function WalletView() {
     const { t } = useLanguage();
     const [balance, setBalance] = useState(1250.00);
     const [checkedIn, setCheckedIn] = useState(false);

     const handleCheckIn = () => {
         if (checkedIn) return;
         toast.success(t('wallet.check_in_title') + "! +1.0 Pi");
         setBalance(prev => prev + 1);
         setCheckedIn(true);
     }

     return (
        <div className="h-full overflow-y-auto p-4 pb-24 bg-gray-950">
            <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-gray-950 py-2 z-10">{t('wallet.title')}</h2>
            
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 mb-6 shadow-xl border border-white/10">
                <p className="text-purple-200 text-sm mb-1">{t('wallet.balance')}</p>
                <h3 className="text-4xl font-bold text-white mb-4">{balance.toFixed(2)} <span className="text-lg text-purple-300">Pi</span></h3>
                <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold hover:bg-white/20 transition-colors border border-white/5">{t('wallet.send')}</button>
                    <button className="flex-1 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold hover:bg-white/20 transition-colors border border-white/5">{t('wallet.receive')}</button>
                </div>
            </div>

            {/* Daily Check-in Feature */}
            <div className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-800">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-white flex items-center gap-2">
                             <CalendarCheck size={18} className="text-yellow-400" /> {t('wallet.check_in_title')}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{t('wallet.check_in_desc')}</p>
                    </div>
                    <button 
                        onClick={handleCheckIn}
                        disabled={checkedIn}
                        className={`px-4 py-2 rounded-full font-bold text-sm ${checkedIn ? "bg-green-900 text-green-400" : "bg-yellow-500 text-black hover:bg-yellow-400"}`}
                    >
                        {checkedIn ? t('wallet.checked_in') : t('wallet.check_in_btn')}
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4">
                 <h4 className="font-bold mb-4 text-gray-300">{t('wallet.recent')}</h4>
                 <div className="flex flex-col gap-3">
                     {[1,2,3].map(i => (
                         <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-2 last:border-0">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-400">
                                     <Wallet size={18} />
                                 </div>
                                 <div>
                                     <p className="font-bold text-sm text-gray-200">{t('wallet.received_from')} @User{i}</p>
                                     <p className="text-xs text-gray-500">{t('wallet.today')}, 10:23 AM</p>
                                 </div>
                             </div>
                             <span className="text-green-400 font-bold text-sm">+ 50 Pi</span>
                         </div>
                     ))}
                 </div>
            </div>
            
            <div className="mt-8">
                 <h4 className="font-bold mb-2 text-gray-500">{t('wallet.dev_tools')}</h4>
                 <PaymentTester />
            </div>
        </div>
    )
}

function CreateView() {
    const { t } = useLanguage();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleStart = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            toast.info(t('create.uploading'));
            
            // Simulate upload
            let p = 0;
            const interval = setInterval(() => {
                p += 10;
                setProgress(p);
                if (p >= 100) {
                    clearInterval(interval);
                    setUploading(false);
                    toast.success(t('create.success'));
                }
            }, 300);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-900 p-8 text-center pb-20">
            <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
            
            {uploading ? (
                <div className="flex flex-col items-center gap-4">
                     <Loader2 size={48} className="text-purple-500 animate-spin" />
                     <h3 className="text-xl font-bold">{t('create.uploading')} {progress}%</h3>
                     <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                         <div className="h-full bg-purple-500 transition-all" style={{width: `${progress}%`}} />
                     </div>
                </div>
            ) : (
                <>
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6 animate-pulse">
                        <PlusSquare size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-white">{t('create.title')}</h2>
                    <p className="text-gray-400 mb-8 max-w-xs">{t('create.desc')}</p>
                    <button 
                        onClick={handleStart}
                        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform text-lg flex items-center gap-2"
                    >
                        <Upload size={20} /> {t('create.btn')}
                    </button>
                    <p className="mt-6 text-xs text-gray-600 uppercase tracking-widest">{t('create.permission')}</p>
                </>
            )}
        </div>
    )
}
