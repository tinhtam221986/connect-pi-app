import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    // 0. Check for Server Configuration
    const apiKey = process.env.PI_API_KEY;

    // Check if it's a mock token first to allow local dev without keys
    if (accessToken.startsWith('mock_')) {
        return NextResponse.json({
            success: true,
            user: {
                uid: "mock_uid_" + Math.random().toString(36).substring(7),
                username: "Chrome_Tester",
                roles: ["user", "tester"]
            },
            message: 'Verified via Mock System'
        });
    }

    if (!apiKey) {
         // Special error code so frontend can warn the developer
         return NextResponse.json({
             error: 'Server Misconfiguration: PI_API_KEY is missing.',
             code: 'NO_API_KEY',
             instruction: 'Add PI_API_KEY to your .env file or Vercel Environment Variables.'
         }, { status: 503 });
    }

    // 1. Try Real Pi Network Verification
    try {
        const piResponse = await fetch('https://api.minepi.com/v2/me', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${accessToken}` 
            }
        });

        if (piResponse.ok) {
            const piUser = await piResponse.json();
            return NextResponse.json({
                success: true,
                user: {
                    uid: piUser.uid,
                    username: piUser.username,
                    roles: ["user"] // Default role
                },
                message: 'Verified with Pi Network'
            });
        } else {
             const errorText = await piResponse.text();
             console.warn("Pi Network Verify Failed:", piResponse.status, errorText);
             return NextResponse.json({ error: `Pi Verification Failed: ${piResponse.status} - ${errorText}` }, { status: 401 });
        }
    } catch (e: any) {
        console.error("Pi Network Verification Connection Error:", e);
        return NextResponse.json({ error: 'Pi Network Unreachable: ' + e.message }, { status: 502 });
    }

  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
