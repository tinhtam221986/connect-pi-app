import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartOverlayProps {
  hearts: { id: number; x: number; y: number }[];
}

export function HeartOverlay({ hearts }: HeartOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1.5, opacity: 1, y: -100 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              position: 'absolute', 
              left: heart.x - 40, // Center the heart
              top: heart.y - 40 
            }}
          >
            <Heart className="w-20 h-20 fill-red-500 text-red-500 drop-shadow-lg" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
