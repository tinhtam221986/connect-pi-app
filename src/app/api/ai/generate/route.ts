import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, type } = body; // type: 'script' | 'image'

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Mock AI Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (type === 'script') {
            const script = `Title: ${prompt}\n\n[Intro]: Welcome back to the channel! Today we're diving deep into ${prompt}.\n[Body]: There are three key things you need to know...\n1. The Innovation\n2. The Community\n3. The Future\n[Outro]: Thanks for watching! Like and Subscribe for more updates on ${prompt}.`;
            return NextResponse.json({
                success: true,
                result: script,
                type: 'script'
            });
        } else if (type === 'image') {
            // Use Pollinations.ai for real image generation url as it's free and simple
            const safePrompt = encodeURIComponent(prompt);
            const imageUrl = `https://pollinations.ai/p/${safePrompt}?width=512&height=512`;
            return NextResponse.json({
                success: true,
                result: imageUrl,
                type: 'image'
            });
        } else {
             return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'AI Generation Failed' }, { status: 500 });
    }
}
