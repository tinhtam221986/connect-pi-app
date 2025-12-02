// Abstract Database Interface
export interface Database {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    user: UserRepository;
}

export interface User {
    uid: string;
    username: string;
    level: number;
    balance: number;
    inventory: string[];
}

export interface UserRepository {
    create(user: User): Promise<User>;
    findByUid(uid: string): Promise<User | null>;
    update(uid: string, data: Partial<User>): Promise<User>;
}

// --- MOCK IMPLEMENTATION (In-Memory) ---
class MockDB implements Database {
    private users: Map<string, User> = new Map();

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
}

// --- MONGO IMPLEMENTATION (Structure) ---
// Note: This requires 'mongoose' installed. We mock the class for now to avoid dependency errors.
class MongoDB implements Database {
    async connect(): Promise<void> {
        // if (process.env.MONGODB_URI) await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Adapter Loaded (Not Connected)");
    }
    async disconnect(): Promise<void> {
        // await mongoose.disconnect();
    }
    get user(): UserRepository {
        throw new Error("MongoDB User Repo not implemented yet");
    }
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

    // Seed Mock DB for development
    if (dbInstance instanceof MockDB) {
        dbInstance.user.create({
            uid: "mock_uid_12345",
            username: "Chrome_Tester",
            level: 5,
            balance: 1250,
            inventory: ["pet_egg_01", "feed_bag"]
        });
    }

    return dbInstance;
}
