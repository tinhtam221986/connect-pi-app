"use client";
import React from 'react';
import BottomNav from "@/components/BottomNav";

export default function InboxPage() {
  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Hộp thư (1)</h2>
      <div style={{ background: "#222", padding: "15px", borderRadius: "10px", marginTop: "20px" }}>
        <h4>Hệ thống</h4>
        <p>Chào mừng bạn đến với Connect! 🚀</p>
      </div>
      <BottomNav />
    </div>
  );
}
