import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action } = body;
        const db = getDB();
        const uid = "mock_uid_12345"; // Mock session

        if (action === 'click') {
            const user = await db.user.findByUid(uid);
            if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

            const updated = await db.user.update(uid, {
                balance: user.balance + 1,
                // In a real RPG, we'd have exp logic
            });

            return NextResponse.json({
                success: true,
                changes: {
                    scoreDelta: 1,
                    balance: updated.balance
                },
                message: "Mining successful"
            });
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
