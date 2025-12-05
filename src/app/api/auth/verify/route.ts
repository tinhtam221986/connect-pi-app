import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 });
    }

    if (!process.env.PI_API_KEY) {
      console.error('PI_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify against real Pi Network API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: { 
        'Authorization': `Bearer ${accessToken}` 
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pi API Error:', response.status, errorText);
      return NextResponse.json({ error: 'Invalid Pi Token' }, { status: 401 });
    }

    const userData = await response.json();
    return NextResponse.json({ user: userData });

  } catch (error: any) {
    console.error('Verify Route Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
