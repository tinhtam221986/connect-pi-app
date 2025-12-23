import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { videoId, text, user_uid, username, avatar } = await request.json();

    if (!videoId || !text || !user_uid || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newComment = {
      text: text,
      user: {
        username: username,
        user_uid: user_uid,
        avatar: avatar || ""
      },
      createdAt: new Date()
    };

    // Đẩy bình luận vào mảng comments của video
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $push: { comments: newComment } },
      { new: true }
    );

    return NextResponse.json({
      message: "Bình luận thành công",
      comments: updatedVideo.comments
    });

  } catch (error) {
    console.error("Lỗi comment:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}
