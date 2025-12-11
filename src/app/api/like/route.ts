import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { videoId, action } = await request.json();
    const userId = "temp_user_id"; // Sau này thay bằng user.uid thật từ Pi

    let updatedVideo;
    if (action === 'like') {
      updatedVideo = await Video.findByIdAndUpdate(videoId, { $addToSet: { likes: userId } }, { new: true });
    } else {
      updatedVideo = await Video.findByIdAndUpdate(videoId, { $pull: { likes: userId } }, { new: true });
    }
    return NextResponse.json({ message: "Success", likesCount: updatedVideo.likes.length });
  } catch (error) { return NextResponse.json({ error: "Lỗi Server" }, { status: 500 }); }
}
