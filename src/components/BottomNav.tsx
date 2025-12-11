"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  
  // Ẩn menu khi đang ở trang Upload để không vướng nút Đăng
  if (pathname === "/upload") return null;

  const isActive = (path: string) => pathname === path ? "white" : "rgba(255,255,255,0.6)";

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "70px",
      // Nền trong suốt hoàn toàn, chỉ có hiệu ứng mờ nhẹ phía dưới chân
      background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 100,
      paddingBottom: "10px"
    }}>
      
      {/* Trang Chủ */}
      <Link href="/" style={{ color: isActive("/"), textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>🏠</span>
        <span style={{ fontSize: "10px", fontWeight: "bold", textShadow: "0 1px 2px black" }}>Home</span>
      </Link>

      {/* Game (Nút pha lê) */}
      <div style={{ color: "rgba(255,255,255,0.8)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px", filter: "drop-shadow(0 0 5px rgba(255,215,0,0.5))" }}>🎮</span>
        <span style={{ fontSize: "10px", fontWeight: "bold", textShadow: "0 1px 2px black" }}>Game</span>
      </div>

      {/* Nút Đăng (Nổi bật nhưng không còn viền thô) */}
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "45px", height: "45px",
          background: "rgba(255, 255, 255, 0.2)", // Pha lê trắng mờ
          border: "1px solid rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 0 15px rgba(255, 0, 80, 0.4)",
          marginBottom: "15px" // Đẩy lên cao hơn một chút
        }}>
          <span style={{ color: "white", fontWeight: "bold", fontSize: "28px" }}>+</span>
        </div>
      </Link>

      {/* Shop (Chức năng kiếm tiền sau này) */}
      <div style={{ color: "rgba(255,255,255,0.8)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px", filter: "drop-shadow(0 0 5px rgba(0,242,234,0.5))" }}>🛍️</span>
        <span style={{ fontSize: "10px", fontWeight: "bold", textShadow: "0 1px 2px black" }}>Shop</span>
      </div>

      {/* Hồ sơ */}
      <Link href="/profile" style={{ color: isActive("/profile"), textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "24px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>👤</span>
        <span style={{ fontSize: "10px", fontWeight: "bold", textShadow: "0 1px 2px black" }}>Tôi</span>
      </Link>
    </div>
  );
}
