"use client";

import { useEffect, useState } from "react";
import { usePi } from "@/components/pi/pi-provider";
import LoginView from "@/components/LoginView";
import MainAppView from "@/components/MainAppView";
import { EconomyProvider } from "@/components/economy/EconomyContext";

export default function Home() {
  // Correctly destructure 'user' instead of the non-existent 'isAuthenticated'
  const { user, isInitialized } = usePi();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering only after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // If Pi SDK is not initialized yet, show loading
  if (!isInitialized) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="text-yellow-500 animate-pulse">Initializing Pi Network...</p>
        </div>
    );
  }

  // If user is logged in (user object exists), show Main App
  if (user) {
    return (
      <EconomyProvider>
        <MainAppView />
      </EconomyProvider>
    );
  }

  // Otherwise show Login Screen
    // --- ĐOẠN CODE MỚI THÊM NÚT TẮT ---
  return (
    <div style={{ position: 'relative' }}>
      <LoginView />
      
      {/* Nút tắt dẫn sang phòng Upload */}
      <a href="/upload" style={{
        position: 'fixed',
        bottom: '30px', 
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: '12px 25px',
        backgroundColor: '#ff0050', // Màu đỏ giống TikTok
        color: 'white',
        borderRadius: '50px',
        fontWeight: 'bold',
        textDecoration: 'none',
        boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
        border: '2px solid white'
      }}>
        🎥 ĐĂNG VIDEO (TEST)
      </a>
    </div>
  );
  
}
