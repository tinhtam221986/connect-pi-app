import { NextResponse } from "next/server";

// Mock Database (In-Memory)
// In production, connect to MongoDB/Postgres
const USERS: Record<string, any> = {
    "test_user": { uid: "test_user", username: "TestUser", balance: 100, role: "User" }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

    // Simulate DB fetch
    const user = USERS[uid] || {
        uid,
        username: `User_${uid.substring(0,6)}`,
        balance: 0,
        role: "Newbie",
        joinedAt: new Date().toISOString()
    };

    return NextResponse.json(user);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { uid, data } = body;

        if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

        // Simulate DB update
        USERS[uid] = { ...USERS[uid], ...data };

        return NextResponse.json({ success: true, user: USERS[uid] });
    } catch (e) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }
}
