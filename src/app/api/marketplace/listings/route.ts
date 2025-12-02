import { NextResponse } from 'next/server';

const MOCK_ITEMS = [
    { id: 1, name: "Premium Filter Pack", price: 50, image: "https://placehold.co/200x200/purple/white?text=Filter", type: "digital" },
    { id: 2, name: "Golden Avatar Frame", price: 100, image: "https://placehold.co/200x200/gold/black?text=Frame", type: "nft" },
    { id: 3, name: "VIP Badge (1 Month)", price: 500, image: "https://placehold.co/200x200/blue/white?text=VIP", type: "subscription" },
    { id: 4, name: "Mystery Box", price: 25, image: "https://placehold.co/200x200/red/white?text=?", type: "consumable" }
];

export async function GET(request: Request) {
    return NextResponse.json({
        success: true,
        items: MOCK_ITEMS
    });
}

export async function POST(request: Request) {
    // Handle "Buy" or "List"
    const body = await request.json();
    const { action, itemId } = body;

    if (action === 'buy') {
        const item = MOCK_ITEMS.find(i => i.id === itemId);
        if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

        return NextResponse.json({
            success: true,
            message: `Successfully purchased ${item.name}`,
            deducted: item.price
        });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
