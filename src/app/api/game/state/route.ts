import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Mock user state
    return NextResponse.json({
        success: true,
        state: {
            level: 1,
            exp: 150,
            nextLevelExp: 200,
            score: 1250, // Pi points
            energy: 100,
            battlesWon: 5
        }
    });
}
