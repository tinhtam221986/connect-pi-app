"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ShoppingCart, Mail, Plus, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HomePopupMenu } from '@/components/ui/HomePopupMenu';

// This new AppLayout component provides the persistent UI shell for the entire
// authenticated portion of the application.
export default function AppLayout({ children }: { children: React.ReactNode }) {

    // The global navigation is now placed here, outside of the page content.
    // This ensures it persists across all pages within the /app route group.
    const GlobalNav = () => {
        const [isNavExpanded, setIsNavExpanded] = useState(true);

        return (
            <div className="absolute bottom-0 left-0 right-0 z-50 flex justify-center pb-safe pointer-events-none">
                <div className="flex items-center justify-center gap-4 p-2 pointer-events-auto">
                    {/* Nút Xổ xuống (V) - Toggle Button */}
                    <button
                        onClick={() => setIsNavExpanded(!isNavExpanded)}
                        className="text-white transition-transform duration-300"
                        aria-label="Toggle Navigation"
                    >
                        {isNavExpanded ? <ChevronDown className="w-8 h-8 drop-shadow-lg" /> : <ChevronUp className="w-8 h-8 drop-shadow-lg" />}
                    </button>

                    {/* Container for the 5 collapsible buttons */}
                    <div className={cn(
                        "flex items-center gap-4 transition-all duration-300",
                        isNavExpanded ? "opacity-100 max-w-screen-sm" : "opacity-0 max-w-0 pointer-events-none overflow-hidden"
                    )}>
                        {/* Hộp thư */}
                        <Link href="/notifications" className="text-white hover:text-gray-300 transition-colors">
                            <Mail className="w-8 h-8 drop-shadow-lg" />
                        </Link>

                        {/* HOME with Pop-up Menu */}
                        <HomePopupMenu>
                            <button className="text-white hover:text-gray-300 transition-colors">
                                <Home className="w-8 h-8 drop-shadow-lg" />
                            </button>
                        </HomePopupMenu>

                        {/* Nút (+) */}
                        <Link href="/upload" className="text-black bg-white rounded-full p-1 active:scale-95 transition-transform">
                            <Plus className="w-8 h-8" />
                        </Link>

                        {/* Siêu thị toàn cầu */}
                        <Link href="/marketplace" className="text-white hover:text-gray-300 transition-colors">
                            <ShoppingCart className="w-8 h-8 drop-shadow-lg" />
                        </Link>

                        {/* Giỏ hàng */}
                        <Link href="/cart" className="text-white hover:text-gray-300 transition-colors">
                            <ShoppingBag className="w-8 h-8 drop-shadow-lg" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        // The main container ensures the app takes up the full screen and provides a relative
        // positioning context for the absolute-positioned global navigation.
        <div className="w-full h-[100dvh] bg-black relative overflow-hidden">
            <main className="w-full h-full">{children}</main>
            <GlobalNav />
        </div>
    );
}
