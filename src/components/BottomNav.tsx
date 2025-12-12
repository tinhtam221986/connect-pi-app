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
      left: "15px", 
      right: "15px", 
      height: "70px",
      // --- 🟢 CẤU TRÚC PHA LÊ ---
      backgroundColor: "rgba(20, 20, 20, 0.85)", // Màu đen mờ 85%
      backdropFilter: "blur(20px)",              // Làm mờ hậu cảnh
      borderRadius: "40px",                      // Bo tròn mạnh
      border: "1px solid rgba(255, 255, 255, 0.15)", // Viền kính mỏng
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)", // Bóng đổ 3D
      display: "flex", 
      justifyContent: "space-around", 
      alignItems: "center",
      zIndex: 9999, // Luôn nổi lên trên cùng
      padding: "0 10px"
    }}>
      
      {/* Trang Chủ */}
      <Link href="/" style={{ color: isActive("/"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "26px" }}>🏠</span>
      </Link>

      {/* Game */}
      <Link href="/game" style={{ color: isActive("/game"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "26px" }}>🎮</span>
      </Link>

      {/* Nút Đăng (Nổi hẳn lên) */}
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "55px", height: "55px", 
          marginTop: "-40px", // Đẩy lên cao hẳn
          background: "linear-gradient(135deg, #00f2ea, #ff0050)",
          borderRadius: "50%", 
          display: "flex", justifyContent: "center", alignItems: "center",
          border: "4px solid #000", // Viền đen để tách biệt nền
          boxShadow: "0 0 15px #ff0050"
        }}>
          <span style={{ color: "white", fontSize: "30px", fontWeight: "bold" }}>+</span>
        </div>
      </Link>

      {/* Hộp thư */}
      <Link href="/inbox" style={{ color: isActive("/inbox"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "26px" }}>💬</span>
      </Link>

      {/* Tôi */}
      <Link href="/profile" style={{ color: isActive("/profile"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "26px" }}>👤</span>
      </Link>
    </div>
  );
}
