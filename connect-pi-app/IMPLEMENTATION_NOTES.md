# CONNECT - Implementation Notes

This document outlines the technical scope for the initial "Skeleton" and "Prototype" phase of the CONNECT project.

## 1. Scope of Current Version (v0.1.0)
The goal of this version is to build the **Frontend Architecture** and **User Interface (UI)** that accurately reflects the vision described in `PROJECT_BLUEPRINT.md`.

### Implemented Features (Simulated/Frontend Only)
*   **Navigation Structure:** Bottom navigation bar connecting Feed, Marketplace, Create, Wallet, and Profile.
*   **Video Feed:** A vertical scrolling interface (like TikTok) populated with **Mock Data** (sample videos/images).
*   **Pi Network Status:** A high-visibility status bar indicating "Testnet Connected" (or Mock mode).
*   **User Profile:** UI for displaying "Level", "Reputation", and "Pi Balance".
*   **AI Assistant:** A visual interface (floating button/chat window) for the AI, with static or simple canned responses.

## 2. Mocked Features & Future Requirements
Certain features described in the Whitepaper require complex backend infrastructure that is outside the scope of this frontend repository. They are currently "mocked" (simulated) for demonstration purposes.

| Feature | Current State | Requirement for Full Production |
| :--- | :--- | :--- |
| **Video Storage** | Uses public URLs (Mock) | AWS S3 or IPFS (Decentralized Storage) |
| **Live Streaming** | UI Only (Placeholder) | RTMP/WebRTC Streaming Server (e.g., Mux, Livepeer) |
| **AI Video Editing** | Not Implemented | Dedicated GPU Servers (Python/PyTorch Backend) |
| **AI Recommendation** | Random/Static List | Machine Learning Engine (Vector DB, Python) |
| **Real Pi Payments** | Sandbox/Testnet Only | Mainnet Approval & Server-side Wallet integration |
| **KYC/Identity** | Mocked "Verified" status | Integration with Pi Platform APIs (User scope) |

## 3. Development Roadmap
1.  **Phase 1 (Current):** UI/UX Construction, Mock Data, Navigation, Pi Sandbox Integration.
2.  **Phase 2:** Connect to a real backend (Firebase or Supabase) to store user profiles and posts.
3.  **Phase 3:** Integrate Media Storage (Cloudinary or S3) for real video uploads.
4.  **Phase 4:** Develop the AI Microservice (Python) for content moderation and recommendation.
