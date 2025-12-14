import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PiSDKProvider } from "@/components/pi/pi-provider";
import { LanguageProvider } from "@/components/i18n/language-provider";
// import BottomNav from "@/components/BottomNav"; // Tạm tắt ở đây để trang con tự gọi

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
        {/* 🟢 DÂY NGUỒN: MÃ KÍCH HOẠT PI SDK (Bắt buộc phải có dòng này) */}
        <script src="https://sdk.minepi.com/pi-sdk.js" async></script>
        
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={inter.className} style={{ backgroundColor: "black", margin: 0, padding: 0 }}>
        <LanguageProvider>
          <PiSDKProvider>
            {children}
          </PiSDKProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
