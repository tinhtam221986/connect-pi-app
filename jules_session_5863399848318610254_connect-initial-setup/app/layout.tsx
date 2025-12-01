import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PiNetworkProvider } from "@/app/contexts/PiNetworkContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { PiConnectionStatus } from "@/app/components/PiConnectionStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CONNECT - Web3 Social on Pi Network",
  description: "A decentralized social video platform on Pi Network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <PiNetworkProvider>
          <ThemeProvider>
            <PiConnectionStatus />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
              {children}
            </main>
          </ThemeProvider>
        </PiNetworkProvider>
      </body>
    </html>
  );
}
