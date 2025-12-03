"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface EconomyState {
    balance: number;
    level: number;
    inventory: string[];
    isLoading: boolean;
    refresh: () => Promise<void>;
    addBalance: (amount: number) => void; // Optimistic
}

const EconomyContext = createContext<EconomyState>({
    balance: 0,
    level: 1,
    inventory: [],
    isLoading: true,
    refresh: async () => {},
    addBalance: () => {}
});

export function EconomyProvider({ children }: { children: React.ReactNode }) {
    const [balance, setBalance] = useState(0);
    const [level, setLevel] = useState(1);
    const [inventory, setInventory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        try {
            const profile = await apiClient.user.getProfile();
            if (profile && !profile.error) {
                setBalance(profile.balance);
                setLevel(profile.level);
                setInventory(profile.inventory || []);
            }
        } catch (e) {
            console.error("Failed to fetch economy state", e);
        } finally {
            setIsLoading(false);
        }
    };

    const addBalance = (amount: number) => {
        setBalance(prev => prev + amount);
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <EconomyContext.Provider value={{ balance, level, inventory, isLoading, refresh, addBalance }}>
            {children}
        </EconomyContext.Provider>
    );
}

export const useEconomy = () => useContext(EconomyContext);
