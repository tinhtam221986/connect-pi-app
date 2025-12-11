import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User"; // Gọi sổ hộ khẩu ra

export async function POST(request: Request) {
  try {
    await connectDB();
    const { username, user_uid, accessToken } = await request.json();

    if (!user_uid) {
      return NextResponse.json({ error: "Thiếu CMND (UID)" }, { status: 400 });
    }

    // 1. Kiểm tra xem ông này có trong sổ chưa?
    let user = await User.findOne({ user_uid });

    if (!user) {
      // 2. Nếu chưa -> Ghi tên mới vào sổ (Cấp hộ khẩu mới)
      user = await User.create({
        username: username || "Pi Pioneer",
        user_uid: user_uid,
        balance: 0, // Tặng 0 Pi khởi nghiệp (hoặc 10 tùy bác)
        level: 1
      });
      console.log("Đã cấp hộ khẩu mới cho:", username);
    } else {
      // 3. Nếu có rồi -> Cập nhật thông tin mới nhất
      user.username = username; // Cập nhật tên nếu đổi
      await user.save();
      console.log("Đã cập nhật hộ khẩu cho:", username);
    }

    return NextResponse.json({ message: "Thành công", user });

  } catch (error) {
    console.error("Lỗi Hộ Tịch:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}
