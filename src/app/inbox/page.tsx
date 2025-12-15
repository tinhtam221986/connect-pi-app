"use client";
import React from 'react';
import { BottomNav } from "@/components/BottomNav";
import { useRouter } from 'next/navigation';

export default function InboxPage() {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    if (tab === 'home') router.push('/');
    else if (tab === 'market') router.push('/?tab=market');
    else if (tab === 'create') router.push('/upload');
    else if (tab === 'game') router.push('/game');
    else if (tab === 'profile') router.push('/profile');
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Hộp thư (1)</h2>
      <div style={{ background: "#222", padding: "15px", borderRadius: "10px", marginTop: "20px" }}>
        <h4>Hệ thống</h4>
        <p>Chào mừng bạn đến với Connect! 🚀</p>
      </div>
      <BottomNav activeTab="inbox" onTabChange={handleTabChange} />
    </div>
  );
}
