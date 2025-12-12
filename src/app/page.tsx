"use client";

import React, { useEffect, useState } from 'react';
import { usePi } from '@/components/pi/pi-provider';
import LoginView from '@/components/LoginView';
import MainAppView from '@/components/MainAppView';

export default function HomePage() {
  const { isAuthenticated, isInitialized } = usePi();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [isAuthenticated]);

  if (!isInitialized) {
      return <LoginView />; // Or a loading spinner, but LoginView handles loading state well
  }

  return (
    <>
      {isAuthenticated ? <MainAppView /> : <LoginView />}
    </>
  );
}
