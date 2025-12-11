import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { username, user_uid } = await request.json();

    if (!user_uid) return NextResponse.json({ error: "Thiếu UID" }, { status: 400 });

    let user = await User.findOne({ user_uid });

    if (!user) {
      user = await User.create({
        username: username || "Pi Pioneer",
        user_uid: user_uid,
        balance: 0, level: 1
      });
    } else {
      if (username && user.username !== username) {
         user.username = username;
         await user.save();
      }
    }
    return NextResponse.json({ message: "Thành công", user });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}
