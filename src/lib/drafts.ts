import { openDB } from 'idb';

const DB_NAME = 'connect-pi-drafts';
const STORE_NAME = 'video_drafts';

export interface Draft {
  id: string;
  videoFile: File | Blob;
  thumbnail?: string;
  metadata: {
    caption: string;
    trimStart: number;
    trimEnd: number;
    music: string | null;
    effects: string[];
  };
  createdAt: number;
}

export async function initDraftsDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveDraft(draft: Draft) {
  const db = await initDraftsDB();
  await db.put(STORE_NAME, draft);
}

export async function getDrafts(): Promise<Draft[]> {
  const db = await initDraftsDB();
  return db.getAll(STORE_NAME);
}

export async function getDraft(id: string): Promise<Draft | undefined> {
  const db = await initDraftsDB();
  return db.get(STORE_NAME, id);
}

export async function deleteDraft(id: string) {
  const db = await initDraftsDB();
  await db.delete(STORE_NAME, id);
}
