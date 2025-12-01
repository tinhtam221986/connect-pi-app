# Hướng dẫn Phát triển Tính năng Nâng cao (Development Guide)

Tài liệu này hướng dẫn chi tiết cách triển khai các module phức tạp trong hệ sinh thái CONNECT mà bạn (User) và AI (Assistant) có thể phối hợp thực hiện.

## 1. Tích hợp AI Chatbot (CONNECT AI Assistant)

### Yêu cầu
- Chatbot phải có avatar động (3D hoặc Animated GIF).
- Có khả năng kéo thả (Draggable) trên màn hình.
- Kết nối với API (OpenAI/Gemini).

### Các bước thực hiện
1. **Frontend UI (Draggable):**
   - Sử dụng thư viện `framer-motion` cho tính năng kéo thả.
   - Component: `components/ai/FloatingChatbot.tsx`
   ```tsx
   <motion.div drag dragConstraints={parentRef}>
      <Avatar src={userCustomAvatar} />
      {isOpen && <ChatWindow />}
   </motion.div>
   ```
2. **Backend API:**
   - Tạo Route `app/api/ai/chat/route.ts`.
   - Gọi OpenAI API với context của người dùng (ví dụ: tên, sở thích từ DB).
3. **Customization:**
   - Lưu trạng thái vị trí (x, y) vào LocalStorage để ghi nhớ vị trí giữa các lần reload.

---

## 2. Hệ thống Quà tặng & Icon (Pi Gifts)

### Yêu cầu
- Hiển thị hiệu ứng 3D khi nhận quà.
- Thanh toán bằng Pi.

### Các bước thực hiện
1. **Tạo Asset 3D:**
   - Sử dụng định dạng `.gltf` hoặc `.lottie` (JSON animation) cho nhẹ.
2. **Hiệu ứng trên màn hình:**
   - Sử dụng `react-confetti` hoặc `framer-motion` để bắn hiệu ứng từ vị trí nút "Tặng quà".
3. **Quy trình Thanh toán:**
   - Khi người dùng bấm tặng -> Gọi `Pi.createPayment`.
   - `onReadyForServerApproval` -> Gọi Backend xác nhận giao dịch -> Lưu vào DB -> Trigger hiệu ứng qua WebSocket (Pusher/Socket.io) để hiển thị lên màn hình Livestream.

---

## 3. GameFi & Live Battles

### Yêu cầu
- Đồng bộ thời gian thực giữa 2 người chơi (Host & Guest).
- Bảng xếp hạng realtime.

### Các bước thực hiện
1. **Realtime Engine:**
   - Cần một Server WebSocket riêng (hoặc dùng dịch vụ như Pusher/Firebase Realtime Database).
2. **Logic Thi đấu:**
   - Định nghĩa luật chơi (ví dụ: ai nhận nhiều tim hơn trong 5 phút).
   - Server tính toán điểm và broadcast cập nhật mỗi giây.
3. **Kết thúc & Trao thưởng:**
   - Smart Contract hoặc Backend logic để phân phối Pi từ Pool thưởng cho người thắng.

---

## 4. Tối ưu hóa cho Pi Browser

- Luôn kiểm tra `window.Pi` trước khi render các component liên quan đến ví.
- Sử dụng font chữ lớn, nút bấm dễ thao tác (Touch target > 44px).
- Hạn chế animation nặng nếu phát hiện thiết bị cấu hình thấp.

---

## Cần hỗ trợ thêm?
Hãy yêu cầu cụ thể từng module (ví dụ: "Hãy viết code cho FloatingChatbot") để AI có thể hỗ trợ bạn triển khai chi tiết từng phần.
