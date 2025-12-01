"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Mock Pi Network SDK type
interface PiNetwork {
  init: (config: { version: string; sandbox: boolean }) => void;
  authenticate: (
    scopes: string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onIncompletePaymentFound: (payment: any) => void
  ) => Promise<{ accessToken: string; user: { uid: string; username: string } }>;
}

declare global {
  interface Window {
    Pi?: PiNetwork;
  }
}

interface User {
  uid: string;
  username: string;
}

interface PiContextType {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "connected" | "error";
  authenticate: () => Promise<void>;
}

const PiContext = createContext<PiContextType | undefined>(undefined);

export const PiNetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "connected" | "error">(
    "idle"
  );

  useEffect(() => {
    // Load Pi SDK script dynamically if not present
    if (!window.Pi) {
        const script = document.createElement('script');
        script.src = 'https://sdk.minepi.com/pi-sdk.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
             // Initialize Pi SDK
             try {
                window.Pi?.init({ version: "2.0", sandbox: true });
                // Attempt silent authentication or check session if possible
                // For now, we wait for user action or auto-authenticate if needed
             } catch (e) {
                 console.error("Pi SDK Init Error", e);
             }
        }
    } else {
        try {
            window.Pi?.init({ version: "2.0", sandbox: true });
        } catch (e) {
             console.error("Pi SDK Init Error", e);
        }
    }
  }, []);

  const authenticate = async () => {
    setStatus("loading");
    try {
      if (!window.Pi) {
        throw new Error("Pi SDK not loaded");
      }
      
      const authResult = await window.Pi.authenticate(
        ["username", "payments"],
        (payment) => {
          console.log("Incomplete payment found", payment);
        }
      );
      
      setUser(authResult.user);
      setStatus("connected");
    } catch (error) {
      console.error("Authentication failed", error);
      setStatus("error");
    }
  };

  return (
    <PiContext.Provider value={{ user, isAuthenticated: !!user, status, authenticate }}>
      {children}
    </PiContext.Provider>
  );
};

export const usePi = () => {
  const context = useContext(PiContext);
  if (context === undefined) {
    throw new Error("usePi must be used within a PiNetworkProvider");
  }
  return context;
};
