"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"

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
}

const PiContext = createContext<PiContextType>({
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  accessToken: null,
  authenticate: async () => {},
  error: null,
  incompletePayment: null,
})

export function usePi() {
  return useContext(PiContext)
}

export function PiSDKProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<PiUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [incompletePayment, setIncompletePayment] = useState<any | null>(null)

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;

    const initPi = () => {
      if (window.Pi) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true })
          setIsInitialized(true)
          console.log("Pi SDK Initialized")
        } catch (err: any) {
          console.error("Pi SDK Init Error:", err)
          setError(`Failed to initialize Pi SDK: ${err.message || err}`)
        }
      } else {
        retryCount++;
        if (retryCount > maxRetries) {
            setError("Pi SDK script failed to load. Please check your internet connection or use the Pi Browser.")
            return;
        }
        setTimeout(initPi, 500)
      }
    }

    initPi()
  }, [])

  const authenticate = useCallback(async () => {
    if (!isInitialized || !window.Pi) {
        if (!window.Pi) {
            setError("Pi SDK not ready (window.Pi missing)")
            return
        }
    }

    try {
      const scopes = ["username", "payments"]
      
      const onIncompletePaymentFound = (payment: any) => {
        console.log("Incomplete payment found inside Provider:", payment)
        setIncompletePayment(payment)
      };

      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound)
      
      setUser(auth.user)
      setAccessToken(auth.accessToken)
      setIsAuthenticated(true)
      setError(null)
    } catch (err: any) {
      console.error("Pi Authentication Failed:", err)
      setError(err.message || "Authentication failed")
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
      }}
    >
      {children}
    </PiContext.Provider>
  )
}
