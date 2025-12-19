# CẤU HÌNH MÔI TRƯỜNG THỰC TẾ (REAL ENVIRONMENT SETUP)

Để ứng dụng hoạt động chính xác trên Pi Browser và lưu trữ được video, bạn cần cấu hình các biến môi trường (Environment Variables) trên Vercel như sau:

## 1. Cấu hình Database & Storage

Hệ thống đã chuyển sang sử dụng MongoDB (để lưu dữ liệu) và Cloudflare R2 (để lưu file video/ảnh).

### A. MongoDB (Database)
Bạn cần một MONGODB_URI. Cách dễ nhất là dùng **MongoDB Atlas** (miễn phí):
1. Đăng ký tại [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Tạo một Cluster mới (chọn gói Shared - Free).
3. Vào **"Database Access"** -> Tạo User mới (nhớ username/password).
4. Vào **"Network Access"** -> Thêm IP Address (chọn "Allow Access from Anywhere" 0.0.0.0/0).
5. Bấm **"Connect"** -> **"Drivers"** -> Copy chuỗi kết nối.
6. Thay password vào chuỗi kết nối.
   - `MONGODB_URI`: Ví dụ `mongodb+srv://user:pass@cluster0.abc.mongodb.net/connect-app`

### B. Cloudflare R2 (Lưu trữ File)
Cloudflare R2 rẻ hơn và tương thích S3.
1. Đăng ký/Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Vào mục **R2** ở menu bên trái -> Bấm **Create Bucket** (đặt tên ví dụ: `connect-assets`).
3. Vào bucket vừa tạo -> **Settings** -> **Public Access** -> **Custom Domains** (hoặc dùng R2.dev subdomain).
   - `R2_BUCKET_NAME`: Tên bucket bạn vừa đặt.
   - `R2_PUBLIC_URL`: URL công khai (ví dụ `https://pub-xxx.r2.dev` hoặc domain riêng).
4. Quay lại trang chủ R2 -> Bấm **Manage R2 API Tokens** (bên phải).
5. Bấm **Create API Token**.
   - Permissions: **Admin Read & Write**.
   - TTL: Forever.
   - Bấm Create.
6. Lưu lại các thông tin:
   - `R2_ACCOUNT_ID`: Account ID của bạn (hiển thị ở góc trên bên phải dashboard R2).
   - `R2_ACCESS_KEY_ID`: Access Key ID.
   - `R2_SECRET_ACCESS_KEY`: Secret Access Key.

**Tại sao cần cái này?**
Nếu không có R2, bạn sẽ không thể upload video. Nếu không có MongoDB, app sẽ không lưu được thông tin user.

## 2. Pi Network (Xác thực & Thanh toán)
- `PI_API_KEY`: Key từ Pi Developer Portal (dùng để xác thực User trên server).
- `NEXT_PUBLIC_PI_SANDBOX`: Đặt là `false` nếu muốn chạy Mainnet thật. Đặt `true` để test trên Sandbox.

## 3. Cấu hình trên Vercel
1. Vào Project trên Vercel -> **Settings** -> **Environment Variables**.
2. Thêm tất cả các biến trên vào (Tổng cộng khoảng 7-8 biến).
3. **Redeploy** (Deploy lại) để áp dụng thay đổi.

## Kiểm tra sau khi Deploy
1. Mở App trên Pi Browser.
2. Nhìn lên thanh trạng thái trên cùng, phải thấy dòng chữ "✅ Pi Network Connected".
3. Thử upload một video ngắn. Nếu thành công, hệ thống R2 đã hoạt động.
