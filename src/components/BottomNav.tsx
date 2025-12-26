"use client";
import React, { useState } from "react";
import { Home, ShoppingBag, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onTabChange: (tab: string) => void;
  initialTab?: string;
}

export function BottomNav({ onTabChange, initialTab = 'home' }: BottomNavProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleNavigation = (item: { id: string, path: string }) => {
    setActiveTab(item.id);
    if (item.path.startsWith('/')) {
        // For full page navigations, we let Next.js router handle it
        router.push(item.path);
    } else {
        // For internal view switching, we use the callback
        onTabChange(item.id);
    }
  };

  const navItems = [
    { id: 'market', icon: ShoppingBag, label: 'Supermarket', path: '/market' },
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'inbox', icon: Mail, label: 'Inbox', path: '/inbox' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-24 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none">
        <nav className="flex items-center justify-around h-full px-8 pb-safe pointer-events-auto">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => handleNavigation(item)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 transition-colors group",
                          isActive ? "text-white" : "text-white/60 hover:text-white"
                        )}
                        aria-label={item.label}
                    >
                        <div className="relative">
                            <Icon size={30} strokeWidth={isActive ? 2 : 1.5} />
                            {item.id === 'inbox' && (
                                <div className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-black" />
                            )}
                        </div>
                    </button>
                );
            })}
        </nav>
    </div>
  );
}

export default BottomNav;
