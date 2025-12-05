import { openDB } from 'idb';

const DB_NAME = 'connect_db';
const STORE_NAME = 'videos';

export interface LocalVideo {
    id: string;
    blob: Blob;
    createdAt: number;
}

// Check if we are in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';

let dbPromise: Promise<any> | null = null;

if (isBrowser) {
    dbPromise = openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
}

export const saveVideoToDB = async (id: string, blob: Blob) => {
    if (!isBrowser || !dbPromise) return;
    const db = await dbPromise;
    await db.put(STORE_NAME, { id, blob, createdAt: Date.now() });
};

export const getVideoFromDB = async (id: string): Promise<Blob | undefined> => {
    if (!isBrowser || !dbPromise) return undefined;
    const db = await dbPromise;
    const item = await db.get(STORE_NAME, id);
    return item?.blob;
};
