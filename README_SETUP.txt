# CONNECT - HƯỚNG DẪN CÀI ĐẶT (SETUP INSTRUCTIONS)

Dưới đây là hướng dẫn để bạn nhập mã khóa (API Key) và chạy ứng dụng hoàn chỉnh.

---

## 🇻🇳 PHẦN 1: CẤU HÌNH TRÊN VERCEL (QUAN TRỌNG NHẤT)
Để ứng dụng hoạt động online trên Pi Browser, bạn phải cài đặt Environment Variables trên Vercel.

1. **Truy cập Vercel:** Vào trang quản lý dự án Connect của bạn trên Vercel.
2. **Vào Cài đặt (Settings):** Chọn tab **"Settings"** ở trên cùng -> Chọn mục **"Environment Variables"** ở cột bên trái.
3. **Thêm API Key mới:**
   Bạn hãy thêm từng dòng dưới đây vào (chi tiết xem GUIDE_SETUP_REAL_ENV.md):

   * **Database:** `MONGODB_URI`
   * **Storage (R2):**
     - `R2_ACCOUNT_ID`
     - `R2_ACCESS_KEY_ID`
     - `R2_SECRET_ACCESS_KEY`
     - `R2_BUCKET_NAME`
     - `R2_PUBLIC_URL`

   -> Bấm **Save** cho từng cái.

4. **Triển khai lại (Redeploy):**
   * Sau khi lưu xong, vào tab **"Deployments"**.
   * Bấm vào nút 3 chấm ở bản build mới nhất -> Chọn **"Redeploy"**.
   * Việc này giúp Vercel nhận diện mã khóa mới.

---

## 🇻🇳 PHẦN 2: CẤU HÌNH TRÊN MÁY TÍNH (ĐỂ CHẠY THỬ LOCAL)
Nếu bạn giải nén và chạy trên máy tính Windows:

1. Tìm file có tên `.env.example`.
2. Copy nó thành file `.env.local` (hoặc `.env`).
3. Mở file đó bằng Notepad.
4. Điền các mã bí mật của bạn (MongoDB, R2, Pi Key) vào sau dấu bằng.
5. Lưu file lại.
6. Chạy lệnh `npm run dev` để bắt đầu.

---

## 🇬🇧 ENGLISH INSTRUCTIONS

### 1. Vercel Configuration (Production)
1. Go to Vercel Project Settings -> Environment Variables.
2. Add `MONGODB_URI` with your connection string.
3. Add Cloudflare R2 credentials (`R2_ACCOUNT_ID`, etc.).
4. Redeploy your project.

### 2. Local Configuration (Development)
1. Copy `.env.example` to `.env.local`.
2. Open it and fill in your API Keys.
3. Run `npm run dev`.
