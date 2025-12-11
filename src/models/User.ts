import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  user_uid: { type: String, required: true, unique: true }, 
  balance: { type: Number, default: 0 }, 
  level: { type: Number, default: 1 },   
  isVip: { type: Boolean, default: false },
  bio: { type: String, default: "Thành viên Connect 🚀" },
  createdAt: { type: Date, default: Date.now },
});

let User: any;
try {
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", UserSchema);
}
export default User;
