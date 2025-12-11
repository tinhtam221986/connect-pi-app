import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { user_uid, amount, type } = await request.json();

    if (!user_uid || !amount) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    const user = await User.findOne({ user_uid });
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    // Xử lý cộng/trừ tiền
    if (type === 'deposit') {
      user.balance += amount;
    } else if (type === 'withdraw') {
      if (user.balance < amount) return NextResponse.json({ error: "Số dư không đủ" }, { status: 400 });
      user.balance -= amount;
    }

    await user.save();

    return NextResponse.json({ message: "Giao dịch thành công", newBalance: user.balance });

  } catch (error) {
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}
