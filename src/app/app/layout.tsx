"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ShoppingCart, Mail, User, ChevronUp, Plus } from 'lucide-react';
import { usePi } from '@/components/pi/pi-provider';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

// This new AppLayout component provides the persistent UI shell for the entire
// authenticated portion of the application.
export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user } = usePi();
    const [navVisible, setNavVisible] = useState(true);
    const pathname = usePathname();

    // The global navigation is now placed here, outside of the page content.
    // This ensures it persists across all pages within the /app route group.
    const GlobalNav = () => (
        <div className="absolute bottom-0 left-0 right-0 z-50 p-3 pb-safe pointer-events-none">
            <div className="flex justify-between items-end w-full">
                {/* Left Cluster: Toggle and Main Navigation */}
                <div className="flex items-end gap-2 pointer-events-auto">
                    {/* Vertically stacked Toggle and Home buttons */}
                    <div className="flex flex-col items-center gap-1">
                        <button
                            onClick={() => setNavVisible(!navVisible)}
                            className="p-1 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-white/20 transition-opacity"
                            aria-label="Toggle Navigation"
                        >
                            <ChevronUp className={cn("w-5 h-5 text-white transition-transform duration-300", navVisible && "rotate-180")} />
                        </button>
                        <Link href="/app" className="p-2 rounded-lg bg-black/30 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                            <Home className="w-6 h-6" />
                        </Link>
                    </div>
                    {/* The rest of the collapsible navigation items */}
                    <div className={cn(
                        "flex items-center gap-2 sm:gap-4 transition-all duration-300",
                        navVisible ? "opacity-100" : "opacity-0 -translate-x-4 pointer-events-none"
                    )}>
                        <Link href="/app/market" className="p-2 rounded-lg bg-black/30 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                        </Link>
                        <Link href="/app/inbox" className="p-2 rounded-lg bg-black/30 backdrop-blur-md relative text-white hover:bg-white/20 transition-colors">
                            <Mail className="w-6 h-6" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></div>
                        </Link>
                        <Link href={user ? `/app/profile/${user.username}` : '/app/profile'} className="p-2 rounded-lg bg-black/30 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-6 h-6 rounded-full" alt="My Profile"/>
                            ) : (
                                <User className="w-6 h-6" />
                            )}
                        </Link>
                    </div>
                </div>

                {/* Right Cluster: Upload ONLY */}
                <div className="flex items-end gap-2 pointer-events-auto">
                    {/* The Upload button is hidden if we are already on the upload page */}
                    {pathname !== '/upload' && (
                         <Link href="/upload" aria-label="Upload Video" className="w-16 h-16 flex items-center justify-center rounded-full border-4 border-black bg-white active:bg-gray-200 transition-all transform active:scale-90 shadow-lg">
                            <Plus className="w-10 h-10 text-black" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        // The main container ensures the app takes up the full screen and provides a relative
        // positioning context for the absolute-positioned global navigation.
        <div className="w-full h-[100dvh] bg-black relative overflow-hidden">
            <main className="w-full h-full">{children}</main>
            <GlobalNav />
        </div>
    );
}
