"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path ? "#ff0050" : "white";

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "70px",
      // Hiệu ứng Gradient từ đen mờ lên trong suốt (để nút nổi bật nhưng không che video)
      background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 100,
      paddingBottom: "10px"
    }}>
      {/* Nút Trang Chủ */}
      <Link href="/" style={{ color: isActive("/"), textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
        <span style={{ fontSize: "10px", marginTop: "2px" }}>Trang chủ</span>
      </Link>

      {/* Nút Game (Tạm thời) */}
      <div style={{ color: "white", opacity: 0.6, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "20px" }}>🎮</span>
        <span style={{ fontSize: "10px" }}>Game</span>
      </div>

      {/* Nút Đăng Bài (Nổi bật) */}
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "45px", height: "30px",
          background: "linear-gradient(90deg, #00f2ea, #ff0050)",
          borderRadius: "8px",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 0 10px rgba(255,255,255,0.3)"
        }}>
          <span style={{ color: "black", fontWeight: "bold", fontSize: "20px" }}>+</span>
        </div>
      </Link>

      {/* Nút Hộp thư (Tạm thời) */}
      <div style={{ color: "white", opacity: 0.6, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "20px" }}>💬</span>
        <span style={{ fontSize: "10px" }}>Hộp thư</span>
      </div>

      {/* Nút Tài Khoản */}
      <Link href="/profile" style={{ color: isActive("/profile"), textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/profile" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span style={{ fontSize: "10px", marginTop: "2px" }}>Hồ sơ</span>
      </Link>
    </div>
  );
}
