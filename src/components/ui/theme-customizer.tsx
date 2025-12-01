"use client";

import { useTheme } from "next-themes";
import { Check, Moon, Sun, Monitor, Palette, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "Zinc", value: "0 0% 20%", class: "bg-zinc-900" },
  { name: "Red", value: "0 72% 51%", class: "bg-red-600" },
  { name: "Orange", value: "24 94% 50%", class: "bg-orange-500" },
  { name: "Green", value: "142 76% 36%", class: "bg-green-600" },
  { name: "Blue", value: "221 83% 53%", class: "bg-blue-600" },
  { name: "Violet", value: "262 83% 58%", class: "bg-violet-600" },
  { name: "Pink", value: "330 81% 60%", class: "bg-pink-600" },
];

export function ThemeCustomizer({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [activeColor, setActiveColor] = useState("Violet");

  // Apply color change
  const handleColorChange = (color: typeof COLORS[0]) => {
    setActiveColor(color.name);
    const root = document.documentElement;
    // Set --primary variable (HSL)
    root.style.setProperty("--primary", color.value);
    // Also update ring for focus states
    root.style.setProperty("--ring", color.value);

    // For chart variables, we might want to shift them too, but for now just primary.
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full sm:w-96 bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Palette size={20} className="text-primary" />
                Theme Studio
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
        </div>

        <div className="space-y-6">
            {/* Mode */}
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Display Mode</label>
                <div className="grid grid-cols-3 gap-2 bg-gray-950 p-1 rounded-lg border border-gray-800">
                    <button
                        onClick={() => setTheme("light")}
                        className={cn("flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all", theme === 'light' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white")}
                    >
                        <Sun size={16} /> Light
                    </button>
                    <button
                        onClick={() => setTheme("dark")}
                        className={cn("flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all", theme === 'dark' ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-white")}
                    >
                        <Moon size={16} /> Dark
                    </button>
                    <button
                        onClick={() => setTheme("system")}
                        className={cn("flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all", theme === 'system' ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-white")}
                    >
                        <Monitor size={16} /> System
                    </button>
                </div>
            </div>

            {/* Colors */}
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Primary Color</label>
                <div className="grid grid-cols-7 gap-2">
                    {COLORS.map((color) => (
                        <button
                            key={color.name}
                            onClick={() => handleColorChange(color)}
                            className={cn(
                                "w-full aspect-square rounded-full flex items-center justify-center transition-transform hover:scale-110 border-2",
                                activeColor === color.name ? "border-white" : "border-transparent",
                                color.class
                            )}
                            title={color.name}
                        >
                            {activeColor === color.name && <Check size={12} className="text-white" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Fonts (Simulated) */}
            <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
                    <Type size={14} /> Typography
                 </label>
                 <div className="grid grid-cols-2 gap-2">
                     <button className="px-3 py-2 bg-gray-800 rounded-md text-sm text-left border border-gray-700 hover:border-gray-500">Sans Serif (Default)</button>
                     <button className="px-3 py-2 bg-gray-800 rounded-md text-sm text-left border border-gray-700 hover:border-gray-500 font-mono">Monospace</button>
                 </div>
            </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-800">
             <p className="text-xs text-center text-gray-500">
                Unlock more dynamic themes with <span className="text-yellow-500 font-bold">Pi Premium</span>
             </p>
        </div>
      </div>
    </div>
  );
}
