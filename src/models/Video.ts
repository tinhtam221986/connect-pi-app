import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true }, // Link video trên mây
  caption: { type: String },                  // Nội dung status
  author: { type: String, default: 'Ẩn danh' }, // Tên người đăng
  likes: { type: Number, default: 0 },        // Số tim
  createdAt: { type: Date, default: Date.now } // Ngày đăng
});

// Kiểm tra xem đã có khuôn chưa, nếu chưa thì tạo mới
export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
