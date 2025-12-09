# CẤU HÌNH MÔI TRƯỜNG THỰC TẾ (REAL ENVIRONMENT SETUP)

Để ứng dụng hoạt động chính xác trên Pi Browser và lưu trữ được video, bạn cần cấu hình các biến môi trường (Environment Variables) trên Vercel như sau:

## 1. Cloudinary (Lưu trữ Video & Database)
Đăng ký tài khoản miễn phí tại [cloudinary.com](https://cloudinary.com) và lấy thông tin từ Dashboard:

- `CLOUDINARY_CLOUD_NAME`: Tên cloud của bạn (ví dụ: `duong-connect-app`).
- `CLOUDINARY_API_KEY`: API Key (ví dụ: `1234567890`).
- `CLOUDINARY_API_SECRET`: API Secret.

**Tại sao cần cái này?**
Hệ thống sử dụng Cloudinary không chỉ để chứa video mà còn để lưu trữ "Cơ sở dữ liệu" (JSON Database) của Game và Feed. Nếu thiếu, video sẽ không hiện và Game sẽ không lưu được thú cưng.

## 2. Pi Network (Xác thực & Thanh toán)
- `PI_API_KEY`: Key từ Pi Developer Portal (dùng để xác thực User trên server).
- `NEXT_PUBLIC_PI_SANDBOX`: Đặt là `false` nếu muốn chạy Mainnet thật. Đặt `true` để test trên Sandbox.

## 3. Cấu hình trên Vercel
1. Vào Project trên Vercel -> **Settings** -> **Environment Variables**.
2. Thêm các biến trên vào.
3. **Redeploy** (Deploy lại) để áp dụng thay đổi.

## Kiểm tra sau khi Deploy
1. Mở App trên Pi Browser.
2. Nhìn lên thanh trạng thái trên cùng, phải thấy dòng chữ "✅ Pi Network Connected".
3. Vào Tab "Game", thử mua vật phẩm hoặc lai tạo. Nếu thành công, hệ thống đã hoạt động tốt.
