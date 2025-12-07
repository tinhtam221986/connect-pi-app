import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();
    if (!accessToken) return NextResponse.json({ error: 'Missing Token' }, { status: 400 });

    if (!process.env.PI_API_KEY) {
      // If no API key, bypass verification for testing (Development only)
      console.warn('No PI_API_KEY, mocking success');
      return NextResponse.json({ user: { uid: 'mock_uid', username: 'MockUser' } });
    }

    const res = await fetch('https://api.minepi.com/v2/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!res.ok) return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    const data = await res.json();
    
    return NextResponse.json({ user: data });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
