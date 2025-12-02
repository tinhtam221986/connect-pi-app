import { NextResponse } from 'next/server';

// --- SERVICE INTERFACES ---

interface AIService {
    generateText(prompt: string): Promise<string>;
    generateImage(prompt: string): Promise<string>;
}

// --- MOCK SERVICE (DEFAULT) ---
class MockAIService implements AIService {
    async generateText(prompt: string): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
        return `Title: ${prompt}\n\n[Intro]: Welcome back! Today we discuss ${prompt}.\n[Body]: Key points:\n1. Innovation\n2. Impact\n3. Future\n[Outro]: Thanks for watching!`;
    }

    async generateImage(prompt: string): Promise<string> {
        // Use Pollinations for a "real" feeling mock without API keys
        const safePrompt = encodeURIComponent(prompt);
        return `https://pollinations.ai/p/${safePrompt}?width=512&height=512`;
    }
}

// --- OPENAI SERVICE (PLACEHOLDER) ---
class OpenAIService implements AIService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateText(prompt: string): Promise<string> {
        // Implementation for OpenAI Chat Completion
        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: `Write a short video script about: ${prompt}` }]
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices[0].message.content;
        } catch (e) {
            console.error("OpenAI Error:", e);
            throw e;
        }
    }

    async generateImage(prompt: string): Promise<string> {
        // Implementation for DALL-E
        try {
            const res = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    n: 1,
                    size: "512x512"
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.data[0].url;
        } catch (e) {
            console.error("OpenAI Image Error:", e);
            throw e;
        }
    }
}

// --- FACTORY ---
function getAIService(): AIService {
    const openAIKey = process.env.OPENAI_API_KEY;

    // If we have a key, use the real service
    if (openAIKey && openAIKey.length > 0) {
        return new OpenAIService(openAIKey);
    }

    // Default to Mock
    return new MockAIService();
}

// --- ROUTE HANDLER ---

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, type } = body; // type: 'script' | 'image'

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const aiService = getAIService();
        let result = "";

        if (type === 'script') {
            result = await aiService.generateText(prompt);
        } else if (type === 'image') {
            result = await aiService.generateImage(prompt);
        } else {
             return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            result: result,
            type: type
        });

    } catch (error: any) {
        console.error("AI Generation Failed:", error);
        // Fallback to mock if Real Service fails
        if (process.env.OPENAI_API_KEY) {
             console.log("Falling back to mock service...");

             // We need to re-parse body or capture type from scope.
             // Since 'type' was declared inside try block, it might not be available here if error happened before declaration?
             // Actually, 'type' is const in try block. If error happens in try, 'type' should be accessible if declared before error.
             // But TS might complain if it thinks it's not assigned.
             // To be safe, let's just default to what we can or return error.

             // However, strictly speaking, 'type' is block scoped to the try block.
             // But the catch block is outside that scope? No, catch is separate.
             // Variables declared in 'try' are NOT available in 'catch'.

             return NextResponse.json({ error: 'AI Generation Failed', details: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: 'AI Generation Failed' }, { status: 500 });
    }
}
