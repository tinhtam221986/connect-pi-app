import mongoose from "mongoose";

// --- CHÌA KHÓA GẮN CỨNG (ĐỂ CHẠY NGAY LẬP TỨC) ---
const MONGODB_URI = "mongodb+srv://tinhtam221986_db_user:Hung21986pi@cluster0.k8tksvk.mongodb.net/?appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error("Thiếu MONGODB_URI");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Đã kết nối MongoDB thành công!");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
