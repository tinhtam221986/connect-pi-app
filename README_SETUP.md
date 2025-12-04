# CONNECT - Setup Instructions

To unlock the full potential of CONNECT (Real Video Uploads & Live Pi Network Integration), you must configure the environment variables in Vercel.

## 1. Cloudinary Setup (For Real Video Uploads)
CONNECT uses Cloudinary to store video files permanently, as Vercel is ephemeral (read-only).

1.  **Register:** Go to [Cloudinary](https://cloudinary.com/) and create a free account.
2.  **Dashboard:** On your Dashboard, find your **Cloud Name**, **API Key**, and **API Secret**.
3.  **Vercel Env Vars:** Add the following to your Vercel Project Settings > Environment Variables:
    *   `CLOUDINARY_CLOUD_NAME` = `your_cloud_name`
    *   `CLOUDINARY_API_KEY` = `your_api_key`
    *   `CLOUDINARY_API_SECRET` = `your_api_secret`

*Without these, uploads will simulate success but files will disappear or be replaced by a dog video.*

## 2. Pi Network Setup (For Login)

1.  **Developer Portal:** Go to [develop.minepi.com](https://develop.minepi.com).
2.  **App Configuration:**
    *   Ensure your **Development URL** matches your Vercel URL (e.g., `https://connect-pi-app-9v46.vercel.app`).
    *   Ensure **Sandbox** is enabled if testing.
3.  **API Key (Critical):**
    *   If you see "Login Errors", regenerate your API Key in the portal.
    *   Add it to Vercel Env Vars if you implement server-side Pi calls (currently user-side auth is primary, but future features need this).
    *   `PI_API_KEY` = `your_pi_api_key`

## 3. Deployment
1.  **Download:** Download the latest code provided.
2.  **GitHub:** Upload/Push to your `tinhtam221986/connect-pi-app` repository.
3.  **Vercel:** Vercel will auto-deploy. Check the "Logs" tab in Vercel if build fails.

## Troubleshooting
*   **"Login Failed":** Open the Pi Browser. Look at the black "Debug Log" overlay at the bottom. It will tell you if the backend rejected the token.
*   **"Upload Failed":** Check Vercel logs. It usually means Cloudinary keys are missing.
