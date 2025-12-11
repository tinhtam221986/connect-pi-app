import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { videoId, text } = await request.json();
    
    // Giả lập user (Sau này lấy từ PiSDKProvider)
    const newComment = {
      text: text,
      user: { username: "Pi User", avatar: "" },
      createdAt: new Date()
    };

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $push: { comments: newComment } },
      { new: true }
    );

    return NextResponse.json({ message: "Success", comments: updatedVideo.comments });
  } catch (error) { return NextResponse.json({ error: "Lỗi Server" }, { status: 500 }); }
}
