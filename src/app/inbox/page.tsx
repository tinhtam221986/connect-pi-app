"use client";
import React from 'react';
import BottomNav from "@/components/BottomNav";

export default function InboxPage() {
  const messages = [
    { id: 1, name: "Hệ thống", msg: "Chào mừng bạn đến với Connect! 🚀", time: "Vừa xong", avt: "📢" },
    { id: 2, name: "Pi Network", msg: "Bạn đã nhận được 1 Pi thưởng...", time: "1 giờ", avt: "🟣" },
    { id: 3, name: "Support", msg: "Yêu cầu xác minh danh tính...", time: "1 ngày", avt: "🎧" },
  ];

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{ padding: "15px", borderBottom: "1px solid #333", textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>
        Hộp thư đến (3)
      </div>

      {/* List */}
      <div style={{ padding: "10px" }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", padding: "15px", borderBottom: "1px solid #222" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginRight: "15px" }}>
              {m.avt}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>{m.name}</div>
              <div style={{ color: "#aaa", fontSize: "14px" }}>{m.msg}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>{m.time}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "50px", color: "#444" }}>
        <p>Đã hết tin nhắn</p>
      </div>

      <BottomNav />
    </div>
  );
}
