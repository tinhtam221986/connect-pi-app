import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function GET(request: Request) {
    return NextResponse.json({ success: true, videos: db.videos });
}
