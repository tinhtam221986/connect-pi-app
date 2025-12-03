import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const db = getDB();
    // For now, return the mock user. In real app, we get UID from auth context/session.
    // Assuming "Chrome_Tester" is the logged in user for this mock.
    const user = await db.user.findByUid("mock_uid_12345");

    return NextResponse.json(user || { error: "User not found" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();

    // Simple mock update
    const updated = await db.user.update("mock_uid_12345", body);

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
