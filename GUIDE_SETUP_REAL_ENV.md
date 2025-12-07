# Hướng dẫn Cấu hình Môi trường Thật (Real Environment)

Tài liệu này hướng dẫn bạn cách chuyển đổi từ chế độ **Mock (Giả lập)** sang **Real (Thật)** để:
1.  Đăng nhập bằng tài khoản Pi Network thật (Sửa lỗi "Authentication timed out").
2.  Tải video lên Cloud storage (thay vì lưu tạm vào bộ nhớ trình duyệt).

---

## 1. Sửa lỗi "Authentication timed out" (Quan trọng)

Lỗi bạn gặp phải trong screenshot (`Authentication timed out`) xảy ra do **Pi Browser chặn kết nối** từ tên miền chưa được khai báo.

### Cách khắc phục:
1.  Copy đường dẫn trang web của bạn trên Vercel (ví dụ: `https://connect-pi-app-9v46.vercel.app`). **Lưu ý: Bỏ dấu `/` ở cuối nếu có.**
2.  Truy cập [Pi Developer Portal](https://develop.minepi.com/).
3.  Chọn App của bạn.
4.  Vào mục **Configuration**.
5.  Tìm phần **Domains**.
6.  Dán đường dẫn Vercel của bạn vào đây.
7.  Nhấn **Submit** hoặc **Save**.

> **Lưu ý:** Nếu bạn đang chạy Sandbox, hãy đảm bảo bạn đang truy cập qua Pi Browser.

---

## 2. Cấu hình Biến Môi trường (Environment Variables) trên Vercel

Để các chức năng backend hoạt động (xác thực Pi server-side, upload ảnh/video), bạn cần cấu hình các biến sau trong phần **Settings -> Environment Variables** của dự án trên Vercel.

### A. Pi Network API (Cho chức năng thanh toán & xác thực nâng cao)
*   **Key:** `PI_API_KEY`
*   **Value:** Lấy từ trang quản lý Pi Developer Portal (mục API Key).
    *   *Nếu chưa có, bạn có thể bỏ qua tạm thời, nhưng chức năng xác thực server-side (`/api/auth/verify`) sẽ không hoạt động.*

### B. Cloudinary (Để tải video/ảnh)
Hiện tại dự án đang dùng bộ nhớ tạm (IndexedDB) nếu không có Cloudinary. Để lưu trữ thật:

1.  Đăng ký tài khoản tại [Cloudinary](https://cloudinary.com/).
2.  Lấy thông tin từ Dashboard.
3.  Thêm các biến sau vào Vercel:

*   **Key:** `CLOUDINARY_CLOUD_NAME`
*   **Value:** (Tên cloud của bạn)
*   **Key:** `CLOUDINARY_API_KEY`
*   **Value:** (API Key của bạn)
*   **Key:** `CLOUDINARY_API_SECRET`
*   **Value:** (API Secret của bạn)

---

## 3. Kiểm tra lại

Sau khi cấu hình xong trên Vercel:
1.  Vào tab **Deployments** trên Vercel.
2.  Redeploy (Re-build) lại dự án để các biến môi trường có hiệu lực.
3.  Mở Pi Browser và truy cập lại link Vercel.

**Dấu hiệu thành công:**
*   Màn hình Login không còn hiện lỗi timeout.
*   Khi nhấn "Đăng nhập bằng Pi", popup xác thực của Pi Browser sẽ hiện ra ngay lập tức.
