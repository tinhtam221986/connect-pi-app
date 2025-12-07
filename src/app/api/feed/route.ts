import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const db = getDB();
    await db.connect();
    const videos = await db.video.findAll();
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Feed API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}
