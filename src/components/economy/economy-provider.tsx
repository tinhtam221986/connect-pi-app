"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { usePi } from '@/components/pi/pi-provider';
import { apiClient } from '@/lib/api-client';

interface EconomyContextType {
  balance: number;
  earn: (amount: number, source: string) => void;
  spend: (amount: number, reason: string) => boolean;
  inventory: string[];
  buyItem: (itemId: string, price: number, name: string) => boolean;
}

const EconomyContext = createContext<EconomyContextType>({
  balance: 0,
  earn: () => {},
  spend: () => false,
  inventory: [],
  buyItem: () => false,
});

export const useEconomy = () => useContext(EconomyContext);

export function EconomyProvider({ children }: { children: React.ReactNode }) {
  const { user } = usePi();
  const [balance, setBalance] = useState(1250.0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage & API
  useEffect(() => {
    // 1. Load Local
    try {
        const savedBalance = localStorage.getItem('connect_balance');
        const savedInventory = localStorage.getItem('connect_inventory');
        if (savedBalance) setBalance(parseFloat(savedBalance));
        if (savedInventory) setInventory(JSON.parse(savedInventory));
    } catch (e) {
        console.error("Failed to load economy data", e);
    }
    setIsLoaded(true);

    // 2. Sync with API if User logged in
    if (user?.uid) {
        apiClient.getUser(user.uid).then(data => {
            if (data) {
                if (data.balance !== undefined) setBalance(data.balance);
                // Merge inventory logic could go here
            }
        });
    }
  }, [user]);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
        localStorage.setItem('connect_balance', balance.toString());
        localStorage.setItem('connect_inventory', JSON.stringify(inventory));
    } catch (e) {
        console.error("Failed to save economy data", e);
    }
  }, [balance, inventory, isLoaded]);

  const earn = (amount: number, source: string) => {
    setBalance(prev => {
        const newVal = prev + amount;
        if (user?.uid) apiClient.updateUser(user.uid, { balance: newVal });
        return newVal;
    });
  };

  const spend = (amount: number, reason: string) => {
    if (balance >= amount) {
      setBalance(prev => {
          const newVal = prev - amount;
          if (user?.uid) apiClient.updateUser(user.uid, { balance: newVal });
          return newVal;
      });
      return true;
    }
    toast.error("Insufficient Pi Balance!");
    return false;
  };

  const buyItem = (itemId: string, price: number, name: string) => {
    if (inventory.includes(itemId)) {
        toast.info("You already own this item.");
        return false;
    }
    if (spend(price, `Bought ${name}`)) {
        setInventory(prev => [...prev, itemId]);
        toast.success(`Successfully bought ${name}!`);
        return true;
    }
    return false;
  };

  return (
    <EconomyContext.Provider value={{ balance, earn, spend, inventory, buyItem }}>
      {children}
    </EconomyContext.Provider>
  );
}
