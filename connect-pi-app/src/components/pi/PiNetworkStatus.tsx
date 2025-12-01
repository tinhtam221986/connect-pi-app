"use client";

import { usePi } from "@/components/pi/pi-provider";
import { BadgeCheck, Loader2, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/i18n/language-provider";

export function PiNetworkStatus() {
  const { isInitialized, isMock, error } = usePi();
  const { t } = useLanguage();
  const [show, setShow] = useState(true);

  if (!show) return null;

  if (error) {
    return (
      <div className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-950/90 text-red-200 px-4 py-1.5 rounded-full text-xs font-bold border border-red-500/50 shadow-lg shadow-red-900/20 z-50 backdrop-blur-md animate-in slide-in-from-top-5 whitespace-nowrap">
        <WifiOff size={14} />
        <span>{t('status.error')}</span>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-yellow-950/90 text-yellow-200 px-4 py-1.5 rounded-full text-xs font-bold border border-yellow-500/50 shadow-lg shadow-yellow-900/20 z-50 backdrop-blur-md animate-pulse whitespace-nowrap">
        <Loader2 size={14} className="animate-spin" />
        <span>{t('status.searching')}</span>
      </div>
    );
  }

  if (isMock) {
    return (
      <div className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-blue-950/90 text-blue-200 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/50 shadow-lg shadow-blue-900/20 z-50 backdrop-blur-md whitespace-nowrap">
        <Wifi size={14} />
        <span>{t('status.mock')}</span>
      </div>
    );
  }

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-950/90 text-green-200 px-4 py-1.5 rounded-full text-xs font-bold border border-green-500/50 shadow-lg shadow-green-900/20 z-50 backdrop-blur-md animate-in slide-in-from-top-5 whitespace-nowrap">
      <BadgeCheck size={14} />
      <span>{t('status.connected')}</span>
    </div>
  );
}
