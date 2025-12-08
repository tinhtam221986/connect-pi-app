import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    const db = getDB();
    // In a real app, we would verify the session/token here.
    // For now, we return the Mock Profile but enriched with Real Cloudinary Videos.

    // 1. Get Base Profile (Mock)
    let user = await db.user.findByUid("mock_uid_12345");
    if (username && username !== user?.username) {
        // If requesting a different user, we might need to find them or just return a generic structure
        user = { ...user, username: username, uid: `mock_${username}` };
    }

    // 2. Fetch Real Videos from Cloudinary
    let videos = [];
    if (process.env.CLOUDINARY_API_KEY && username) {
        try {
            const result = await cloudinary.search
                .expression(`folder:connect-pi-app AND context.username:${username}`)
                .sort_by('created_at', 'desc')
                .max_results(20)
                .execute();

            videos = result.resources.map((res: any) => ({
                id: res.public_id,
                url: res.secure_url,
                thumbnail: res.secure_url.replace(/\.[^/.]+$/, ".jpg"),
                description: res.context?.custom?.caption || "No description",
                createdAt: new Date(res.created_at).getTime()
            }));
        } catch (e) {
            console.error("Cloudinary Profile Search Error", e);
        }
    }

    return NextResponse.json({ ...user, videos });
  } catch (error) {
    console.error("Profile API Error", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    const updated = await db.user.update("mock_uid_12345", body);
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
