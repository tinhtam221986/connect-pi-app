"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";

// Tạo kho chứa thông tin User
const PiContext = createContext<any>(null);

export function PiSDKProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  // Hàm này sẽ chạy khi Pi SDK tải xong
  const onPiReady = () => {
    try {
      const Pi = (window as any).Pi;
      Pi.init({ version: "2.0", sandbox: true }); // Chạy Sandbox để test
      
      // Xin quyền lấy thông tin
      const scopes = ['username', 'payments'];
      
      // Tự động đăng nhập (Sẽ hoàn thiện ở bước sau)
      // Pi.authenticate(scopes, onIncompletePaymentFound).then...
      
      console.log("Pi SDK đã sẵn sàng!");
    } catch (err) {
      console.error("Lỗi khởi động Pi:", err);
    }
  };

  return (
    <PiContext.Provider value={{ user, setUser }}>
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive" 
        onLoad={onPiReady} 
      />
      {children}
    </PiContext.Provider>
  );
}

export const usePi = () => useContext(PiContext);
