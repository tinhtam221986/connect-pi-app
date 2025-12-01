# CONNECT - Web3 Social for Pi Network

![Connect App Banner](https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop)

**CONNECT** is a decentralized social media platform built specifically for the Pi Network ecosystem. It features a TikTok-style video feed, a robust sidebar navigation, and integrated Pi Wallet authentication.

## 🚀 Features

*   **📱 Modern UI/UX:** Built with Next.js 14, Tailwind CSS, and Shadcn UI (Dark Mode enabled).
*   **🎥 Video Feed:** Infinite scroll-style vertical video feed component.
*   **🔐 Pi Network Auth:** Integrated Pi SDK for user authentication and wallet connection.
*   **💎 Web3 Ready:** Designed for future NFT and Token tipping features.
*   **⚡ High Performance:** Optimized for mobile browsers (especially Pi Browser).

## 🛠 Tech Stack

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
*   **Icons:** Lucide React

---

## 📦 Deployment Guide (For Pi Network)

Follow these steps to launch your app on the Pi Browser.

### Step 1: Deploy to Vercel (Free)

1.  Push this code to your **GitHub** repository.
2.  Go to [Vercel.com](https://vercel.com) and sign up/login.
3.  Click **"Add New Project"** and select this repository.
4.  Click **"Deploy"**.
5.  Once finished, copy the **Domain** (e.g., `https://connect-app-xyz.vercel.app`).

### Step 2: Register on Pi Developer Portal

1.  Open the **Pi Browser** app on your phone.
2.  Navigate to the URL: `develop.pi`.
3.  Tap **"New App"**.
4.  Fill in the details:
    *   **App Name:** Connect Social (or your choice).
    *   **App URL:** Paste the Vercel link from Step 1.
5.  Submit!

### Step 3: Verify

1.  Open your app via the Pi Browser (using the direct link or through the Developer Portal "Open" button).
2.  Click the **"Authenticate with Pi Browser"** button in the app.
3.  You should see a success message showing your Pi username.

---

## 💻 Local Development

To run the app on your computer for testing:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

> **Note:** The Pi SDK features will essentially run in "Mock/Sandbox" mode when not inside the Pi Browser.

## 📄 License

This project is open source. Feel free to modify and distribute.
