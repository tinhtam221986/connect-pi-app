import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    // Sửa lại phần này cho khớp với Trang chủ (Trang chủ cần Object, không phải String)
    author: {
      type: Object, 
      default: { username: "Pi User", user_uid: "unknown" },
    },
    // Sửa lại likes thành Mảng để đếm được bao nhiêu người thả tim
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// Thêm "as any" vào đoạn này để trị dứt điểm lỗi "Type too complex" màu đỏ
export default (mongoose.models.Video as any) || mongoose.model("Video", VideoSchema);
