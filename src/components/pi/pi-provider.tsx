"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import Script from "next/script"
import { useRouter } from "next/navigation"

interface PiUser {
  username: string
  uid: string
  accessToken?: string
}

interface PiContextType {
  isInitialized: boolean
  isAuthenticated: boolean
  user: PiUser | null
  loading: boolean
  error: string | null
}

const PiContext = createContext<PiContextType>({
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
})

export const usePi = () => useContext(PiContext)

// --- QUAN TRỌNG: Phải dùng export function (Named Export) ---
export function PiSDKProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<PiUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initPi = async () => {
      try {
        if (!window.Pi) {
          console.warn("Pi SDK not found, waiting for script...")
          return
        }

        // Khởi tạo Pi SDK
        await window.Pi.init({ version: "2.0", sandbox: true })
        setIsInitialized(true)
        console.log("Pi SDK Initialized")

        // Xác thực người dùng (Auth)
        const scopes = ['username', 'payments']
        
        // Dùng Promise.race để tránh treo mãi mãi nếu Pi Browser không phản hồi
        const onIncompletePaymentFound = (payment: any) => {
            console.log("Incomplete payment found", payment)
            // Xử lý thanh toán chưa hoàn tất ở đây nếu cần
        }

        const authResult = await Promise.race([
          window.Pi.authenticate(scopes, onIncompletePaymentFound),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Auth timeout")), 15000))
        ]) as any

        if (authResult) {
          setUser({
            username: authResult.user.username,
            uid: authResult.user.uid,
            accessToken: authResult.accessToken
          })
          setIsAuthenticated(true)
        }

      } catch (err: any) {
        console.error("Pi SDK Error:", err)
        setError(err.message || "Failed to connect to Pi Network")
        // Ở môi trường dev/chrome thường, ta có thể cho qua để test giao diện
        if (process.env.NODE_ENV === 'development') {
            console.log("Dev mode: Simulating login")
        }
      } finally {
        setLoading(false)
      }
    }

    // Kiểm tra xem script đã load chưa
    const checkPi = setInterval(() => {
        if (window.Pi) {
            clearInterval(checkPi)
            initPi()
        }
    }, 500)

    // Timeout an toàn sau 5s nếu không thấy Pi
    setTimeout(() => {
        clearInterval(checkPi)
        if (loading) setLoading(false) 
    }, 5000)

    return () => clearInterval(checkPi)
  }, [])

  return (
    <PiContext.Provider value={{ isInitialized, isAuthenticated, user, loading, error }}>
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive" 
      />
      {children}
    </PiContext.Provider>
  )
}
