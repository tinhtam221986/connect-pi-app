import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  caption: { type: String, required: false },
  // PRD: Privacy setting (Public/Friends/Private)
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  author: {
    username: { type: String, default: "Pi Pioneer" },
    user_uid: { type: String, default: "" },
    avatar: { type: String, default: "" }
  },
  // PRD: Metadata storage (duration, resolution, etc.)
  metadata: {
    duration: { type: Number, default: 0 }, // in seconds
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    fileSize: { type: Number, default: 0 }, // in bytes
    format: { type: String, default: "" }
  },
  // PRD: Anti-cheat Device Fingerprint
  deviceSignature: { type: String, default: "" },

  // Phase 3: Tagged Products for Shop Feature
  products: [
    {
      name: String,
      price: Number,
      image: String,
      link: String
    }
  ],

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
