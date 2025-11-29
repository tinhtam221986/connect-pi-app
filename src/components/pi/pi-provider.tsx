"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

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
}

const PiContext = createContext<PiContextType>({
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  accessToken: null,
  authenticate: async () => {},
  error: null,
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

  useEffect(() => {
    const initPi = () => {
      if (window.Pi) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true }) // Default to sandbox for dev
          setIsInitialized(true)
          console.log("Pi SDK Initialized")
        } catch (err) {
          console.error("Pi SDK Init Error:", err)
          setError("Failed to initialize Pi SDK")
        }
      } else {
        // Retry if script hasn't loaded yet
        setTimeout(initPi, 500)
      }
    }

    initPi()
  }, [])

  const authenticate = async () => {
    if (!isInitialized || !window.Pi) {
        setError("Pi SDK not ready")
        return
    }

    try {
      const scopes = ["username", "payments"]
      const onIncompletePaymentFound = (payment: any) => {
        console.log("Incomplete payment found", payment)
        // Handle incomplete payments here
      }

      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound)
      
      setUser(auth.user)
      setAccessToken(auth.accessToken)
      setIsAuthenticated(true)
      setError(null)
    } catch (err: any) {
      console.error("Pi Authentication Failed:", err)
      setError(err.message || "Authentication failed")
    }
  }

  return (
    <PiContext.Provider
      value={{
        isInitialized,
        isAuthenticated,
        user,
        accessToken,
        authenticate,
        error,
      }}
    >
      {children}
    </PiContext.Provider>
  )
}
