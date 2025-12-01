"use client";

import React, { useEffect, useState } from "react";
import { usePi } from "@/app/contexts/PiNetworkContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export const PiConnectionStatus = () => {
  const { status, authenticate, user } = usePi();
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after success
  useEffect(() => {
    if (status === "connected") {
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!isVisible && status === "connected") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-sm"
      >
        <div
          className={`px-4 py-2 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-md border ${
            status === "connected"
              ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-300"
              : status === "error"
              ? "bg-red-500/10 border-red-500 text-red-700 dark:text-red-300"
              : "bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300"
          }`}
        >
            {status === "idle" && (
                <>
                    <span className="text-sm font-medium">Ready to Connect</span>
                    <button onClick={authenticate} className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700">Connect Pi</button>
                </>
            )}
            {status === "loading" && (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Đang kết nối Pi Network...</span>
                </>
            )}
            {status === "connected" && (
                <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Đã kết nối: @{user?.username}</span>
                </>
            )}
            {status === "error" && (
                <>
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Lỗi kết nối</span>
                    <button onClick={authenticate} className="ml-2 text-xs underline">Thử lại</button>
                </>
            )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
