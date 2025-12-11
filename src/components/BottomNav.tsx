"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  
  // 🟢 THÔNG MINH: Nếu đang ở trang Upload thì ẨN MENU đi để dễ bấm nút Đăng
  if (pathname === "/upload") return null;

  const isActive = (path: string) => pathname === path ? "white" : "rgba(255,255,255,0.5)";

  return (
    <div style={{
      position: "fixed",
      bottom: "20px", // Cách đáy một chút cho sang
      left: "5%",     // Căn giữa
      width: "90%",   // Không full màn hình, tạo khối nổi
      height: "65px",
      // --- HIỆU ỨNG THẠCH ANH (GLASSMORPHISM) ---
      background: "rgba(255, 255, 255, 0.1)", // Màu trắng trong suốt 10%
      backdropFilter: "blur(15px)",           // Làm mờ nền đằng sau
      border: "1px solid rgba(255, 255, 255, 0.2)", // Viền kính sáng
      borderRadius: "35px",                   // Bo tròn mạnh
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 100,
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)" // Bóng đổ nhẹ
    }}>
      
      {/* Trang Chủ */}
      <Link href="/" style={{ color: isActive("/"), display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/" ? "white" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
      </Link>

      {/* Game */}
      <div style={{ color: "rgba(255,255,255,0.5)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "22px" }}>🎮</span>
      </div>

      {/* Nút Đăng Bài (Nổi bật giữa) */}
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "50px", height: "50px",
          background: "linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)", // Màu Gradient đẹp
          borderRadius: "50%",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 0 15px rgba(255, 0, 80, 0.6)",
          marginTop: "-20px", // Nổi lên trên một chút
          border: "4px solid black" // Viền đen để tách biệt với nền kính
        }}>
          <span style={{ color: "white", fontWeight: "bold", fontSize: "28px" }}>+</span>
        </div>
      </Link>

      {/* Chat */}
      <div style={{ color: "rgba(255,255,255,0.5)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "22px" }}>💬</span>
      </div>

      {/* Hồ sơ */}
      <Link href="/profile" style={{ color: isActive("/profile"), display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/profile" ? "white" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </Link>
    </div>
  );
}
