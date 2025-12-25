"use client";
import React from "react";
import { Home, ShoppingBag, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

interface BottomNavProps {
  onTabChange: (tab: string) => void;
}

export function BottomNav({ onTabChange }: BottomNavProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (path.startsWith('/')) {
        router.push(path);
    } else {
        onTabChange(path);
    }
  };

  const navItems = [
    { id: 'market', icon: ShoppingBag, label: 'Supermarket', path: '/market' },
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'inbox', icon: Mail, label: 'Inbox', path: '/inbox' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
        <nav className="flex items-center justify-around h-full px-8 pb-safe pointer-events-auto">
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className="flex flex-col items-center justify-center gap-1 text-white/80 hover:text-white transition-colors group"
                        aria-label={item.label}
                    >
                        <div className="relative">
                            <Icon size={30} strokeWidth={1.5} />
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
