'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

interface PiUser {
  uid: string;
  username: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
  accessToken?: string;
}

interface PiContextType {
  sdkLoaded: boolean;
  isAuthenticated: boolean;
  currentUser: PiUser | null;
  authenticate: () => Promise<void>;
  createPayment: (paymentData: any, callbacks: any) => void;
  openShareDialog: (title: string, message: string) => void;
  error: string | null;
  loading: boolean;
}

const PiContext = createContext<PiContextType>({
  sdkLoaded: false,
  isAuthenticated: false,
  currentUser: null,
  authenticate: async () => {},
  createPayment: () => {},
  openShareDialog: () => {},
  error: null,
  loading: false,
});

export const usePi = () => useContext(PiContext);

export function PiProvider({ children }: { children: React.ReactNode }) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<PiUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPi = setInterval(() => {
      if ((window as any).Pi) {
        clearInterval(checkPi);
        setSdkLoaded(true);
        try {
          (window as any).Pi.init({ version: '2.0', sandbox: true }); 
          console.log('Pi SDK Initialized');
        } catch (err) {
          console.error('Pi SDK Init Error:', err);
        }
      }
    }, 500);
    return () => clearInterval(checkPi);
  }, []);

  const onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment:', payment);
  };

  const authenticate = useCallback(async () => {
    if (!sdkLoaded) return setError('Pi SDK loading...');
    setLoading(true);
    setError(null);

    // 15s Timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Login timed out. Please try again.')), 15000)
    );

    try {
      const scopes = ['username', 'payments'];
      const authResult: any = await Promise.race([
        (window as any).Pi.authenticate(scopes, onIncompletePaymentFound),
        timeoutPromise
      ]);

      if (!authResult.accessToken) throw new Error('No access token');

      // Verify with Server
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: authResult.accessToken }),
      });

      if (!res.ok) throw new Error('Server verification failed');
      const data = await res.json();
      
      setCurrentUser({ ...authResult.user, ...data.user });
      setIsAuthenticated(true);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  }, [sdkLoaded]);

  const createPayment = (paymentData: any, callbacks: any) => {
    if ((window as any).Pi) (window as any).Pi.createPayment(paymentData, callbacks);
  };
  const openShareDialog = (title: string, message: string) => {
    if ((window as any).Pi) (window as any).Pi.openShareDialog(title, message);
  };

  return (
    <PiContext.Provider value={{ sdkLoaded, isAuthenticated, currentUser, authenticate, createPayment, openShareDialog, error, loading }}>
      <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" onLoad={() => setSdkLoaded(true)} />
      {children}
    </PiContext.Provider>
  );
}
