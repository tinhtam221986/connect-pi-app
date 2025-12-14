"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api-client";

// Định nghĩa kiểu dữ liệu User
interface PiUser {
  username: string;
  uid: string;
  accessToken?: string;
  avatar?: string;
}

// Định nghĩa Context Type
interface PiContextType {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isMock: boolean;
  user: PiUser | null;
  error: string | null;
  incompletePayment: any | null;
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
  const [incompletePayment, setIncompletePayment] = useState<any | null>(null);
  const initializationAttempted = useRef(false);

  // Hàm Force Mock cho Testing
  const forceMock = useCallback(() => {
    console.log("Forcing Mock Mode");
    setIsInitialized(true);
    setUser({ username: "MockUser", uid: "mock_uid_123" });
    setError(null);
  }, []);

  const onIncompletePaymentFound = useCallback((payment: any) => {
      console.log("Tìm thấy giao dịch chưa hoàn tất:", payment);
      setIncompletePayment(payment);
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

        // Verify token with backend
        try {
            if (authResult.accessToken) {
                await apiClient.auth.verify(authResult.accessToken);
            }
        } catch (e) {
            console.error("Backend verification failed:", e);
            // Optionally block login if verification fails
            // throw new Error("Verification failed");
        }

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
  }, [isInitialized, forceMock, onIncompletePaymentFound]);

  useEffect(() => {
    if (initializationAttempted.current) return;
    initializationAttempted.current = true;

    let retryCount = 0;
    const maxRetries = 20; // 10 seconds

    const initPi = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).Pi) {
          // Check for Sandbox Mode via Env Var (Default to false for Production/Real Pi)
          // Set NEXT_PUBLIC_PI_SANDBOX="true" in .env to enable Sandbox
          const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === 'true';
          console.log(`Initializing Pi SDK (Sandbox: ${isSandbox})`);

          await (window as any).Pi.init({ version: "2.0", sandbox: isSandbox });
          setIsInitialized(true);
          console.log("Pi SDK Initialized");
        } else {
             if (retryCount < maxRetries) {
                 retryCount++;
                 setTimeout(initPi, 500);
             } else {
                 console.log("Pi SDK not found, keeping uninitialized (or mock)");
                 if (process.env.NODE_ENV === 'development') {
                    // forceMock();
                 }
             }
        }
      } catch (err: any) {
        if (err.message && err.message.includes("already initialized")) {
            setIsInitialized(true);
            console.log("Pi SDK was already initialized");
        } else {
            setError(err.message || "Không thể khởi tạo Pi SDK");
        }
      }
    };

    initPi();
  }, []);

  const isAuthenticated = !!user;
  const isMock = user?.uid?.startsWith("mock_") || false;

  return (
    <PiContext.Provider value={{ isInitialized, isAuthenticated, isMock, user, error, incompletePayment, forceMock, authenticate }}>
      {children}
    </PiContext.Provider>
  );
}
