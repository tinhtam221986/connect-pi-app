import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Check if keys are present
    if (!process.env.CLOUDINARY_API_KEY) {
        // Fallback to Mock Data if no keys (dev mode or misconfigured)
        console.warn("Missing Cloudinary Keys, returning Mock Data for Feed.");
        return NextResponse.json([
            { id: 'mock1', url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', description: 'Mock Video 1', username: 'System' },
            { id: 'mock2', url: 'https://res.cloudinary.com/demo/video/upload/cat.mp4', description: 'Mock Video 2', username: 'System' }
        ]);
    }

    // Use Cloudinary Search API to get latest videos from our folder
    const result = await cloudinary.search
      .expression('folder:connect-pi-app AND resource_type:video')
      .sort_by('created_at', 'desc')
      .max_results(10)
      .execute();

    // Map to our frontend format
    const videos = result.resources.map((res: any) => ({
        id: res.public_id,
        url: res.secure_url,
        thumbnail: res.secure_url.replace(/\.[^/.]+$/, ".jpg"), // Auto thumbnail
        description: res.context?.custom?.caption || "No description", // Assuming we saved context, or just empty
        username: res.context?.custom?.username || "Anonymous",
        likes: 0, // Cloudinary doesn't store likes, would need external DB
        comments: 0
    }));

    return NextResponse.json(videos);

  } catch (error: any) {
    console.error('Feed API Error (Cloudinary):', error);
    // Return empty list or mock instead of 500 to keep app usable
    return NextResponse.json([]);
  }
}
