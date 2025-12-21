"use client";
import React, { useState } from "react";
import { Home, ShoppingBag, Plus, Gamepad2, User, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // Determine effective active tab if not provided via props
  const effectiveActiveTab = activeTab || (() => {
      if (!pathname) return 'home';
      if (pathname.startsWith('/game')) return 'game';
      if (pathname.startsWith('/profile')) return 'profile';
      if (pathname.startsWith('/upload')) return 'create';
      return 'home';
  })();

  const handleTabClick = (tabId: string) => {
      if (onTabChange) {
          onTabChange(tabId);
      } else {
          // Fallback routing for standalone pages
          switch(tabId) {
              case 'home': router.push('/'); break;
              case 'market': router.push('/'); break; // Fallback
              case 'create': router.push('/upload'); break;
              case 'game': router.push('/game'); break;
              case 'profile': router.push('/profile'); break;
              default: router.push('/');
          }
      }
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'market', icon: ShoppingBag, label: 'Shop' },
    { id: 'create', icon: Plus, label: 'Create', isAction: true },
    { id: 'game', icon: Gamepad2, label: 'Game' },
    { id: 'profile', icon: User, label: 'Me' },
  ];

  if (!isVisible) {
      return (
          <button
            onClick={() => setIsVisible(true)}
            className="fixed bottom-6 right-4 z-50 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all animate-in fade-in slide-in-from-bottom-4"
            aria-label="Show Navigation"
          >
              <ChevronUp size={24} />
          </button>
      )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-safe pointer-events-none animate-in slide-in-from-bottom-full duration-300">

        {/* Toggle Button (Attached to top of nav) */}
        <button
            onClick={() => setIsVisible(false)}
            className="pointer-events-auto mb-1 bg-transparent p-1 rounded-full text-white/30 hover:text-white transition-colors"
            aria-label="Hide Navigation"
        >
            <ChevronDown size={24} />
        </button>

        {/* Nav Bar */}
        <nav className="w-full flex justify-around items-end pb-4 pt-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-auto">
            {navItems.map((item) => {
                const isActive = effectiveActiveTab === item.id;
                const Icon = item.icon;

                if (item.isAction) {
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className="flex flex-col items-center justify-center active:scale-95 transition-transform"
                            aria-label="Create"
                        >
                             <div className="relative p-2">
                                <Plus size={36} className="text-white stroke-[1.5px] drop-shadow-lg" />
                                {/* Subtle glow on hover */}
                                <div className="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 hover:opacity-100 transition-opacity" />
                             </div>
                        </button>
                    )
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`flex flex-col items-center gap-1 min-w-[60px] transition-colors duration-200 group`}
                        aria-label={item.label}
                    >
                        <Icon
                            size={28}
                            strokeWidth={isActive ? 2.5 : 1.5}
                            className={`${isActive ? "text-white fill-white/10 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-white/70 group-hover:text-white"}`}
                        />
                        {/* Dot indicator for active state (optional, keeping minimal) */}
                    </button>
                );
            })}
        </nav>
    </div>
  );
}

export default BottomNav;
