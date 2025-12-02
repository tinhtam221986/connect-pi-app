// Abstract Database Interface
export interface Database {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    user: UserRepository;
    video: VideoRepository;
    market: MarketRepository;
}

export interface User {
    uid: string;
    username: string;
    level: number;
    balance: number;
    inventory: string[];
}

export interface Video {
    id: string;
    author: string;
    authorId: string;
    description: string;
    videoUrl: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: number;
    songName?: string;
}

export interface MarketItem {
    id: string;
    name: string;
    price: number;
    seller: string;
    sellerId: string;
    imageUrl: string;
    category: 'pet' | 'item' | 'land' | 'other';
    description?: string;
}

export interface UserRepository {
    create(user: User): Promise<User>;
    findByUid(uid: string): Promise<User | null>;
    update(uid: string, data: Partial<User>): Promise<User>;
}

export interface VideoRepository {
    create(video: Video): Promise<Video>;
    findAll(): Promise<Video[]>;
}

export interface MarketRepository {
    create(item: MarketItem): Promise<MarketItem>;
    findAll(): Promise<MarketItem[]>;
    buy(itemId: string, buyerId: string): Promise<boolean>;
}

// --- MOCK IMPLEMENTATION (In-Memory) ---
class MockDB implements Database {
    private users: Map<string, User> = new Map();
    private videos: Video[] = [];
    private marketItems: Map<string, MarketItem> = new Map();

    async connect(): Promise<void> {
        console.log("MockDB Connected");
    }

    async disconnect(): Promise<void> {
        console.log("MockDB Disconnected");
    }

    get user(): UserRepository {
        return {
            create: async (user: User) => {
                this.users.set(user.uid, user);
                return user;
            },
            findByUid: async (uid: string) => {
                return this.users.get(uid) || null;
            },
            update: async (uid: string, data: Partial<User>) => {
                const existing = this.users.get(uid);
                if (!existing) throw new Error("User not found");
                const updated = { ...existing, ...data };
                this.users.set(uid, updated);
                return updated;
            }
        };
    }

    get video(): VideoRepository {
        return {
            create: async (video: Video) => {
                this.videos.unshift(video); // Add to top
                return video;
            },
            findAll: async () => {
                return [...this.videos];
            }
        };
    }

    get market(): MarketRepository {
        return {
            create: async (item: MarketItem) => {
                this.marketItems.set(item.id, item);
                return item;
            },
            findAll: async () => {
                return Array.from(this.marketItems.values());
            },
            buy: async (itemId: string, buyerId: string) => {
                const item = this.marketItems.get(itemId);
                if (!item) return false;
                // Simplified buy logic: just remove from market for now
                this.marketItems.delete(itemId);
                return true;
            }
        };
    }
}

// --- MONGO IMPLEMENTATION (Structure) ---
class MongoDB implements Database {
    async connect(): Promise<void> {
        console.log("MongoDB Adapter Loaded (Not Connected)");
    }
    async disconnect(): Promise<void> {}
    get user(): UserRepository { throw new Error("Not implemented"); }
    get video(): VideoRepository { throw new Error("Not implemented"); }
    get market(): MarketRepository { throw new Error("Not implemented"); }
}

// --- FACTORY ---
let dbInstance: Database | null = null;

export function getDB(): Database {
    if (dbInstance) return dbInstance;

    if (process.env.DB_TYPE === 'mongo') {
        dbInstance = new MongoDB();
    } else {
        dbInstance = new MockDB();
    }

    // Seed Mock DB
    if (dbInstance instanceof MockDB) {
        // Seed User
        dbInstance.user.create({
            uid: "mock_uid_12345",
            username: "Chrome_Tester",
            level: 5,
            balance: 1250,
            inventory: ["pet_egg_01", "feed_bag"]
        });

        // Seed Videos
        dbInstance.video.create({
            id: "v1",
            author: "CryptoQueen",
            authorId: "user_1",
            description: "Checking out the new CONNECT app on Pi Network! Amazing! 🚀 #PiNetwork #Web3",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            likes: 1205,
            comments: 45,
            shares: 12,
            timestamp: Date.now(),
            songName: "Original Sound - CryptoQueen"
        });
        dbInstance.video.create({
            id: "v2",
            author: "TravelWithMe",
            authorId: "user_2",
            description: "Beautiful sunset in Bali. Funded by Pi! 🌅",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            likes: 8500,
            comments: 342,
            shares: 150,
            timestamp: Date.now() - 100000,
            songName: "Original Sound - TravelWithMe"
        });

        // Seed Market
        dbInstance.market.create({
            id: "m1",
            name: "Mystic Dragon Egg",
            price: 500,
            seller: "DragonMaster",
            sellerId: "user_dm",
            category: "pet",
            imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=dragon"
        });
        dbInstance.market.create({
            id: "m2",
            name: "Virtual Land Plot #402",
            price: 2500,
            seller: "PiLandBaron",
            sellerId: "user_lb",
            category: "land",
            imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=land"
        });
    }

    return dbInstance;
}
