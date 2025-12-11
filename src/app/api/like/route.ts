import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { videoId, action } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: "Thiếu ID video" }, { status: 400 });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Không tìm thấy video" }, { status: 404 });
    }

    // Tạm thời dùng một ID giả để test tính năng.
    // Sau này khi có Pi SDK, sẽ thay bằng UID thật của người dùng Pi.
    const tempUserId = "temp_user_" + Math.floor(Math.random() * 1000);

    let updatedVideo;
    if (action === 'like') {
      // Nếu là like, thêm user vào mảng likes (dùng $addToSet để tránh trùng)
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $addToSet: { likes: tempUserId } },
        { new: true }
      );
    } else {
      // Nếu là unlike, rút user khỏi mảng likes
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $pull: { likes: tempUserId } },
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
