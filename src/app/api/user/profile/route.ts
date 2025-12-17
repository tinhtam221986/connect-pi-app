import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Video from '@/models/Video';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    try {
        await connectDB();

        // 1. Fetch User Profile
        let user = await User.findOne({ username }).lean();

        if (!user) {
            user = {
                username: username,
                user_uid: `user_${username}`,
                level: 1,
                balance: 0,
                bio: "Web3 content creator. Love Pi Network! 🚀",
                followers: 0,
                following: 0,
                totalLikes: 0,
                isVip: false,
                avatar: ""
            };
        }

        // 2. Fetch User's Videos
        const mongoVideos = await Video.find({ "author.username": username })
                                    .sort({ createdAt: -1 })
                                    .lean();

        const videos = mongoVideos.map((v: any) => ({
            id: v._id.toString(),
            url: v.videoUrl,
            thumbnail: v.videoUrl,
            description: v.caption,
            likes: v.likes?.length || 0,
            createdAt: v.createdAt ? new Date(v.createdAt).getTime() : Date.now()
        }));

        const calculatedTotalLikes = videos.reduce((sum: number, v: any) => sum + v.likes, 0);
        user.totalLikes = Math.max(user.totalLikes || 0, calculatedTotalLikes);

        return NextResponse.json({ ...user, videos });

    } catch (dbError: any) {
        if (dbError.message && dbError.message.includes('MONGODB_URI')) {
             console.warn("MongoDB not configured, returning mock profile.");
             return NextResponse.json({
                username: username,
                user_uid: `mock_${username}`,
                level: 10,
                balance: 1000,
                bio: "Dev Mode: DB not connected.",
                followers: 999,
                following: 42,
                totalLikes: 1234,
                isVip: true,
                avatar: "",
                videos: []
             });
        }
        throw dbError;
    }

  } catch (error) {
    console.error("Profile API Error", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, bio, avatar } = body;

    if (!username) {
         return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    try {
        await connectDB();

        const updateData: any = {};
        if (bio !== undefined) updateData.bio = bio;
        if (avatar !== undefined) updateData.avatar = avatar;

        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: updateData },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (dbError: any) {
         if (dbError.message && dbError.message.includes('MONGODB_URI')) {
             return NextResponse.json({ success: true, user: { username, bio, avatar } });
         }
         throw dbError;
    }
  } catch (error) {
    console.error("Profile Update Error", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
