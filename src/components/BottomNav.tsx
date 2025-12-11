"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  
  // Ẩn menu khi ở trang Upload
  if (pathname === "/upload") return null;

  const isActive = (path: string) => pathname === path ? "white" : "rgba(255,255,255,0.6)";

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, width: "100%", height: "80px",
      background: "linear-gradient(to top, black 0%, transparent 100%)", // Nền vô hình
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 100, paddingBottom: "15px"
    }}>
      
      {/* 1. Trang Chủ */}
      <Link href="/" style={{ color: isActive("/"), textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "26px", filter: "drop-shadow(0 2px 3px black)" }}>🏠</span>
        <span style={{ fontSize: "10px", fontWeight: "bold", textShadow: "0 1px 2px black" }}>Home</span>
      </Link>

      {/* 2. Game (Đã gắn Link) */}
      <Link href="/game" style={{ color: isActive("/game"), textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "26px", filter: "drop-shadow(0 2px 3px black)" }}>🎮</span>
        <span style={{ fontSize: "10px", fontWeight: "bold", textShadow: "0 1px 2px black" }}>Game</span>
      </Link>

      {/* 3. Nút Đăng (Pha lê) */}
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "50px", height: "50px", marginBottom: "20px",
          background: "linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)",
          borderRadius: "50%", border: "2px solid white",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 0 15px rgba(255, 0, 80, 0.6)"
        }}>
          <span style={{ color: "white", fontSize: "30px", fontWeight: "bold" }}>+</span>
        </div>
      </Link>

      {/* 4. Chat/Inbox (Đã gắn Link) */}
      <Link href="/inbox" style={{ color: isActive("/inbox"), textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "26px", filter: "drop-shadow(0 2px 3px black)" }}>💬</span>
        <span style={{ fontSize: "10px", fontWeight: "bold", textShadow: "0 1px 2px black" }}>Chat</span>
      </Link>

      {/* 5. Hồ sơ */}
      <Link href="/profile" style={{ color: isActive("/profile"), textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "26px", filter: "drop-shadow(0 2px 3px black)" }}>👤</span>
        <span style={{ fontSize: "10px", fontWeight: "bold", textShadow: "0 1px 2px black" }}>Tôi</span>
      </Link>
    </div>
  );
}
