import React, { useState, useRef } from 'react';
import { HeartOverlay } from './HeartOverlay';

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastTap = useRef<number>(0);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      let clientX, clientY;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      // Add heart
      const newHeart = { id: now, x: clientX, y: clientY };
      setHearts(prev => [...prev, newHeart]);

      // Remove heart after animation
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1000);
    }

    lastTap.current = now;
  };

  return (
    <div 
      className="relative w-full h-full bg-black"
      onClick={handleTap}
    >
      <video 
        src={src} 
        className="w-full h-full object-cover" 
        loop 
        autoPlay 
        muted 
        playsInline
      />
      <HeartOverlay hearts={hearts} />
    </div>
  );
}
