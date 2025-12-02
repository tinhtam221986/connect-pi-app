import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { itemId } = body;
        const db = getDB();
        const uid = "mock_uid_12345";

        const user = await db.user.findByUid(uid);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Find Item in Market
        const items = await db.market.findAll();
        const item = items.find(i => i.id === itemId);

        if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

        if (user.balance < item.price) {
            return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
        }

        // Transaction
        // 1. Deduct Balance
        await db.user.update(uid, {
            balance: user.balance - item.price,
            inventory: [...user.inventory, item.id] // Simplified: just adding ID
        });

        // 2. Remove from Market (or mark sold)
        await db.market.buy(itemId, uid);

        return NextResponse.json({ success: true, message: "Purchase successful" });

    } catch (error) {
        console.error('Market Buy Error:', error);
        return NextResponse.json({ error: 'Failed to purchase' }, { status: 500 });
    }
}
