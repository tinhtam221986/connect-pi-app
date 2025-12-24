import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { text, user_uid, username, avatar } = await request.json();
    const { id } = params;

    if (!id || !text || !user_uid || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newComment = {
      text,
      user: { username, avatar: avatar || "" },
      createdAt: new Date()
    };

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updatedVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Comment added",
      comments: updatedVideo.comments
    });

  } catch (error) {
    console.error("Comment Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
