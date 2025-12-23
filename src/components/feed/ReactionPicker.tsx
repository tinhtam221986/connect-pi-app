"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REACTIONS = [
  { id: 'like', emoji: '👍', label: 'Like' },
  { id: 'love', emoji: '❤️', label: 'Love' },
  { id: 'haha', emoji: '😆', label: 'Haha' },
  { id: 'wow', emoji: '😮', label: 'Wow' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'angry', emoji: '😡', label: 'Angry' },
];

interface ReactionPickerProps {
  isVisible: boolean;
  onSelect: (reactionId: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ isVisible, onSelect, onClose }: ReactionPickerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="absolute right-14 top-0 bg-white dark:bg-zinc-800 rounded-full shadow-xl p-2 flex gap-2 items-center z-50 border border-gray-200 dark:border-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            {REACTIONS.map((reaction) => (
              <motion.button
                key={reaction.id}
                whileHover={{ scale: 1.3, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl hover:drop-shadow-md transition-all"
                onClick={() => onSelect(reaction.id)}
                title={reaction.label}
              >
                {reaction.emoji}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
