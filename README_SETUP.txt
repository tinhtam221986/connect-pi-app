# CONNECT - HƯỚNG DẪN CÀI ĐẶT (SETUP INSTRUCTIONS)

Dưới đây là hướng dẫn để bạn nhập mã khóa (API Key) và chạy ứng dụng hoàn chỉnh.

---

## 🇻🇳 PHẦN 1: CẤU HÌNH TRÊN VERCEL (QUAN TRỌNG NHẤT)
Để ứng dụng hoạt động online trên Pi Browser, bạn phải cài đặt Environment Variables trên Vercel.

1. **Truy cập Vercel:** Vào trang quản lý dự án Connect của bạn trên Vercel.
2. **Vào Cài đặt (Settings):** Chọn tab **"Settings"** ở trên cùng -> Chọn mục **"Environment Variables"** ở cột bên trái.
3. **Thêm API Key mới:**
   Bạn hãy thêm từng dòng dưới đây vào:

   * **Key:** `CLOUDINARY_API_SECRET`
   * **Value:** *(Dán mã bí mật IPY KEY bạn vừa copy từ Cloudinary vào đây)*
   * -> Bấm **Save**.

   * **Key:** `CLOUDINARY_CLOUD_NAME`
   * **Value:** `dv1hnl0wo`
   * -> Bấm **Save**.

   * **Key:** `CLOUDINARY_API_KEY`
   * **Value:** `727564581351668`
   * -> Bấm **Save**.

4. **Triển khai lại (Redeploy):**
   * Sau khi lưu xong, vào tab **"Deployments"**.
   * Bấm vào nút 3 chấm ở bản build mới nhất -> Chọn **"Redeploy"**.
   * Việc này giúp Vercel nhận diện mã khóa mới.

---

## 🇻🇳 PHẦN 2: CẤU HÌNH TRÊN MÁY TÍNH (ĐỂ CHẠY THỬ LOCAL)
Nếu bạn giải nén và chạy trên máy tính Windows:

1. Tìm file có tên `.env.local.example`.
2. Đổi tên nó thành `.env.local` (xóa đuôi .example).
3. Mở file đó bằng Notepad.
4. Dán mã bí mật của bạn vào sau dấu bằng của dòng `CLOUDINARY_API_SECRET=`.
5. Lưu file lại.

---

## 🇬🇧 ENGLISH INSTRUCTIONS

### 1. Vercel Configuration (Production)
1. Go to Vercel Project Settings -> Environment Variables.
2. Add `CLOUDINARY_API_SECRET` with your new key.
3. Add `CLOUDINARY_CLOUD_NAME` = `dv1hnl0wo`
4. Add `CLOUDINARY_API_KEY` = `727564581351668`
5. Redeploy your project.

### 2. Local Configuration (Development)
1. Rename `.env.local.example` to `.env.local`.
2. Open it and paste your API Secret.
