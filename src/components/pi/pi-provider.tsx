"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Script from "next/script";

// Định nghĩa kiểu dữ liệu User
interface PiUser {
  username: string;
  uid: string;
  accessToken?: string;
}

// Định nghĩa Context Type - Đã thêm authenticate
interface PiContextType {
  isInitialized: boolean;
  user: PiUser | null;
  error: string | null;
  forceMock: () => void;
  authenticate: () => Promise<void>; 
}

const PiContext = createContext<PiContextType | null>(null);

export function usePi() {
  const context = useContext(PiContext);
  if (!context) {
    throw new Error("usePi must be used within a PiSDKProvider");
  }
  return context;
}

export function PiSDKProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<PiUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hàm Force Mock cho Testing
  const forceMock = useCallback(() => {
    console.log("Forcing Mock Mode");
    setIsInitialized(true);
    setUser({ username: "MockUser", uid: "mock_uid_123" });
    setError(null);
  }, []);

  // Hàm Authenticate chính
  const authenticate = useCallback(async () => {
    if (!isInitialized) {
      console.warn("Pi SDK chưa sẵn sàng.");
      return;
    }

    try {
      if (typeof window !== 'undefined' && (window as any).Pi) {
        const scopes = ['username', 'payments'];
        const authResult = await (window as any).Pi.authenticate(scopes, onIncompletePaymentFound);
        setUser({
            username: authResult.user.username,
            uid: authResult.user.uid,
            accessToken: authResult.accessToken
        });
      } else {
        // Fallback nếu không có Pi SDK (trên trình duyệt thường)
        console.log("Không tìm thấy Pi SDK, chuyển sang Mock Mode");
        forceMock();
      }
    } catch (err: any) {
      console.error("Lỗi xác thực:", err);
      setError(err.message || "Xác thực thất bại");
      // Fallback tự động trong môi trường dev
      if (process.env.NODE_ENV === 'development') {
          forceMock();
      }
    }
  }, [isInitialized, forceMock]);

  const onIncompletePaymentFound = (payment: any) => {
      console.log("Tìm thấy giao dịch chưa hoàn tất:", payment);
  };

  useEffect(() => {
    const initPi = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).Pi) {
          await (window as any).Pi.init({ version: "2.0", sandbox: true });
          setIsInitialized(true);
          console.log("Pi SDK Initialized");
        } else {
             setTimeout(() => {
                 if (typeof window !== 'undefined' && (window as any).Pi) {
                    (window as any).Pi.init({ version: "2.0", sandbox: true });
                    setIsInitialized(true);
                 }
             }, 3000);
        }
      } catch (err: any) {
        setError(err.message || "Không thể khởi tạo Pi SDK");
      }
    };

    initPi();
  }, []);

  return (
    <PiContext.Provider value={{ isInitialized, user, error, forceMock, authenticate }}>
      <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" />
      {children}
    </PiContext.Provider>
  );
}
