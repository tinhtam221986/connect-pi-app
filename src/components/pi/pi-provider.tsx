"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { toast } from "sonner"

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
  error: string | null
  incompletePayment: any | null
  isMock: boolean
}

const PiContext = createContext<PiContextType>({
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  accessToken: null,
  authenticate: async () => {},
  error: null,
  incompletePayment: null,
  isMock: false,
})

export function usePi() {
  return useContext(PiContext)
}

// Mock SDK for Development/Chrome
const MockPi: PiSDK = {
  init: (opts: any) => console.log("Mock Pi Init", opts),
  authenticate: async (scopes: string[], onIncomplete: any) => {
    console.log("Mock Authenticating...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Faster mock delay
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

      // Simulate flow
      setTimeout(async () => {
          if(callbacks.onCreated) callbacks.onCreated(paymentId);

          if(callbacks.onReadyForServerApproval) {
              await callbacks.onReadyForServerApproval(paymentId);
          }

          // Simulate waiting for user confirmation and server processing
          setTimeout(async () => {
              if (callbacks.onReadyForServerCompletion) {
                  await callbacks.onReadyForServerCompletion(paymentId, "mock_txid_" + Date.now());
              }
              toast.success("Mock Payment Simulated!");
          }, 1000);
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

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20; // 10 seconds

    const initPi = () => {
      // Robustness check: If not in Pi Browser (and not Android/iOS wrapper), use Mock.
      // Pi Browser UA usually contains "PiBrowser"
      const ua = navigator.userAgent;
      const isPiBrowser = ua.includes("PiBrowser");
      
      // If we are definitely not in Pi Browser (e.g. Chrome Desktop), force Mock immediately
      // This prevents "hanging" on real SDK scripts that might load but not work.
      if (!isPiBrowser && !ua.includes("Android") && !ua.includes("iPhone")) {
           console.warn("Not Pi Browser, using Mock SDK");
           (window as any).Pi = MockPi;
           setIsInitialized(true);
           setIsMock(true);
           toast.info("Dev Mode: Mock SDK Active");
           return;
      }

      if (window.Pi) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true })
          setIsInitialized(true)
        } catch (err: any) {
          console.error("Pi SDK Init Error:", err)
          // If real init fails, maybe fallback? 
          // For now, show error so user knows something is wrong with Real SDK
          setError(`Pi SDK Init Failed: ${err.message || err}`)
        }
      } else {
        retryCount++;
        if (retryCount > maxRetries) {
            // Fallback to Mock if timed out (even on mobile)
            console.warn("Pi SDK not found after timeout, using Mock");
            (window as any).Pi = MockPi; 
            setIsInitialized(true);
            setIsMock(true);
            toast.info("Dev Mode: Using Mock SDK (Timeout)");
            return;
        }
        setTimeout(initPi, 500)
      }
    }

    initPi()
  }, [])

  const authenticate = useCallback(async () => {
    if (!isInitialized || !window.Pi) {
        setError("SDK not ready. Please refresh.")
        return
    }

    try {
      const scopes = ["username", "payments"]
      
      const onIncompletePaymentFound = (payment: any) => {
        console.log("Incomplete payment found:", payment)
        setIncompletePayment(payment)
      };

      // Add a race condition to prevent hanging forever
      const authPromise = window.Pi.authenticate(scopes, onIncompletePaymentFound);
      const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Authentication timed out")), 30000)
      );

      const auth: any = await Promise.race([authPromise, timeoutPromise]);
      
      setUser(auth.user)
      setAccessToken(auth.accessToken)
      setIsAuthenticated(true)
      setError(null)
      toast.success(`Welcome, ${auth.user.username}!`)
      
    } catch (err: any) {
      console.error("Pi Authentication Failed:", err)
      setError(err.message || "Authentication failed")
      toast.error("Login Failed: " + (err.message || "Unknown error"))
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
        error,
        incompletePayment,
        isMock
      }}
    >
      {children}
    </PiContext.Provider>
  )
}
