# CONNECT - Setup Instructions

## 1. Cloudinary Integration (Real Video Uploads)
This project is configured to upload videos to your Cloudinary account.
Because Vercel's file system is read-only, you MUST configure Cloudinary for uploads to work in production.

### Step 1: Get your API Secret
1. Go to your [Cloudinary Dashboard](https://console.cloudinary.com/).
2. You have provided:
   - Cloud Name: `dv1hnl0wo`
   - API Key: `727564581351668`
3. Click "View API Keys" or look for **API Secret**. Copy it.

### Step 2: Configure Vercel
1. Go to your project settings on Vercel.
2. Navigate to **Environment Variables**.
3. Add the following variable:
   - Key: `CLOUDINARY_API_SECRET`
   - Value: `[Paste your API Secret here]`

   *(Optional but recommended, add these too so you don't rely on hardcoded fallbacks)*
   - Key: `CLOUDINARY_CLOUD_NAME` -> Value: `dv1hnl0wo`
   - Key: `CLOUDINARY_API_KEY` -> Value: `727564581351668`

4. **Redeploy** your project for changes to take effect.

## 2. Pi Network Real Login
To enable real Pi Network users:
1. Go to the [Pi Developer Portal](https://develop.minepi.com/).
2. Ensure your app URL matches your Vercel URL: `https://connect-pi-app-9v46.vercel.app`
3. If you have a backend API Key for Pi (optional for basic auth, but needed for server-side verification), add it to Vercel as `PI_API_KEY`.

## 3. Features Included
- **Real Video Uploads:** Videos are stored securely on Cloudinary.
- **TikTok-Style Effects:** News, Kawaii, Cyber, and Retro filters are available in the Create tab.
- **Interactive Feed:** Double-tap to like, optimistic UI updates.
- **Pi Payment Integration:** Ready for Testnet payments.

## 4. Deployment
1. Upload the code in `connect-pi-app-code.zip` to your GitHub repository.
2. Vercel should auto-deploy.
3. Ensure Environment Variables are set.
