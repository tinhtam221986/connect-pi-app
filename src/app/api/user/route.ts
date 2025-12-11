import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { username, user_uid } = await request.json();

    if (!user_uid) {
      return NextResponse.json({ error: "Thiếu UID" }, { status: 400 });
    }

    // Kiểm tra xem người này có trong sổ chưa
    let user = await User.findOne({ user_uid });

    if (!user) {
      // Chưa có -> Tạo mới (Cấp sổ mới)
      user = await User.create({
        username: username || "Pi Pioneer",
        user_uid: user_uid,
        balance: 0, 
        level: 1
      });
    } else {
      // Có rồi -> Cập nhật tên nếu đổi
      if (username && user.username !== username) {
         user.username = username;
         await user.save();
      }
    }

    return NextResponse.json({ message: "Thành công", user });

  } catch (error) {
    console.error("Lỗi:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}
