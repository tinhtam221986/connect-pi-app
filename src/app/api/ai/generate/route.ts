import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt, type } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Mock AI Generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Return a mock image URL (using picsum or placeholder)
        const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`;

        return NextResponse.json({
            success: true,
            data: {
                url: imageUrl,
                prompt: prompt,
                created_at: new Date().toISOString()
            }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }
}
