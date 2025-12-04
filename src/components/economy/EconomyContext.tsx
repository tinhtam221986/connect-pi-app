"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

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
    inventory: string[];
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
    const [balance, setBalance] = useState(0);
    const [level, setLevel] = useState(1);
    const [inventory, setInventory] = useState<string[]>([]);
    const [myVideos, setMyVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        try {
            // Load persistent profile from backend
            const profile = await apiClient.user.getProfile();
            if (profile && !profile.error) {
                setBalance(profile.balance);
                setLevel(profile.level);
                setInventory(profile.inventory || []);
            }

            // Load local "My Videos" cache
            const localVideos = localStorage.getItem('connect_my_videos');
            if (localVideos) {
                try {
                    setMyVideos(JSON.parse(localVideos));
                } catch (e) {
                    console.error("Failed to parse local videos", e);
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
        refresh();
    }, []);

    return (
        <EconomyContext.Provider value={{ balance, level, inventory, myVideos, isLoading, refresh, addBalance, addVideo }}>
            {children}
        </EconomyContext.Provider>
    );
}

export const useEconomy = () => useContext(EconomyContext);
