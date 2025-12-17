import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Video from '@/models/Video';

export async function GET() {
  try {
    try {
        // Connect to MongoDB
        await connectDB();

        // Fetch videos sorted by creation date (newest first)
        const videos = await Video.find({ privacy: 'public' })
                                  .sort({ createdAt: -1 })
                                  .limit(50)
                                  .lean();

        // Map MongoDB documents to the Feed Item format expected by the frontend
        const feedItems = videos.map((v: any) => ({
            id: v._id.toString(),
            url: v.videoUrl,
            thumbnail: v.thumbnailUrl || v.videoUrl,
            description: v.caption || "No description",
            username: v.author?.username || "Anonymous",
            likes: v.likes?.length || 0,
            comments: v.comments?.length || 0,
            resource_type: 'video',
            created_at: v.createdAt
        }));

        // Fallback if empty (e.g., fresh install)
        if (feedItems.length === 0) {
            return NextResponse.json([
                {
                    id: 'welcome_1',
                    url: 'https://pub-8e3265763a96bdc4211f48b8aee1e135.r2.dev/welcome.mp4',
                    thumbnail: '',
                    description: 'Welcome to Connect Pi App! Be the first to post.',
                    username: 'ConnectTeam',
                    resource_type: 'video',
                    created_at: new Date()
                }
            ]);
        }

        return NextResponse.json(feedItems);

    } catch (dbError: any) {
        // Fallback for Dev Environment without DB
        if (dbError.message && dbError.message.includes('MONGODB_URI')) {
             console.warn("MongoDB not configured, returning mock feed.");
             return NextResponse.json([
                 {
                     id: 'mock_1',
                     url: 'https://pub-8e3265763a96bdc4211f48b8aee1e135.r2.dev/welcome.mp4',
                     thumbnail: '',
                     description: 'Dev Mode: DB not connected. This is a mock video.',
                     username: 'DevUser',
                     likes: 123,
                     comments: 10,
                     resource_type: 'video',
                     created_at: new Date()
                 }
             ]);
        }
        throw dbError;
    }

  } catch (error: any) {
    console.error('Feed API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
