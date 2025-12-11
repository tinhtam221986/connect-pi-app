import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connect Pi Network",
  description: "Mạng xã hội Video Web3 trên Pi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* --- 🟢 QUAN TRỌNG: MÃ KÍCH HOẠT PI SDK --- */}
        <script src="https://sdk.minepi.com/pi-sdk.js" async></script>
        
        {/* Chặn phóng to thu nhỏ để App giống Native App nhất */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={inter.className} style={{ backgroundColor: "black", margin: 0, padding: 0 }}>
        {children}
        {/* Thanh Menu dưới đáy luôn hiện diện */}
        <BottomNav />
      </body>
    </html>
  );
}
