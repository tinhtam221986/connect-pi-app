import { NextResponse } from 'next/server';

export async function GET() {
    // In a real app, fetch from database using session/token
    const userProfile = {
        username: "PiPioneer",
        bio: "Web3 Enthusiast | Pi Network Miner",
        followers: 1205,
        following: 45,
        pi_balance: 1250.00,
        xp: 4500,
        level: 12,
        badges: ['Early Adopter', 'Verified', 'Creator']
    };

    return NextResponse.json(userProfile);
}

export async function POST(request: Request) {
    const body = await request.json();
    // Simulate update
    return NextResponse.json({ success: true, updated: body });
}
