import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const description = formData.get('description') as string || "New video from Connect!";

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Mock upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create new video entry
        const newVideo = {
            id: "vid_" + Date.now(),
            user: db.users.find(u => u.id === 'currentUser') || { username: "You", avatar: "" },
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // In real app, this would be the S3 URL
            description: description,
            likes: 0,
            comments: 0,
            shares: 0,
            language: "en" // Default to en or detect
        };

        // Add to Mock DB
        db.videos.unshift(newVideo);

        // Mock S3/Cloudflare Response
        return NextResponse.json({
            success: true,
            url: newVideo.videoUrl,
            thumbnail: "/mock_thumbnail.jpg",
            fileId: newVideo.id,
            message: "Video uploaded successfully to CDN and Feed"
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
