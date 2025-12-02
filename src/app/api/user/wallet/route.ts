import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return NextResponse.json({
        success: true,
        balance: 1250.00,
        transactions: [
            { id: 1, type: 'receive', amount: 50, from: 'User_99', date: new Date().toISOString() },
            { id: 2, type: 'send', amount: 10, to: 'Game_Fee', date: new Date(Date.now() - 86400000).toISOString() }
        ]
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { type, amount, to } = body;

    // Simulate transfer
    await new Promise(r => setTimeout(r, 500));

    return NextResponse.json({
        success: true,
        message: "Transaction successful",
        newBalance: 1250.00 - (amount || 0)
    });
}
