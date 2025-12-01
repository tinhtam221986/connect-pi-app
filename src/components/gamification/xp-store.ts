import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface XpState {
    xp: number;
    level: number;
    dailyStreak: number;
    lastLogin: number;

    addXp: (amount: number) => void;
    checkDaily: () => void;
}

export const useXpStore = create<XpState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            dailyStreak: 0,
            lastLogin: 0,

            addXp: (amount) => set(state => {
                const newXp = state.xp + amount;
                const nextLevel = Math.floor(newXp / 1000) + 1; // 1000 XP per level
                return { xp: newXp, level: nextLevel };
            }),

            checkDaily: () => {
                const now = Date.now();
                const state = get();
                const oneDay = 24 * 60 * 60 * 1000;
                const last = state.lastLogin;

                // If never logged in or more than 24h passed
                // Simplified daily check (just based on date string usually better, but timestamp ok for mock)
                if (now - last > oneDay) {
                    if (now - last < oneDay * 2) {
                        set({ dailyStreak: state.dailyStreak + 1, lastLogin: now });
                    } else {
                        set({ dailyStreak: 1, lastLogin: now });
                    }
                } else if (last === 0) {
                    set({ dailyStreak: 1, lastLogin: now });
                }
            }
        }),
        {
            name: 'pi-xp-storage',
            storage: createJSONStorage(() => localStorage),
            skipHydration: true
        }
    )
);
