# CONNECT Web3 Social Application

## Project Overview
This is a Web3 Social application called "CONNECT", built with Next.js 14, Tailwind CSS, and Shadcn UI. It integrates Pi Network features and aims to provide a social platform with video feeds and connectivity.

## Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Radix Primitives)
- **Icons:** Lucide React
- **Pi Network:** Pi SDK Integration (`src/components/pi`)
- **Database:** MongoDB (via Mongoose)
- **Storage:** Cloudflare R2 (AWS SDK v3)

## Setup Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

3.  **Build for Production:**
    ```bash
    npm run build
    ```

## Pi Network Deployment Guide

To run this application on the Pi Browser:

1.  **Deploy to Vercel (or similar HTTPS hosting):**
    - Push this code to a GitHub repository.
    - Import the repository into Vercel and deploy.
    - Note the deployment URL (e.g., `https://connect-app.vercel.app`).

2.  **Register App in Pi Developer Portal:**
    - Open **Pi Browser** on your mobile device.
    - Go to **develop.pi**.
    - Click **New App**.
    - Enter App Name.
    - **App URL:** Paste your Vercel deployment URL (must be HTTPS).
    - **MinePi.com email:** Verify your email if asked.

3.  **Testing:**
    - Open the app via the Pi Browser to test authentication.
    - The `PiSDKProvider` is configured to use Sandbox mode by default. Change `sandbox: true` to `false` in `src/components/pi/pi-provider.tsx` when moving to Mainnet.

## Directory Structure
- `src/app`: App router pages and layouts.
- `src/components/ui`: Reusable UI components (Shadcn).
- `src/components/pi`: Pi Network specific components (Provider & Connect Button).
- `src/lib`: Utility functions.
