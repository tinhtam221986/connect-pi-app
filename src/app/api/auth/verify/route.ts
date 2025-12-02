import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    // In a real app, you would call Pi Network API to verify the token:
    // const verifyRes = await fetch('https://api.minepi.com/v2/me', { headers: { Authorization: `Bearer ${accessToken}` } });

    // Mock Verification Logic
    let isValid = false;
    let user = null;

    if (accessToken.startsWith('mock_') || accessToken.length > 10) {
        isValid = true;
        user = {
            uid: "mock_user_" + Math.random().toString(36).substring(7),
            username: "Test_User_Alpha",
            roles: ["user"]
        };
    }

    if (isValid) {
      return NextResponse.json({
          success: true,
          user: user,
          message: 'Token verified successfully'
      });
    } else {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
