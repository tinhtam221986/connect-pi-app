# CONNECT - Web3 Social on Pi Network

## 🚀 Introduction
CONNECT is a decentralized social platform (similar to TikTok) built on the Pi Network ecosystem. It allows users to create, share, and monetize content using Pi.

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Integration:** Pi Network SDK + MongoDB + Cloudflare R2

## 📦 Installation & Setup

### 1. Local Development
```bash
npm install
npm run dev
```

### 2. Production Deployment (Real Pi Network)
To connect this app to the **Real Pi Network** and enable video uploads, you must configure the environment variables correctly.

**👉 Please follow the detailed instructions in [GUIDE_SETUP_REAL_ENV.md](./GUIDE_SETUP_REAL_ENV.md).**

Key steps:
1. Deploy to Vercel.
2. Register App in Pi Developer Portal (Mainnet).
3. Set `NEXT_PUBLIC_PI_SANDBOX=false` in Vercel Environment Variables.
4. Set up MongoDB and Cloudflare R2 keys for storage.

## 📂 Project Structure
- `src/app`: Application routes.
- `src/components/pi`: Pi Network integration logic.
- `src/components/create`: Video recording and upload studio.
- `contracts`: Smart Contracts (Solidity) for GameFi features.

## 🤝 Contribution
Contributions are welcome! Please create a Pull Request.

---
*Built with ❤️ for the Pi Community*
Kich hoat lai Vercel
