import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Mock upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock S3/Cloudflare Response
        return NextResponse.json({
            success: true,
            url: "https://www.w3schools.com/html/mov_bbb.mp4", // Mock video URL
            thumbnail: "/mock_thumbnail.jpg",
            fileId: "vid_" + Math.random().toString(36).substring(7),
            message: "Video uploaded successfully to CDN"
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
