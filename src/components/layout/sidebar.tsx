"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, MessageCircle, User, Zap, Gift, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "For You", href: "/" },
    { icon: Compass, label: "Explore", href: "/explore" },
    { icon: Zap, label: "Live Battles", href: "/live", active: true },
    { icon: ShoppingBag, label: "Shop", href: "/shop" },
    { icon: MessageCircle, label: "Messages", href: "/messages" },
    { icon: User, label: "Profile", href: "/profile" },
  ]

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card/50 backdrop-blur-xl md:flex fixed left-0 top-0 z-40">
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          CONNECT
        </span>
        <span className="ml-2 text-xs font-mono text-muted-foreground">Beta</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3", 
                  pathname === item.href && "bg-primary/10 text-primary"
                )}
              >
                <item.icon className={cn("h-5 w-5", item.active && "text-yellow-500 animate-pulse")} />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-8 px-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Your Creator DAO
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-green-500 rounded-full" />
              </div>
              <span className="text-xs font-mono">Lvl. 12</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Next reward: <span className="text-primary font-bold">Gold Skin NFT</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-background/50">
        <div className="rounded-lg border p-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-pink-500" />
            <span className="text-sm font-semibold">Daily Streak</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Check in for 5 more days to unlock <span className="text-white font-bold">Pi Badge</span>
          </p>
          <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Check In
          </Button>
        </div>
      </div>
    </aside>
  )
}
