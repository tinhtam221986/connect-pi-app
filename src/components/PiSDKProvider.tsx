"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";

const PiContext = createContext<any>(null);

export function PiSDKProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  const onPiReady = () => {
    try {
      const Pi = (window as any).Pi;
      Pi.init({ version: "2.0", sandbox: true }); // Chạy Sandbox
      
      // Xin quyền
      const scopes = ['username', 'payments'];
      
      // Lệnh đăng nhập
      Pi.authenticate(scopes, (p: any) => console.log(p)).then((auth: any) => {
        console.log("Login OK", auth); 
        setUser(auth.user);
        // Hiện thông báo chào mừng để biết là đã đăng nhập được
        // alert("Chào " + auth.user.username + "! Đã kết nối Pi thành công."); 
      }).catch((err: any) => console.error("Lỗi Pi:", err));

    } catch (err) { console.error(err); }
  };

  return (
    <PiContext.Provider value={{ user, setUser }}>
      {/* Nạp SDK từ máy chủ Pi */}
      <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" onLoad={onPiReady} />
      {children}
    </PiContext.Provider>
  );
}
export const usePi = () => useContext(PiContext);
