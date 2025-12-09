import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { SmartContractService } from '@/lib/smart-contract-service';

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

    // 1. Get items from DB (Fast, Immediate)
    const dbItems = await SmartContractService.getFeedItems();

    // 2. Get items from Cloudinary (Backup, Discovery)
    // Relaxed filter to include images
    const result = await cloudinary.search
      .expression('folder:connect-pi-app')
      .sort_by('created_at', 'desc')
      .max_results(20)
      .execute();

    // Map Cloudinary results
    const cloudItems = result.resources.map((res: any) => ({
        id: res.public_id,
        url: res.secure_url,
        thumbnail: res.resource_type === 'video'
            ? res.secure_url.replace(/\.[^/.]+$/, ".jpg")
            : res.secure_url,
        description: res.context?.custom?.caption || "No description",
        username: res.context?.custom?.username || "Anonymous",
        likes: 0,
        comments: 0,
        resource_type: res.resource_type,
        created_at: res.created_at
    }));

    // 3. Merge and Dedup (Prefer DB items as they might have more fresh metadata)
    const feedMap = new Map();
    // Add Cloudinary first
    cloudItems.forEach((item: any) => feedMap.set(item.id, item));
    // Overwrite with DB items (newer)
    dbItems.forEach((item: any) => feedMap.set(item.id, item));

    const finalFeed = Array.from(feedMap.values()).sort((a: any, b: any) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return NextResponse.json(finalFeed);

  } catch (error: any) {
    console.error('Feed API Error (Cloudinary):', error);
    // Return empty list or mock instead of 500 to keep app usable
    return NextResponse.json([]);
  }
}
