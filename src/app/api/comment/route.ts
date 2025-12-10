import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { videoId, text } = await request.json();

    if (!videoId || !text) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    // Giả lập người dùng (Vì chưa có giấy khai sinh Pi)
    const fakeUser = {
      username: "Pi Pioneer " + Math.floor(Math.random() * 99),
      avatar: "https://via.placeholder.com/150"
    };

    const newComment = {
      text: text,
      user: fakeUser,
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
