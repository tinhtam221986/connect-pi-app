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
      position: "fixed", bottom: 20, left: "5%", width: "90%", height: "70px",
      background: "rgba(255,255,255,0.1)", backdropFilter: "blur(15px)",
      borderRadius: "35px", border: "1px solid rgba(255,255,255,0.2)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 100, boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
    }}>
      
      {/* 1. Trang Chủ */}
      <Link href="/" style={{ color: isActive("/"), textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>🏠</span>
      </Link>

      {/* 2. Game */}
      <Link href="/game" style={{ color: isActive("/game"), textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>🎮</span>
      </Link>

      {/* 3. Nút Đăng (Pha lê nổi) */}
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "55px", height: "55px", marginTop: "-30px",
          background: "linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)",
          borderRadius: "50%", border: "4px solid black",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 0 15px rgba(255, 0, 80, 0.6)"
        }}>
          <span style={{ color: "white", fontSize: "30px", fontWeight: "bold" }}>+</span>
        </div>
      </Link>

      {/* 4. Chat */}
      <Link href="/inbox" style={{ color: isActive("/inbox"), textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>💬</span>
      </Link>

      {/* 5. Hồ sơ */}
      <Link href="/profile" style={{ color: isActive("/profile"), textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>👤</span>
      </Link>
    </div>
  );
}
