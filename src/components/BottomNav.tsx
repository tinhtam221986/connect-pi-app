"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/upload") return null;
  const isActive = (path: string) => pathname === path ? "#00f2ea" : "rgba(255,255,255,0.6)";

  return (
    <div style={{
      position: "fixed", bottom: "20px", left: "10px", right: "10px", height: "60px",
      background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)",
      borderRadius: "30px", border: "1px solid rgba(255, 255, 255, 0.3)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 100, padding: "0 10px"
    }}>
      <Link href="/" style={{ color: isActive("/"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}><span style={{ fontSize: "24px" }}>🏠</span></Link>
      <Link href="/game" style={{ color: isActive("/game"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}><span style={{ fontSize: "24px" }}>🎮</span></Link>
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "45px", height: "45px", background: "linear-gradient(to right, #00f2ea, #ff0050)",
          borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
          border: "2px solid white", transform: "translateY(-15px)", boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}><span style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>+</span></div>
      </Link>
      <Link href="/inbox" style={{ color: isActive("/inbox"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}><span style={{ fontSize: "24px" }}>💬</span></Link>
      <Link href="/profile" style={{ color: isActive("/profile"), textDecoration:"none", display: "flex", flexDirection: "column", alignItems: "center" }}><span style={{ fontSize: "24px" }}>👤</span></Link>
    </div>
  );
}
