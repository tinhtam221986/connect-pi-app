import React from "react";
import { cn } from "@/lib/utils";

interface ProfileFrameProps {
  src: string;
  level: number;
  className?: string;
  size?: number;
}

export function ProfileFrame({ src, level, className, size = 96 }: ProfileFrameProps) {
  // Determine frame color based on level
  let frameColor = "stroke-gray-600";
  let glowColor = "text-gray-500";

  if (level >= 10 && level < 30) {
      frameColor = "stroke-blue-500";
      glowColor = "text-blue-500";
  } else if (level >= 30 && level < 50) {
      frameColor = "stroke-purple-500";
      glowColor = "text-purple-500";
  } else if (level >= 50) {
      frameColor = "stroke-yellow-500";
      glowColor = "text-yellow-500";
  }

  const radius = size / 2;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>

       {/* Rotating Glow for high levels */}
       {level >= 50 && (
           <div className={`absolute inset-0 rounded-full blur-md opacity-50 animate-pulse ${glowColor.replace('text-', 'bg-')}`}></div>
       )}

       {/* SVG Frame */}
       <svg
          height={size}
          width={size}
          className="absolute inset-0 rotate-[-90deg] z-10"
        >
          <circle
            className={frameColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset: 0 }}
          />
        </svg>

      {/* Avatar Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Avatar"
        className="rounded-full object-cover z-0"
        style={{ width: size - 12, height: size - 12 }}
      />
    </div>
  );
}
