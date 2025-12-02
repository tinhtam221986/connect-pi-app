import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // In a real app, verify auth header
    // const token = request.headers.get('Authorization');

    return NextResponse.json({
        username: "Test_User_Alpha",
        bio: "Crypto Enthusiast & Creator",
        level: 5,
        xp: 2400,
        followers: 1250,
        following: 120,
        isVerified: true,
        joinedAt: new Date().toISOString()
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { bio, username } = body;

        // Mock DB Update
        console.log("Updated profile:", { bio, username });

        return NextResponse.json({
            success: true,
            data: {
                username: username || "Test_User_Alpha",
                bio: bio || "Crypto Enthusiast & Creator",
                updatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
