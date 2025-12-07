# HƯỚNG DẪN CÀI ĐẶT MÔI TRƯỜNG THỰC TẾ (REAL ENVIRONMENT)

Tài liệu này hướng dẫn chi tiết cách cấu hình ứng dụng **CONNECT** để chạy hoàn hảo trên Pi Network (Pi Browser) với đầy đủ tính năng Đăng nhập thật và Upload Video/Ảnh.

---

## BƯỚC 1: Đăng ký Ứng dụng trên Pi Developer Portal

1.  Mở ứng dụng **Pi Browser** trên điện thoại.
2.  Truy cập địa chỉ: `develop.pi`
3.  Nhấn **New App** (nếu chưa tạo) hoặc chọn App của bạn.
4.  Điền thông tin:
    *   **App Name:** CONNECT.
    *   **App Network:** Chọn **Pi Mainnet** (hoặc Testnet).
5.  **Cấu hình URL (Quan trọng nhất):**
    *   **App URL:** Nhập địa chỉ Vercel của bạn (ví dụ: `https://connect-app.vercel.app`).
    *   **Hosting URL:** Phải trùng khớp với App URL và **bắt buộc là HTTPS**.
    *   *Lưu ý:* Nếu chạy local, dùng `ngrok` để tạo link HTTPS.

---

## BƯỚC 2: Đăng ký Cloudinary (Để Upload Video)

Để người dùng có thể đăng video và ảnh thật (thay vì lưu local), bạn cần dịch vụ Cloudinary miễn phí.

1.  Truy cập [cloudinary.com](https://cloudinary.com) và đăng ký tài khoản miễn phí.
2.  Vào **Dashboard**, tìm mục "Account Details".
3.  Copy 3 thông số sau:
    *   `Cloud Name`
    *   `API Key`
    *   `API Secret`

---

## BƯỚC 3: Cài đặt Biến Môi trường (Environment Variables)

Vào **Vercel** -> **Settings** -> **Environment Variables** (hoặc file `.env.local` nếu chạy local) và thêm các biến sau:

| Tên Biến | Giá trị | Mô tả |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_PI_SANDBOX` | `false` | **Quan trọng**. Tắt chế độ Sandbox web để chạy trên Pi Browser. |
| `PI_API_KEY` | `Key_của_bạn` | Lấy từ Pi Developer Portal. |
| `CLOUDINARY_CLOUD_NAME` | `Tên_Cloud_của_bạn` | Lấy từ Cloudinary Dashboard. |
| `CLOUDINARY_API_KEY` | `Key_Cloudinary` | Lấy từ Cloudinary Dashboard. |
| `CLOUDINARY_API_SECRET` | `Secret_Cloudinary` | Lấy từ Cloudinary Dashboard. |

---

## BƯỚC 4: Kiểm thử Toàn diện

1.  **Deploy** code mới lên Vercel.
2.  Mở **Pi Browser** trên điện thoại.
3.  Truy cập URL App.
4.  **Kiểm tra Đăng nhập:** Nhấn "Đăng nhập". Thanh trạng thái phải hiện "Đã kết nối Pi Network".
5.  **Kiểm tra Upload:** Vào Tab "Tạo" (Create) -> Upload Video. Nếu Cloudinary đúng, video sẽ được tải lên server và người khác có thể xem.

---

## KHẮC PHỤC SỰ CỐ

*   **Lỗi Upload 500:** Do chưa cấu hình Cloudinary keys.
*   **Lỗi Đăng nhập (Loading SDK...):** Do chưa set `NEXT_PUBLIC_PI_SANDBOX=false` hoặc không chạy trên Pi Browser.
*   **Màn hình đen/trắng:** Kiểm tra tab Console (dùng `eruda` hoặc nối máy tính debug) để xem lỗi JS.

Chúc bạn thành công đưa CONNECT đến với cộng đồng Pi Network! 🚀
