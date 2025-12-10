import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav"; // Nhập cái menu vừa tạo

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connect Pi App",
  description: "Mạng xã hội Video dành cho Pi Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* --- CỰC KỲ QUAN TRỌNG: SDK CỦA PI NETWORK --- */}
        <script src="https://sdk.minepi.com/pi-sdk.js" async />
      </head>
      <body className={inter.className} style={{ backgroundColor: "black", color: "white", margin: 0 }}>
        
        {/* Phần nội dung chính của từng trang sẽ hiện ở đây */}
        <div style={{ paddingBottom: "70px" }}> 
          {children}
        </div>

        {/* Thanh Menu dưới cùng (Luôn hiện thị) */}
        <BottomNav />
        
      </body>
    </html>
  );
}
