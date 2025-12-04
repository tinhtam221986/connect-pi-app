# Setup Guide for Real Deployment (Vercel)

This version includes "Real Mode" features which require configuration.

## 1. Cloudinary Setup (For Video Storage)
To make your videos persist (not disappear on refresh), you need a Cloudinary account.
1. Sign up at https://cloudinary.com/
2. Go to Dashboard to get your Cloud Name, API Key, and Secret.
3. In your Vercel Project Settings -> Environment Variables, add:
   - `CLOUDINARY_CLOUD_NAME` = your_cloud_name
   - `CLOUDINARY_API_KEY` = your_api_key
   - `CLOUDINARY_API_SECRET` = your_api_secret

## 2. Pi Network Real Auth
To allow real Pi Users to login without the "Mock" mode:
1. Go to the Pi Developer Portal (develop.pi).
2. Get your **API Key**.
3. In Vercel Environment Variables, add:
   - `PI_API_KEY` = Key from Pi Developer Portal

## 3. Deployment
1. Upload this code to GitHub.
2. Vercel will auto-deploy.
3. **Important:** If you see "Read-only file system" errors in the logs, it means Cloudinary keys are missing. The app will fallback to local simulation, but that doesn't work well on Vercel.

## 4. Updates Included in this Version
- **TikTok-style Camera:** Added Kawaii, News, and Cinema filters.
- **Effects:** Added Stickers and Sparkle overlays.
- **Real Auth:** Strict validation against Pi Network servers.
- **Cloud Storage:** Direct integration with Cloudinary.
