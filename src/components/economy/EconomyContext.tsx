"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { usePi } from '@/components/pi/pi-provider';

export interface VideoItem {
    id: string;
    url: string;
    thumbnail: string;
    description?: string;
    createdAt: number;
}

interface EconomyState {
    balance: number;
    level: number;
    inventory: any[];
    myVideos: VideoItem[];
    isLoading: boolean;
    refresh: () => Promise<void>;
    addBalance: (amount: number) => void;
    addVideo: (video: VideoItem) => void;
}

const EconomyContext = createContext<EconomyState>({
    balance: 0,
    level: 1,
    inventory: [],
    myVideos: [],
    isLoading: true,
    refresh: async () => {},
    addBalance: () => {},
    addVideo: () => {}
});

export function EconomyProvider({ children }: { children: React.ReactNode }) {
    const { user } = usePi();
    const [balance, setBalance] = useState(0);
    const [level, setLevel] = useState(1);
    const [inventory, setInventory] = useState<any[]>([]);
    const [myVideos, setMyVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        try {
            if (!user?.username) return;
            // Load persistent profile from backend
            const profile = await apiClient.user.getProfile(user.username);
            if (profile && !profile.error) {
                setBalance(profile.balance);
                setLevel(profile.level);
                setInventory(profile.inventory || []);
                if (profile.videos) {
                    setMyVideos(profile.videos);
                }
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

    const addVideo = (video: VideoItem) => {
        setMyVideos(prev => {
            const updated = [video, ...prev];
            localStorage.setItem('connect_my_videos', JSON.stringify(updated));
            return updated;
        });
    };

    useEffect(() => {
        if (user?.username) {
            refresh();
        }
    }, [user?.username]);

    return (
        <EconomyContext.Provider value={{ balance, level, inventory, myVideos, isLoading, refresh, addBalance, addVideo }}>
            {children}
        </EconomyContext.Provider>
    );
}

export const useEconomy = () => useContext(EconomyContext);
