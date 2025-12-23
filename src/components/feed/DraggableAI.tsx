"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { toast } from 'sonner';

export function DraggableAI() {
  const constraintsRef = useRef(null);

  const handleClick = () => {
    toast.info("AI Assistant: How can I help you today?");
  };

  return (
    <>
      {/* Constraints container to prevent dragging off screen too far */}
      <div ref={constraintsRef} className="absolute inset-0 pointer-events-none z-50 overflow-hidden" />

      <motion.div
        drag
        dragConstraints={constraintsRef}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        dragElastic={0.2}
        className="absolute right-4 bottom-40 z-50 cursor-move touch-none"
        onClick={handleClick}
        initial={{ x: 0, y: 0 }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg border-2 border-white/20 flex items-center justify-center backdrop-blur-md">
          <Bot className="w-7 h-7 text-white drop-shadow-md" />
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-bold backdrop-blur-sm whitespace-nowrap">
          AI
        </div>
      </motion.div>
    </>
  );
}
