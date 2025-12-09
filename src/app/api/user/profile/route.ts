import { NextResponse } from 'next/server';
import { getDB, User } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';
import { SmartContractService } from '@/lib/smart-contract-service';

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
    let user: User | null = await db.user.findByUid("mock_uid_12345");

    // Default fallback if user is not found or null
    if (!user) {
        user = {
            uid: "mock_uid_12345",
            username: "Chrome_Tester",
            level: 1,
            balance: 0,
            inventory: []
        };
    }

    if (username && username !== user.username) {
        // If requesting a different user, create a full mock user structure
        user = {
            ...user,
            username: username,
            uid: `mock_${username}`,
            // Ensure these persist or have defaults if 'user' was somehow partial (though Typescript protects that now)
            level: user.level || 1,
            balance: user.balance || 0,
            inventory: user.inventory || []
        };
    }

    // 2. Fetch Real Videos from Cloudinary
    let videos: any[] = [];
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

    // 2.5. Merge with Immediate DB Cache (Fix for indexing latency)
    try {
        const scFeedItems = await SmartContractService.getFeedItems();
        const userImmediateItems = scFeedItems.filter((item: any) => item.username === username);

        const existingIds = new Set(videos.map(v => v.id));

        // Add items from DB that are not yet in Cloudinary search results
        // Reverse to maintain order if unshifting, or just iterate normal?
        // scFeedItems is usually sorted newest first.
        for (const item of userImmediateItems) {
            if (!existingIds.has(item.id)) {
                videos.unshift({
                    id: item.id,
                    url: item.url,
                    thumbnail: item.thumbnail,
                    description: item.description,
                    createdAt: new Date(item.created_at).getTime()
                });
                existingIds.add(item.id);
            }
        }

        // Re-sort just in case
        videos.sort((a, b) => b.createdAt - a.createdAt);

    } catch (e) {
        console.error("Smart Contract Feed Sync Error", e);
    }

    // 3. Sync with Smart Contract Service (Persistence)
    try {
        const scId = 'user_current'; // Using single user for demo simplicity
        const scState = await SmartContractService.getBalance(scId);
        user.balance = scState.tokenBalance;
        (user as any).inventory = scState.nfts;
    } catch (e) {
        console.error("Smart Contract Sync Error", e);
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
