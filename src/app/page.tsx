"use client";

import { usePi } from "@/components/pi/pi-provider";
import LoginView from "@/components/LoginView";
import MainAppView from "@/components/MainAppView";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated, isInitialized } = usePi();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Logic:
  // 1. If not authenticated -> Show Login Screen
  // 2. If authenticated -> Show Main App (Feed)
  
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <MainAppView />;
}
