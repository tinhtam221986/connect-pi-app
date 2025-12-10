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
    author: {
      username: String,
      user_uid: String, // ID của người dùng Pi
    },
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

// Nếu model đã tồn tại thì dùng lại, chưa thì tạo mới
export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
