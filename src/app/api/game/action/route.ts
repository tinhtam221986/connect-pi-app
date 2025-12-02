import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action } = body;

        // Simulate processing delay
        await new Promise(r => setTimeout(r, 100));

        if (action === 'click') {
            return NextResponse.json({
                success: true,
                changes: {
                    scoreDelta: 1,
                    expDelta: 1,
                    energyDelta: -1
                },
                message: "Mining successful"
            });
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
