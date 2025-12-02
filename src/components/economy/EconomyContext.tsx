"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface Item {
    id: string;
    name: string;
    type: 'digital' | 'physical' | 'boost' | 'material';
    image: string;
    quantity: number;
}

interface EconomyContextType {
    balance: number;
    inventory: Item[];
    addToBalance: (amount: number) => void;
    spendBalance: (amount: number) => boolean;
    addItem: (item: Omit<Item, 'quantity'>, amount?: number) => void;
    useItem: (itemId: string) => boolean;
}

const EconomyContext = createContext<EconomyContextType>({
    balance: 0,
    inventory: [],
    addToBalance: () => {},
    spendBalance: () => false,
    addItem: () => {},
    useItem: () => false,
});

export function useEconomy() {
    return useContext(EconomyContext);
}

export function EconomyProvider({ children }: { children: React.ReactNode }) {
    const [balance, setBalance] = useState(1000); // Initial mock balance
    const [inventory, setInventory] = useState<Item[]>([
        { id: "dna_common", name: "Common DNA", type: "material", image: "🧬", quantity: 2 }
    ]);

    const addToBalance = (amount: number) => {
        setBalance(prev => prev + amount);
    };

    const spendBalance = (amount: number) => {
        if (balance >= amount) {
            setBalance(prev => prev - amount);
            return true;
        }
        toast.error("Insufficient balance!");
        return false;
    };

    const addItem = (item: Omit<Item, 'quantity'>, amount = 1) => {
        setInventory(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + amount } : i);
            }
            return [...prev, { ...item, quantity: amount }];
        });
        toast.success(`Received: ${item.name} x${amount}`);
    };

    const useItem = (itemId: string) => {
        let success = false;
        setInventory(prev => {
            const existing = prev.find(i => i.id === itemId);
            if (existing && existing.quantity > 0) {
                success = true;
                if (existing.quantity === 1) {
                    return prev.filter(i => i.id !== itemId);
                }
                return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
            }
            return prev;
        });
        return success;
    };

    return (
        <EconomyContext.Provider value={{ balance, inventory, addToBalance, spendBalance, addItem, useItem }}>
            {children}
        </EconomyContext.Provider>
    );
}
