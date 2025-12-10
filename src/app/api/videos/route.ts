import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(request: Request) {
  try {
    // 1. Kết nối Database
    await connectDB();

    // 2. Lấy dữ liệu gửi lên
    const body = await request.json();
    const { videoUrl, caption, author } = body;

    // 3. Kiểm tra dữ liệu
    if (!videoUrl) {
      return NextResponse.json(
        { error: "Chưa có video nào được chọn!" },
        { status: 400 }
      );
    }

    // 4. Lưu vào Database
    const newVideo = await Video.create({
      videoUrl,
      caption,
      author: author || { username: "Người dùng Pi", user_uid: "an_danh" },
    });

    return NextResponse.json(
      { message: "Đăng thành công!", video: newVideo },
      { status: 201 }
    );

  } catch (error) {
    console.error("Lỗi đăng bài:", error);
    return NextResponse.json(
      { error: "Lỗi Server rồi bác ơi!" },
      { status: 500 }
    );
  }
}
