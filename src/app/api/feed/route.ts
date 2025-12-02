import { NextResponse } from "next/server";
import { MOCK_VIDEOS } from "@/lib/mock-data";

// In-memory store for demo (resets on server restart)
let posts = [...MOCK_VIDEOS];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang');

    let result = posts;
    if (lang && lang !== 'all') {
        result = posts.filter(p => p.language === lang || !p.language); // Include posts without lang if any
    }
    return NextResponse.json(result);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Mock User (should come from Auth in real app)
        const user = {
            id: "current_user",
            username: "You",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
            level: 1,
            reputation: "Newbie",
            followers: "0",
            bio: ""
        };

        const newPost = {
            id: `post_${Date.now()}`,
            user,
            description: body.description || "No description",
            videoUrl: body.videoUrl,
            likes: 0,
            comments: 0,
            shares: 0,
            language: body.language || 'en',
            thumbnail: "bg-gray-800"
        };

        // Prepend to posts
        posts = [newPost, ...posts];

        return NextResponse.json(newPost);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
