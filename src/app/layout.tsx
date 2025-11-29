import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { PiSDKProvider } from "@/components/pi/pi-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "CONNECT - Web3 Social",
  description: "A Decentralized Social Platform on Pi Network",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-background text-foreground`}>
        <PiSDKProvider>
          {children}
          <Toaster />
        </PiSDKProvider>
        <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
