import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    const { videoId, text, userId, username, avatar } = await request.json();

    if (!videoId || !text || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const newComment = {
      text,
      user: {
        username: username || "Anonymous",
        avatar: avatar || ""
      },
      createdAt: new Date()
    };

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updatedVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, comment: newComment });

  } catch (error) {
    console.error("Comment Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
