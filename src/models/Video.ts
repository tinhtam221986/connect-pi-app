import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  caption: { type: String, required: true },
  author: {
    username: { type: String, default: "Pi Pioneer" },
    user_uid: { type: String, default: "" },
    avatar: { type: String, default: "" }
  },
  likes: { type: [String], default: [] }, // Mảng chứa UID người like
  comments: [
    {
      text: String,
      user: {
        username: String,
        avatar: String
      },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
