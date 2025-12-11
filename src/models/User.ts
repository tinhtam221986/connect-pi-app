import mongoose from "mongoose";

// Định nghĩa cấu trúc của một Công dân Pi trên Connect
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Tên Pi (Ví dụ: tinhtam221986)
  user_uid: { type: String, required: true, unique: true }, // Số CMND số (UID duy nhất từ Pi)
  
  // Tài sản & Cấp độ
  balance: { type: Number, default: 0 }, // Số dư Ví (Pi)
  level: { type: Number, default: 1 },   // Cấp độ người dùng
  isVip: { type: Boolean, default: false }, // Có phải VIP không

  // Thông tin cá nhân (Profile)
  bio: { type: String, default: "Thành viên mới của Connect Web3 🚀" },
  avatar: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },

  // Cửa hàng cá nhân (Shop)
  shopItems: [
    {
      name: String,
      price: Number,
      image: String,
      sold: { type: Number, default: 0 }
    }
  ],

  createdAt: { type: Date, default: Date.now },
});

// Xử lý để tránh lỗi "Quá phức tạp" như Video.ts
let User: any;
try {
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", UserSchema);
}

export default User;
