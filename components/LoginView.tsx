"use client";

import { usePi } from "@/components/pi/pi-provider";
import { PiNetworkStatus } from "@/components/pi/PiNetworkStatus";
import { Loader2, Zap, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import Link from "next/link";

export default function LoginView() {
  const { authenticate, isInitialized, error, forceMock } = usePi();
  const { t } = useLanguage();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleLogin = async () => {
    if (!isInitialized) return;
    if (!isAgreed) return alert("Please agree to the terms below to continue.");
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
                <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg text-red-200 text-sm flex items-center gap-2">
                    <AlertTriangle size={24} className="shrink-0" />
                    <div>
                        <span className="font-bold">Error:</span> {error}
                        {error.toLowerCase().includes("time") && (
                            <div className="text-xs mt-2 bg-black/30 p-2 rounded">
                                <span className="font-bold">Suggestion:</span> Please verify your "Trusted Domain" in the Pi Developer Portal (whitelist <span className="font-mono text-yellow-300">localhost:3000</span> or your Vercel URL).
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleLogin}
                        className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors"
                    >
                        Retry Login
                    </button>
                    <button
                        onClick={forceMock}
                        className="flex-1 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-900/50 rounded-lg text-xs font-medium transition-colors"
                    >
                        Force Mock Mode (Dev)
                    </button>
                </div>
            </div>
          )}

          <button 
            onClick={handleLogin}
            disabled={!isInitialized || isLoggingIn || !isAgreed}
            className={`group relative w-full h-14 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none overflow-hidden`}
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

          {/* Compliance Gate - Integrated Below Button */}
          <div className="pt-2">
               <label className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                    <div className="relative flex items-center pt-1">
                        <input
                            type="checkbox"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/30 bg-black/40 checked:border-purple-500 checked:bg-purple-500 transition-all"
                        />
                         <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[30%] opacity-0 peer-checked:opacity-100 text-white">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>
                    <div className="text-xs text-gray-300 leading-relaxed">
                        By logging in, I agree to the <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>, <Link href="/whitepaper" className="text-purple-400 hover:underline">Whitepaper</Link>, and <Link href="/terms" className="text-purple-400 hover:underline">Disclaimer</Link>. I understand this is a Web3 application on the Pi Network.
                    </div>
               </label>
          </div>

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
      
      <div className="absolute bottom-4 z-10 flex flex-col items-center gap-2">
         <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={14} />
            <span>Secure Pi Network Connection</span>
         </div>
         <div className="text-[10px] text-gray-600">
            {t('login.version')}
         </div>
      </div>
    </div>
  );
}
