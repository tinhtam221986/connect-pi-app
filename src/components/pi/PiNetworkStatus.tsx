"use client";

import { usePi } from "@/components/pi/pi-provider";
import { BadgeCheck, Loader2, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function PiNetworkStatus() {
  const { isInitialized, isMock, error } = usePi();
  const [show, setShow] = useState(true);

  // Auto-hide after 5 seconds if connected successfully (to not annoy user), 
  // but keeping it always visible for "Mock" or "Error" might be better for dev.
  // The blueprint says "hiển thị rõ ràng quá trình kết nối".
  
  if (!show) return null;

  if (error) {
    return (
      <div className="fixed top-4 right-4 flex items-center gap-2 bg-red-950/90 text-red-200 px-4 py-2 rounded-full text-xs font-bold border border-red-500/50 shadow-lg shadow-red-900/20 z-50 backdrop-blur-md animate-in slide-in-from-top-5">
        <WifiOff size={16} />
        <span>Connection Failed</span>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="fixed top-4 right-4 flex items-center gap-2 bg-yellow-950/90 text-yellow-200 px-4 py-2 rounded-full text-xs font-bold border border-yellow-500/50 shadow-lg shadow-yellow-900/20 z-50 backdrop-blur-md animate-pulse">
        <Loader2 size={16} className="animate-spin" />
        <span>Searching Pi Network...</span>
      </div>
    );
  }

  if (isMock) {
    return (
      <div className="fixed top-4 right-4 flex items-center gap-2 bg-blue-950/90 text-blue-200 px-4 py-2 rounded-full text-xs font-bold border border-blue-500/50 shadow-lg shadow-blue-900/20 z-50 backdrop-blur-md">
        <Wifi size={16} />
        <span>Dev Mode (Mock)</span>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 bg-green-950/90 text-green-200 px-4 py-2 rounded-full text-xs font-bold border border-green-500/50 shadow-lg shadow-green-900/20 z-50 backdrop-blur-md animate-in slide-in-from-top-5">
      <BadgeCheck size={16} />
      <span>Pi Network Connected</span>
    </div>
  );
}
