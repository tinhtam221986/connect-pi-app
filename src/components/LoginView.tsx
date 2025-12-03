"use client";

import { usePi } from "@/components/pi/pi-provider";
import { PiNetworkStatus } from "@/components/pi/PiNetworkStatus";
import { Loader2, Zap, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/i18n/language-provider";

export default function LoginView() {
  const { authenticate, isInitialized, error, forceMock } = usePi();
  const { t } = useLanguage();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!isInitialized) return;
    setIsLoggingIn(true);
    await authenticate();
    setIsLoggingIn(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <PiNetworkStatus />
      
      <div className="mb-12 text-center animate-in fade-in zoom-in duration-500 z-10">
        <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Zap size={32} className="text-white" fill="currentColor" />
            </div>
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-white drop-shadow-xl mb-2">
          CONNECT
        </h1>
        <p className="text-purple-200 text-lg font-medium tracking-wide uppercase">Web3 Video Social Network on Pi</p>
      </div>

      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 text-white shadow-2xl rounded-2xl overflow-hidden z-10 animate-in slide-in-from-bottom-10 duration-700 delay-100">
        <div className="p-8 text-center border-b border-gray-800">
          <h3 className="text-2xl font-bold">{t('login.welcome')}</h3>
          <p className="text-sm text-gray-400 mt-2">
            {t('login.desc')}
          </p>
        </div>
        <div className="p-8 space-y-6">
          
          {error && (
            <div className="flex flex-col gap-2">
                <div
                    onClick={forceMock}
                    className="cursor-pointer p-4 bg-red-950/50 border border-red-800 rounded-lg text-red-200 text-sm flex items-center gap-2 hover:bg-red-900/50 transition-colors"
                >
                    <AlertTriangle size={16} />
                    <div>
                        <span className="font-bold">Error:</span> {error}
                        <div className="text-xs opacity-70 mt-1">Tap here to force Mock Mode (Dev)</div>
                    </div>
                </div>
            </div>
          )}

          <button 
            onClick={handleLogin}
            disabled={!isInitialized || isLoggingIn}
            className="group relative w-full h-14 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative flex items-center justify-center gap-2">
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('login.authenticating')}
                </>
              ) : !isInitialized ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('login.loading')}
                </>
              ) : (
                <>
                  {t('login.btn')}
                </>
              )}
            </div>
          </button>

          <div className="flex justify-between items-center mt-4">
             <p className="text-xs text-center text-gray-500 leading-relaxed flex-1">
                {t('login.footer')}
             </p>
             <button
                onClick={forceMock}
                className="text-[10px] text-gray-700 hover:text-gray-500"
                title="Force Mock Mode"
             >
                DEV
             </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 text-xs text-gray-600 z-10">
         {t('login.version')}
      </div>
    </div>
  );
}
