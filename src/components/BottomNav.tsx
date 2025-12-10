"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Hàm kiểm tra xem đang ở trang nào để tô màu icon
  const isActive = (path: string) => pathname === path ? "#ff0050" : "#888";

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "60px",
      backgroundColor: "#000",
      borderTop: "1px solid #333",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 100
    }}>
      {/* Nút Trang Chủ */}
      <Link href="/" style={{ color: isActive("/"), textDecoration: "none", textAlign: "center" }}>
        <div style={{ fontSize: "24px" }}>🏠</div>
        <div style={{ fontSize: "10px" }}>Trang chủ</div>
      </Link>

      {/* Nút Đăng Bài (Nổi bật ở giữa) */}
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "45px",
          height: "45px",
          backgroundColor: "#ff0050", // Màu hồng chuẩn TikTok
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px", // Đẩy nút lên cao một chút
          boxShadow: "0 0 10px rgba(255,0,80,0.5)"
        }}>
          +
        </div>
      </Link>

      {/* Nút Tài Khoản */}
      <Link href="/profile" style={{ color: isActive("/profile"), textDecoration: "none", textAlign: "center" }}>
        <div style={{ fontSize: "24px" }}>👤</div>
        <div style={{ fontSize: "10px" }}>Tôi</div>
      </Link>
    </div>
  );
}
