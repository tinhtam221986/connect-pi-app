# HƯỚNG DẪN KỸ THUẬT & LỘ TRÌNH TRIỂN KHAI (TECHNICAL GUIDE)

Chào sếp, dưới đây là bản hướng dẫn chi tiết về các thành phần kỹ thuật cần thiết để đưa dự án **CONNECT** từ bản mẫu (Prototype) hiện tại thành một "Siêu ứng dụng Web3" hoàn chỉnh như trong bản thiết kế.

Hiện tại, chúng ta đã hoàn thành **Giao diện (Frontend)** và **Logic giả lập (Mock)**. Để ứng dụng hoạt động thực tế với hàng triệu người dùng, chúng ta cần triển khai các phần sau:

---

## 1. Kết nối Pi Network thật (Mainnet/Testnet)

Hiện tại ứng dụng đang chạy ở chế độ "Mock" (Giả lập) để test trên Chrome. Để chạy trên Pi Browser thật:

1.  **Đăng ký App trên Pi Developer Portal:**
    *   Truy cập `develop.pi` trên Pi Browser.
    *   Tạo App mới, lấy `App ID`.
2.  **Cấu hình DNS:**
    *   Bạn cần một domain thực (ví dụ: `connect.social`).
    *   Xác minh domain với Pi Core Team.
3.  **Tắt chế độ Sandbox:**
    *   Mở file `src/components/pi/pi-provider.tsx`.
    *   Tìm dòng: `window.Pi.init({ version: "2.0", sandbox: true })`.
    *   Đổi `sandbox: true` thành `sandbox: false` khi chạy Mainnet.

---

## 2. Xây dựng Backend & Cơ sở dữ liệu (Database)

Ứng dụng hiện tại đang dùng dữ liệu ảo (`mock-data.ts`). Sếp cần thuê một đội Backend để xây dựng hệ thống lưu trữ thực:

*   **Cơ sở dữ liệu (Database):**
    *   Khuyên dùng: **Supabase** (PostgreSQL) hoặc **Firebase**.
    *   Dùng để lưu: Thông tin User, Số dư ví nội bộ, Danh sách Follow, Comment, Like.
*   **API Server:**
    *   Có thể dùng chính **Next.js API Routes** (đã có sẵn trong dự án này ở thư mục `src/app/api`).
    *   Cần viết thêm các hàm: `createUser`, `uploadVideo`, `likeVideo`.

---

## 3. Lưu trữ & Phát Video (Streaming)

Video là phần tốn kém nhất. Không thể lưu video trực tiếp vào Database.

*   **Giải pháp Web3 (Phi tập trung - Khuyên dùng):**
    *   Sử dụng **IPFS** (InterPlanetary File System) hoặc **Arweave**.
    *   Dịch vụ: **Pinata** (để ghim file IPFS).
*   **Giải pháp Web2 (Hiệu suất cao):**
    *   **AWS S3** (Lưu trữ file gốc).
    *   **Mux Video** hoặc **Livepeer** (Dịch vụ xử lý video Web3 chuyên nghiệp). *Livepeer rất phù hợp với dự án Web3.*

**Cách thực hiện tính năng "Tải lên":**
1.  Người dùng chọn file -> Gửi file lên Livepeer/S3.
2.  Nhận về `videoUrl`.
3.  Lưu `videoUrl` vào Database của CONNECT.

---

## 4. Trí tuệ nhân tạo (AI Assistant)

Để Chatbot thông minh thật sự (không trả lời ngẫu nhiên như hiện tại):

*   **OpenAI API (ChatGPT):**
    *   Đăng ký API Key từ OpenAI.
    *   Tạo một API Route `src/app/api/chat/route.ts`.
    *   Gửi câu hỏi của user lên OpenAI và trả về kết quả.
*   **Vector Database (Pinecone):**
    *   Để AI "hiểu" về nội dung video trên CONNECT, cần lưu dữ liệu dưới dạng Vector.

---

## 5. Livestream & PK (Thi đấu)

Đây là tính năng khó nhất.
*   Cần server **RTMP**.
*   Khuyên dùng SDK của **Agora.io** hoặc **Livepeer** để tích hợp tính năng Livestream vào App mà không cần xây server riêng từ đầu.

---

## TỔNG KẾT: LỘ TRÌNH TIẾP THEO

*   **Bước 1 (Đã xong):** Giao diện UI/UX hoàn chỉnh, Mock Data.
*   **Bước 2 (Cần làm ngay):** Kết nối Supabase để lưu User thật.
*   **Bước 3:** Tích hợp Livepeer để upload video thật.
*   **Bước 4:** Xin duyệt Mainnet từ Pi Core Team.

Sếp có thể đưa tài liệu này cho các kỹ sư Backend/DevOps để họ tiếp tục triển khai phần hạ tầng (Infrastructure).
