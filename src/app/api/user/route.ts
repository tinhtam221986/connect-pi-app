"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/upload") return null;

  const isActive = (path: string) => pathname === path ? "#00f2ea" : "rgba(255,255,255,0.6)";

  return (
    <div style={{
      position: "fixed", 
      bottom: "20px", 
      left: "10px", 
      right: "10px", 
      height: "60px",
      // --- 🟢 GIAO DIỆN KHUNG MẢNH MAI ---
      background: "rgba(0, 0, 0, 0.6)", // Nền đen mờ nhẹ để nổi icon
      backdropFilter: "blur(10px)",     // Làm mờ video phía sau
      borderRadius: "30px",             // Bo tròn 2 đầu
      border: "1px solid rgba(255, 255, 255, 0.3)", // Viền trắng mảnh mai
      display: "flex", 
      justifyContent: "space-around", 
      alignItems: "center",
      zIndex: 100,
      padding: "0 10px"
    }}>
      
      {/* Trang chủ */}
      <Link href="/" style={{ color: isActive("/"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>🏠</span>
      </Link>

      {/* Game */}
      <Link href="/game" style={{ color: isActive("/game"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>🎮</span>
      </Link>

      {/* Nút Đăng (Nổi lên trên khung) */}
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "45px", height: "45px", 
          background: "linear-gradient(to right, #00f2ea, #ff0050)",
          borderRadius: "50%", 
          display: "flex", justifyContent: "center", alignItems: "center",
          border: "2px solid white", // Viền trắng cho nút
          transform: "translateY(-15px)", // Nổi lên khỏi khung
          boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}>
          <span style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>+</span>
        </div>
      </Link>

      {/* Chat */}
      <Link href="/inbox" style={{ color: isActive("/inbox"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>💬</span>
      </Link>

      {/* Tôi */}
      <Link href="/profile" style={{ color: isActive("/profile"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>👤</span>
      </Link>
    </div>
  );
}
