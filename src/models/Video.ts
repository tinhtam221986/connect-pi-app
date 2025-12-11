import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  caption: { type: String, required: true },
  author: {
    username: { type: String, default: "Pi Pioneer" },
    user_uid: { type: String, default: "" },
    avatar: { type: String, default: "" }
  },
  likes: { type: [String], default: [] }, 
  comments: [
    {
      text: String,
      user: { username: String, avatar: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

let Video: any;
try {
  Video = mongoose.model("Video");
} catch {
  Video = mongoose.model("Video", VideoSchema);
}
export default Video;
