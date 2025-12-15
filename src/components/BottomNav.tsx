"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, MessageCircle, PlusCircle, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

// Placeholder for Creation Modal (will be implemented in Step 4)
import { CreationModal } from "@/components/create/CreationModal";

export default function BottomNav() {
  const pathname = usePathname();
  const [showCreationModal, setShowCreationModal] = useState(false);

  // Hide nav on specific pages if needed (User said "transparent", so we keep it mostly visible but maybe hide on full-screen create?)
  // Keeping logic to hide on /upload for now as legacy, though we are moving to a modal.
  if (pathname === "/upload") return null;

  const isActive = (path: string) => pathname === path;

  // Icon styling helper
  const getIconStyle = (path: string) => {
      const active = isActive(path);
      return `w-8 h-8 transition-all duration-300 ${active ? "text-[#00f2ea] drop-shadow-[0_0_8px_rgba(0,242,234,0.8)] fill-current/20" : "text-white/70 hover:text-white"}`;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-[60px] flex justify-around items-center z-50 bg-transparent pb-safe">

        {/* SHOP (Marketplace) */}
        <Link href="/marketplace" className="flex flex-col items-center justify-center w-12 h-12">
          <ShoppingBag className={getIconStyle("/marketplace")} strokeWidth={1.5} />
        </Link>

        {/* INBOX (Messages) */}
        <Link href="/inbox" className="flex flex-col items-center justify-center w-12 h-12 relative">
          <MessageCircle className={getIconStyle("/inbox")} strokeWidth={1.5} />
          {/* Badge Placeholder */}
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">2</span>
        </Link>

        {/* CREATE (+) Button */}
        <button
            onClick={() => setShowCreationModal(true)}
            className="flex flex-col items-center justify-center w-14 h-14 active:scale-95 transition-transform"
        >
             <PlusCircle className="w-12 h-12 text-white stroke-1 hover:text-[#ff0050] transition-colors drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]" />
        </button>

        {/* CART */}
        <Link href="/cart" className="flex flex-col items-center justify-center w-12 h-12">
          <ShoppingCart className={getIconStyle("/cart")} strokeWidth={1.5} />
        </Link>

        {/* PROFILE */}
        <Link href="/profile" className="flex flex-col items-center justify-center w-12 h-12">
          <User className={getIconStyle("/profile")} strokeWidth={1.5} />
        </Link>
      </div>

      {/* Creation Modal */}
      {showCreationModal && (
          <CreationModal onClose={() => setShowCreationModal(false)} />
      )}
    </>
  );
}
