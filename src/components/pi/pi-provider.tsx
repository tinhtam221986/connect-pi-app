"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

// Define types for Pi SDK
interface PiUser {
  uid: string
  username: string
}

interface PiAuthResult {
  accessToken: string
  user: PiUser
}

interface PiSDK {
  init: (options: { version: string; sandbox: boolean }) => void
  authenticate: (scopes: string[], onIncompletePaymentFound: (payment: any) => void) => Promise<PiAuthResult>
  createPayment: (paymentData: any, callbacks: any) => any
  openShareDialog: (title: string, message: string) => any
}

declare global {
  interface Window {
    Pi?: PiSDK
  }
}

interface PiContextType {
  isInitialized: boolean
  isAuthenticated: boolean
  user: PiUser | null
  accessToken: string | null
  authenticate: () => Promise<void>
  forceMock: () => void
  error: string | null
  incompletePayment: any | null
  isMock: boolean
  debugLog: string[]
}

const PiContext = createContext<PiContextType>({
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  accessToken: null,
  authenticate: async () => {},
  forceMock: () => {},
  error: null,
  incompletePayment: null,
  isMock: false,
  debugLog: [],
})

export function usePi() {
  return useContext(PiContext)
}

// Mock SDK for Development/Chrome
const MockPi: PiSDK = {
  init: (opts: any) => console.log("Mock Pi Init", opts),
  authenticate: async (scopes: string[], onIncomplete: any) => {
    console.log("Mock Authenticating...");
    await new Promise(resolve => setTimeout(resolve, 800)); 
    return {
      accessToken: "mock_token_" + Math.random().toString(36).substring(7),
      user: {
        uid: "mock_uid_12345",
        username: "Chrome_Tester"
      }
    }
  },
  createPayment: (paymentData: any, callbacks: any) => {
      console.log("Mock Payment Created", paymentData);
      const paymentId = "mock_payment_id_" + Date.now();
      const txid = "mock_txid_" + Date.now();

      // Simulate full flow
      setTimeout(async () => {
          if(callbacks.onCreated) callbacks.onCreated(paymentId);
          
          if(callbacks.onReadyForServerApproval) {
              await callbacks.onReadyForServerApproval(paymentId);
          }

          // Simulate user signing time
          setTimeout(async () => {
              if (callbacks.onReadyForServerCompletion) {
                  await callbacks.onReadyForServerCompletion(paymentId, txid);
              }
              toast.success("Mock Payment Simulated!");
          }, 500);

      }, 500);
      return {};
  },
  openShareDialog: (title: string, message: string) => { 
      console.log("Mock Share:", title, message);
      alert(`[Mock Share] Title: ${title}\nMessage: ${message}`); 
  }
}

export function PiSDKProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<PiUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [incompletePayment, setIncompletePayment] = useState<any | null>(null)
  const [isMock, setIsMock] = useState(false)
  const [debugLog, setDebugLog] = useState<string[]>([])

  const addLog = (msg: string) => {
      console.log(`[PiSDK] ${msg}`);
      setDebugLog(prev => [...prev.slice(-19), new Date().toISOString().split('T')[1].slice(0,8) + ": " + msg]);
  }

  const forceMock = useCallback(() => {
    addLog("Forcing Mock Mode by user request");
    (window as any).Pi = MockPi;
    setIsInitialized(true);
    setIsMock(true);
    toast.info("Dev Mode: Mock SDK Activated");
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20; // 10 seconds

    const initPi = () => {
      const ua = navigator.userAgent;
      addLog(`Init Check. UA: ${ua.substring(0, 30)}...`);
      const isPiBrowser = ua.includes("PiBrowser");
      
      // If we are definitely not in Pi Browser (e.g. Chrome Desktop), force Mock immediately
      if (!isPiBrowser && !ua.includes("Android") && !ua.includes("iPhone")) {
           addLog("Desktop detected, forcing Mock.");
           forceMock();
           return;
      }

      if (window.Pi) {
        try {
          addLog("window.Pi found. Initializing...");
          // Use sandbox: true for development
          window.Pi.init({ version: "2.0", sandbox: true })
          setIsInitialized(true)
          addLog("Pi SDK Initialized successfully.");
        } catch (err: any) {
          addLog(`Pi SDK Init Error: ${err.message || err}`);
          setError(`Pi SDK Init Failed: ${err.message || err}. Tap error to switch to Mock.`)
        }
      } else {
        retryCount++;
        if (retryCount > maxRetries) {
            addLog("Pi SDK not found after timeout. Waiting for manual action.");
            // Do not auto-mock on mobile, user might just have slow internet
            return;
        }
        setTimeout(initPi, 500)
      }
    }

    initPi()
  }, [forceMock])

  const authenticate = useCallback(async () => {
    if (!isInitialized || !window.Pi) {
        const msg = "SDK not ready. Please refresh or check connection.";
        setError(msg);
        addLog(msg);
        return
    }

    try {
      addLog("Starting Authentication...");
      const scopes = ["username", "payments"]
      
      const onIncompletePaymentFound = (payment: any) => {
        addLog("Incomplete payment found during auth");
        setIncompletePayment(payment)
      };

      const authPromise = window.Pi.authenticate(scopes, onIncompletePaymentFound);
      
      // Increased timeout to 120s for slow mobile networks
      const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Authentication timed out (120s).")), 120000)
      );

      addLog("Waiting for Pi App confirmation...");
      const auth: any = await Promise.race([authPromise, timeoutPromise]);
      addLog("Auth success locally. Verifying with backend...");
      
      // Verify with backend
      try {
        const verifyRes = await apiClient.auth.verify(auth.accessToken);
        
        if (verifyRes.success) {
           addLog("Backend verification success.");
           if (verifyRes.user) {
               auth.user = { ...auth.user, ...verifyRes.user };
           }
        } else if (verifyRes.code === 'NO_API_KEY') {
            addLog("CRITICAL: Missing PI_API_KEY on server.");
            toast.error("SETUP REQUIRED: Missing PI_API_KEY on server.", {
                description: "Real connection requires an API Key in Vercel/Env.",
                duration: 10000,
            });
            setError("Server Misconfiguration: Missing PI_API_KEY");
            // We DO NOT set local user if server is misconfigured for Real Connection request
            // unless we are in explicit mock mode? 
            // The prompt asks to "fix login errors", usually blocking login helps realize the issue.
            // But to be safe for testing, we will warn but PROCEED if it's a mock token.
            if (!auth.accessToken.startsWith('mock_')) {
                 return; 
            }
        } else {
            addLog(`Backend Verification FAILED: ${verifyRes.error}`);
            toast.error(`Login Error: ${verifyRes.error || "Verification failed"}.`);
            setError(`Backend Verify Failed: ${verifyRes.error}`);
        }
      } catch (backendErr: any) {
          addLog(`Backend connection error: ${backendErr.message}`);
          toast.warning("Backend unreachable. Features limited.");
      }

      setUser(auth.user)
      setAccessToken(auth.accessToken)
      setIsAuthenticated(true)
      setError(null)
      toast.success(`Welcome, ${auth.user.username}!`)
      
    } catch (err: any) {
      addLog(`Auth Failed: ${err.message || "Unknown error"}`);
      setError(err.message || "Authentication failed")
      toast.error("Login Failed. " + (err.message || "Unknown error"))
    }
  }, [isInitialized])

  return (
    <PiContext.Provider
      value={{
        isInitialized,
        isAuthenticated,
        user,
        accessToken,
        authenticate,
        forceMock,
        error,
        incompletePayment,
        isMock,
        debugLog
      }}
    >
      {children}
      {/* Debug Overlay for Mobile - Hidden if no error/log implies success */}
      {(!isAuthenticated && (error || debugLog.length > 0)) && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-green-400 p-2 text-xs font-mono max-h-32 overflow-y-auto z-[9999] opacity-80 pointer-events-none">
            <div className="font-bold border-b border-green-800 mb-1">Pi Debug Log (v2.1):</div>
            {debugLog.map((log, i) => (
                <div key={i}>{log}</div>
            ))}
        </div>
      )}
    </PiContext.Provider>
  )
}
