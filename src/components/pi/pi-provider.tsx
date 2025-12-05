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
          // Initialize Pi SDK - use sandbox:true for Testnet development
          (window as any).Pi.init({ version: '2.0', sandbox: true }); 
          console.log('Pi SDK Initialized (Sandbox Mode)');
        } catch (err) {
          console.error('Pi SDK Init Error:', err);
        }
      }
    }, 500);
    return () => clearInterval(checkPi);
  }, []);

  const onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment found:', payment);
    // Ideally call backend to settle, but for now just log it
  };

  const authenticate = useCallback(async () => {
    if (!sdkLoaded) {
      setError('Pi SDK not loaded yet.');
      return;
    }
    setLoading(true);
    setError(null);

    // Set a client-side timeout to prevent infinite hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Authentication timed out (15s). Check Pi Browser network.')), 15000)
    );

    try {
      console.log('Starting Pi Authentication...');
      const scopes = ['username', 'payments'];
      
      // Race the authentication against the timeout
      const authResult: any = await Promise.race([
        (window as any).Pi.authenticate(scopes, onIncompletePaymentFound),
        timeoutPromise
      ]);

      console.log('Pi Auth Result:', authResult);
      if (!authResult || !authResult.accessToken) {
        throw new Error('No access token received.');
      }

      // Verify with backend
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: authResult.accessToken }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Server verification failed');
      }

      const userData = await verifyResponse.json();
      setCurrentUser({ ...authResult.user, ...userData.user });
      setIsAuthenticated(true);

    } catch (err: any) {
      console.error('Auth Error:', err);
      setError(err.message || 'Login failed');
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
