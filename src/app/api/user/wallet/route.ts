import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// Hàm xử lý việc Nạp tiền hoặc Biến động số dư
export async function POST(request: Request) {
  try {
    await connectDB();
    const { user_uid, amount, type, paymentId } = await request.json();

    if (!user_uid || !amount) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    // 1. Tìm người dùng
    const user = await User.findOne({ user_uid });
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    // 2. Xử lý cộng/trừ tiền
    // Nếu type là 'deposit' (nạp) -> Cộng tiền
    if (type === 'deposit') {
      user.balance += amount;
      console.log(`Đã nạp ${amount} Pi cho ${user.username}. Mã giao dịch: ${paymentId}`);
    } 
    // Nếu type là 'withdraw' (rút/mua hàng) -> Trừ tiền
    else if (type === 'withdraw') {
      if (user.balance < amount) {
        return NextResponse.json({ error: "Số dư không đủ" }, { status: 400 });
      }
      user.balance -= amount;
    }

    // 3. Lưu vào sổ
    await user.save();

    return NextResponse.json({ 
      message: "Giao dịch thành công", 
      newBalance: user.balance 
    });

  } catch (error) {
    console.error("Lỗi Ví:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}
