"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";

const PiContext = createContext<any>(null);

export function PiSDKProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  const onPiReady = () => {
    try {
      const Pi = (window as any).Pi;
      // Khởi động Pi SDK
      Pi.init({ version: "2.0", sandbox: true });
      
      // Xin quyền lấy thông tin Username và Ví
      const scopes = ['username', 'payments'];
      
      // --- 🟢 LỆNH ĐĂNG NHẬP QUAN TRỌNG ---
      Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth: any) {
        console.log("Đăng nhập thành công!", auth);
        // Lưu thông tin người dùng vào biến user
        setUser(auth.user);
      }).catch(function(error: any) {
        console.error("Lỗi đăng nhập Pi:", error);
      });

    } catch (err) {
      console.error("Lỗi khởi động Pi:", err);
    }
  };

  const onIncompletePaymentFound = (payment: any) => {
    // Xử lý thanh toán chưa hoàn tất (Để sau)
    console.log("Tìm thấy thanh toán dở dang:", payment);
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
