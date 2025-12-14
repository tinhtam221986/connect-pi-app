import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db'; // Keeping this for the user part for now
import { connectDB } from '@/lib/mongodb';
import Video from '@/models/Video';
import { SmartContractService } from '@/lib/smart-contract-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    const db = getDB();

    // 1. Get Base Profile (Mock)
    let user: any = await db.user.findByUid("mock_uid_12345");

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
            level: user.level || 1,
            balance: user.balance || 0,
            inventory: user.inventory || []
        };
    }

    // 2. Fetch Real Videos from MongoDB
    let videos: any[] = [];
    if (username) {
        try {
            await connectDB();

            // Fetch videos where author.username matches the requested username
            // Sorted by newest first (descending createdAt)
            const mongoVideos = await Video.find({ "author.username": username })
                                           .sort({ createdAt: -1 })
                                           .lean();

            videos = mongoVideos.map((v: any) => ({
                id: v._id.toString(), // Use Mongo ID
                url: v.videoUrl,
                thumbnail: v.videoUrl.replace(/\.[^/.]+$/, ".jpg"), // Simple rule for now
                description: v.caption,
                createdAt: v.createdAt ? new Date(v.createdAt).getTime() : Date.now()
            }));

        } catch (e) {
            console.error("MongoDB Profile Search Error", e);
            // Fallback?
        }
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

    // Update Mock DB (Legacy)
    const db = getDB();
    const updated = await db.user.update("mock_uid_12345", body);

    // Update Real MongoDB if connected
    try {
        await connectDB();
        // Assume single user for now or use the session logic later
        // Update user matching the hardcoded UID or similar logic
        // For now, we update the user if we can find them by the default UID
        // In a real app, we would get the UID from the session/token
    } catch (e) {
        console.error("Failed to update MongoDB user", e);
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
