"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/upload") return null;

  const isActive = (path: string) => pathname === path ? "#00f2ea" : "rgba(255,255,255,0.5)";

  // Icon SVG vẽ tay (Không bao giờ lỗi)
  const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
  const GameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 12h4"></path><path d="M8 10v4"></path><circle cx="17" cy="12" r="1"></circle></svg>;
  const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
  const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

  return (
    <div style={{
      position: "fixed", bottom: 20, left: "5%", width: "90%", height: "65px",
      background: "rgba(20, 20, 20, 0.8)", backdropFilter: "blur(15px)", // Nền tối mờ sang trọng
      borderRadius: "35px", border: "1px solid rgba(255,255,255,0.1)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 100, boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
    }}>
      <Link href="/" style={{ color: isActive("/"), display: "flex", flexDirection: "column", alignItems: "center", textDecoration:"none" }}>
        <HomeIcon /><span style={{fontSize:'9px', fontWeight:'bold', marginTop:'2px'}}>Trang chủ</span>
      </Link>
      <Link href="/game" style={{ color: isActive("/game"), display: "flex", flexDirection: "column", alignItems: "center", textDecoration:"none" }}>
        <GameIcon /><span style={{fontSize:'9px', fontWeight:'bold', marginTop:'2px'}}>Game</span>
      </Link>
      
      <Link href="/upload" style={{ textDecoration: "none" }}>
        <div style={{
          width: "55px", height: "55px", marginTop: "-35px",
          background: "linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)",
          borderRadius: "50%", border: "4px solid #121212", // Viền trùng màu nền
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 0 20px rgba(0, 242, 234, 0.5)"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
      </Link>

      <Link href="/inbox" style={{ color: isActive("/inbox"), display: "flex", flexDirection: "column", alignItems: "center", textDecoration:"none" }}>
        <ChatIcon /><span style={{fontSize:'9px', fontWeight:'bold', marginTop:'2px'}}>Hộp thư</span>
      </Link>
      <Link href="/profile" style={{ color: isActive("/profile"), display: "flex", flexDirection: "column", alignItems: "center", textDecoration:"none" }}>
        <UserIcon /><span style={{fontSize:'9px', fontWeight:'bold', marginTop:'2px'}}>Tôi</span>
      </Link>
    </div>
  );
}
