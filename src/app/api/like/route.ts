import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { videoId, user_uid } = await request.json();

    if (!videoId || !user_uid) {
      return NextResponse.json({ error: "Missing videoId or user_uid" }, { status: 400 });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Toggle logic: If user already liked, remove them. If not, add them.
    const hasLiked = video.likes.includes(user_uid);
    let updatedVideo;

    if (hasLiked) {
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $pull: { likes: user_uid } },
        { new: true }
      );
    } else {
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $addToSet: { likes: user_uid } },
        { new: true }
      );
    }

    return NextResponse.json({
      message: "Thành công",
      likesCount: updatedVideo.likes.length
    });

  } catch (error) {
    console.error("Lỗi like:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}
