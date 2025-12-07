# HƯỚNG DẪN CÀI ĐẶT ĐĂNG NHẬP PI NETWORK THẬT (REAL LOGIN)

Tài liệu này hướng dẫn chi tiết cách cấu hình ứng dụng CONNECT để đăng nhập bằng tài khoản Pi thật (trên Pi Browser), thay vì chế độ Giả lập (Sandbox).

⚠️ **QUAN TRỌNG:** Để đăng nhập thật, ứng dụng của bạn phải được chạy bên trong **Pi Browser**.

---

## BƯỚC 1: Đăng ký Ứng dụng trên Pi Developer Portal

1.  Mở ứng dụng **Pi Browser** trên điện thoại.
2.  Truy cập địa chỉ: `develop.pi`
3.  Nhấn **New App** (nếu chưa tạo) hoặc chọn App của bạn.
4.  Điền thông tin:
    *   **App Name:** CONNECT (hoặc tên dự án của bạn).
    *   **Description:** Web3 Social App.
    *   **App Network:** Chọn **Pi Testnet** (để test với Pi ảo) hoặc **Pi Mainnet** (khi ra mắt thật). *Khuyên dùng Testnet trước.*
5.  **Cấu hình URL (Quan trọng nhất):**
    *   **App URL:** Nhập địa chỉ Vercel của bạn (ví dụ: `https://connect-app.vercel.app`).
    *   **Hosting URL:** Phải trùng khớp với App URL và **bắt buộc là HTTPS**.
    *   *Lưu ý:* Nếu bạn đang chạy local (localhost:3000), bạn cần dùng tool như `ngrok` để tạo tunnel HTTPS (ví dụ: `https://my-tunnel.ngrok.io`) và điền vào đây. Pi Browser không thể truy cập `localhost` của máy tính bạn.

---

## BƯỚC 2: Cài đặt Biến Môi trường (Environment Variables)

Bạn cần cấu hình các biến môi trường để ứng dụng biết nó đang chạy ở chế độ "Thật".

### Trên Vercel (Deployment):
Vào **Settings** -> **Environment Variables** và thêm:

| Tên Biến | Giá trị | Mô tả |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_PI_SANDBOX` | `false` | **Bắt buộc**. Tắt chế độ Sandbox web để chạy trên Pi Browser. |
| `PI_API_KEY` | `Key_của_bạn` | Lấy từ Pi Developer Portal (mục API Key). Dùng để xác thực backend (tùy chọn cho Login, bắt buộc cho Thanh toán). |

### Chạy Local (Môi trường phát triển):
Tạo file `.env.local` tại thư mục gốc và thêm:

```env
# Tắt Sandbox để test trên Pi Browser (thông qua ngrok)
NEXT_PUBLIC_PI_SANDBOX=false

# API Key (Lấy từ develop.pi)
PI_API_KEY=Key_của_bạn_ở_đây
```

---

## BƯỚC 3: Kiểm thử Đăng nhập

1.  Deploy code mới lên Vercel (hoặc chạy ngrok).
2.  Mở **Pi Browser** trên điện thoại.
3.  Truy cập URL của App (ví dụ: `https://connect-app.vercel.app` hoặc qua cổng `pi://connect-app.vercel.app` nếu đã cấu hình DNS).
4.  Màn hình Đăng nhập sẽ hiện ra.
5.  Nhấn nút **"Đăng nhập bằng Pi"**.
6.  Một hộp thoại của Pi Network sẽ hiện lên yêu cầu cấp quyền chia sẻ Username.
    *   Nhấn **Allow** (Cho phép).
7.  Nếu thành công, bạn sẽ được chuyển vào Màn hình chính (`MainAppView`).
    *   Thanh trạng thái phía trên sẽ hiện: **"Đã kết nối Pi Network"** (Màu xanh lá).

---

## KHẮC PHỤC SỰ CỐ THƯỜNG GẶP

### 1. Lỗi "Loading SDK..." quay mãi không dừng
*   **Nguyên nhân:** App không chạy trong Pi Browser hoặc Pi SDK không tải được.
*   **Khắc phục:** Đảm bảo bạn đang mở link bằng **Pi Browser** (không phải Chrome/Safari).

### 2. Lỗi "Module not found" khi Deploy
*   **Nguyên nhân:** Lỗi đường dẫn file (ví dụ: viết hoa/thường sai).
*   **Khắc phục:** Đã được kiểm tra và xử lý trong bản cập nhật này. Codebase hiện tại đã chính xác.

### 3. Đăng nhập không phản hồi
*   **Nguyên nhân:** `NEXT_PUBLIC_PI_SANDBOX` vẫn đang là `true`.
*   **Khắc phục:** Kiểm tra lại biến môi trường trên Vercel.

### 4. Lỗi "Invalid Domain"
*   **Nguyên nhân:** URL bạn đang truy cập không khớp với URL đã đăng ký trong Pi Developer Portal.
*   **Khắc phục:** Vào `develop.pi` và cập nhật lại App URL.
