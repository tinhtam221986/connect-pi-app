import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    // In a real app, verify the accessToken with Pi Network API:
    // const verifyRes = await fetch('https://api.minepi.com/v2/me', { headers: { Authorization: `Bearer ${accessToken}` } });

    // Mock Validation
    if (!accessToken) {
        return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
    }

    // Mock User Data
    const mockUser = {
        uid: 'user_12345',
        username: 'PiPioneer',
        roles: ['user'],
        is_verified: true
    };

    return NextResponse.json({
        success: true,
        user: mockUser,
        message: 'Authenticated successfully'
    });

  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
