"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";

const PiContext = createContext<any>(null);

export function PiSDKProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  // Hàm này giúp Pi SDK luôn sẵn sàng
  const onPiReady = () => {
    console.log("Pi SDK Loaded!");
  };

  return (
    <PiContext.Provider value={{ user, setUser }}>
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="beforeInteractive" // 🟢 Tải SDK ngay lập tức
        onLoad={onPiReady} 
      />
      {children}
    </PiContext.Provider>
  );
}
export const usePi = () => useContext(PiContext);
