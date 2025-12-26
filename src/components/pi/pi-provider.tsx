"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

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

const MOCK_USER_KEY = 'connect-pi-app-mock-user';

export function PiSDKProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<PiUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [incompletePayment, setIncompletePayment] = useState<any | null>(null);
  const initializationAttempted = useRef(false);

  // Final, most robust forceMock function
  const forceMock = useCallback(() => {
    console.log("FORCE MOCK MODE ACTIVATED: Setting user state and dispatching event.");
    const mockUser = { username: "DevUser", uid: "mock_uid_12345", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser` };

    // 1. Set user state directly for immediate reactivity
    setUser(mockUser);

    // 2. Persist the mock user in localStorage to survive refreshes/redirects
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));

    // 3. Ensure the app is marked as initialized
    setIsInitialized(true);

    // 4. Manually dispatch a storage event. This is a robust way to ensure
    //    other components (like the root page) react to the change.
    window.dispatchEvent(new Event('storage'));
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
        const authenticatedUser = {
            username: authResult.user.username,
            uid: authResult.user.uid,
            accessToken: authResult.accessToken
        };
        setUser(authenticatedUser);
        // Clear any mock user data on successful real authentication
        localStorage.removeItem(MOCK_USER_KEY);
      } else {
        console.log("Không tìm thấy Pi SDK, chuyển sang Mock Mode");
        forceMock();
      }
    } catch (err: any) {
      console.error("Lỗi xác thực:", err);
      setError(err.message || "Xác thực thất bại");
      if (process.env.NODE_ENV === 'development') {
          forceMock();
      }
    }
  }, [isInitialized, forceMock, onIncompletePaymentFound]);

  useEffect(() => {
    if (initializationAttempted.current) return;
    initializationAttempted.current = true;

    const storedMockUser = localStorage.getItem(MOCK_USER_KEY);
    if (storedMockUser) {
        console.log("Found persisted mock user in localStorage.");
        setUser(JSON.parse(storedMockUser));
        setIsInitialized(true);
        return;
    }

    let retryCount = 0;
    const maxRetries = 20;

    const initPi = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).Pi) {
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
                 console.log("Pi SDK not found.");
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
