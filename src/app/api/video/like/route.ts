import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    const { videoId, userId } = await request.json();

    if (!videoId || !userId) {
      return NextResponse.json({ error: "Missing videoId or userId" }, { status: 400 });
    }

    await connectDB();

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const likes = video.likes || [];
    const hasLiked = likes.includes(userId);

    let updatedVideo;
    if (hasLiked) {
      // Unlike
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      // Like
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }

    return NextResponse.json({
        success: true,
        likes: updatedVideo.likes.length,
        hasLiked: !hasLiked
    });

  } catch (error) {
    console.error("Like Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
