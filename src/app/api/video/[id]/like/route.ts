import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { user_uid } = await request.json();
    const { id } = params; // Get videoId from URL

    if (!id || !user_uid) {
      return NextResponse.json({ error: "Missing videoId or user_uid" }, { status: 400 });
    }

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Toggle logic: If user already liked, remove them. If not, add them.
    const hasLiked = video.likes.includes(user_uid);
    let updatedVideo;

    if (hasLiked) {
      updatedVideo = await Video.findByIdAndUpdate(
        id,
        { $pull: { likes: user_uid } },
        { new: true }
      );
    } else {
      updatedVideo = await Video.findByIdAndUpdate(
        id,
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
