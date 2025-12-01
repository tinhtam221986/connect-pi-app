# Kiến trúc Hệ thống CONNECT (Project Blueprint)

## 1. Stack Công nghệ (Tech Stack)

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion (cho hiệu ứng động/3D)
- **State Management:** React Context / Zustand (cho UI state) + TanStack Query (cho API data)
- **PWA:** next-pwa (cho trải nghiệm app-like)

### Backend & Blockchain
- **Server:** Next.js Server Actions / API Routes (Node.js)
- **Database:** MongoDB / PostgreSQL (Lưu trữ user profile, bài đăng, metadata)
- **Blockchain Integration:** Pi Network SDK (JavaScript)
  - Auth: `Pi.authenticate`
  - Payments: `Pi.createPayment`
- **Storage:** IPFS hoặc AWS S3 (cho video/ảnh user)

### AI Core
- **Text/Chat:** OpenAI API (GPT-4) hoặc Llama 3 (Self-hosted)
- **Video Analysis:** Google Cloud Video Intelligence hoặc AWS Rekognition
- **Recommendation Engine:** Custom Vector Database (Pinecone/Milvus) + Collaborative Filtering

---

## 2. Cấu trúc Thư mục (Dự kiến)

```
app/
  contexts/
    PiNetworkContext.tsx  # Quản lý kết nối Pi
    ThemeContext.tsx      # Quản lý giao diện động
  components/
    ai/
      ChatAssistant.tsx   # Chatbot di chuyển tự do
    creator/
      VideoEditor.tsx     # Công cụ edit video AI
    marketplace/
      ProductCard.tsx
    ui/                   # Các component cơ bản (Button, Modal, Toast)
  lib/
    pi-sdk/               # Wrapper cho Pi Network calls
    ai-service/           # Kết nối tới AI Backend
  hooks/                  # Custom hooks (usePi, useTheme)
```

---

## 3. Các Module Chính

### A. Authentication Module (Pi Network)
- **Flow:** Check `window.Pi` -> `Pi.authenticate` -> Verify Token on Backend -> Create/Get User Session.
- **Security:** CSRF Protection, Rate Limiting.

### B. Dynamic UI Engine
- Lưu trữ cấu hình theme trong LocalStorage/Database.
- Áp dụng biến CSS (CSS Variables) để thay đổi màu sắc/font tức thì.

### C. AI Content Studio
- Upload video -> Server Process (FFmpeg + AI Tagging) -> Return optimized stream.
- Text-to-Speech integration.

---

## 4. Lộ trình Triển khai (Phases)

1. **Phase 1: Core Foundation** (Hiện tại)
   - Setup Next.js, Pi Network Auth.
   - Basic UI Shell.
2. **Phase 2: Social Basics**
   - Video Feed, Profile, Comments.
3. **Phase 3: AI & Customization**
   - Chatbot, Theme Engine, Content Recommendation.
4. **Phase 4: Economy & GameFi**
   - Marketplace, Pi Payments, Live Battles.
