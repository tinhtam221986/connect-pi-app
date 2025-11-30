"use client";

import { usePi } from "@/components/pi/pi-provider";
import LoginView from "@/components/LoginView";
import MainAppView from "@/components/MainAppView";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated, isInitialized } = usePi();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <MainAppView />;
}
