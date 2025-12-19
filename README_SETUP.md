# CONNECT - Setup Instructions

To unlock the full potential of CONNECT (Real Video Uploads & Live Pi Network Integration), you must configure the environment variables in Vercel.

## 1. Database & Storage Setup
CONNECT uses **MongoDB** for data persistence and **Cloudflare R2** for file storage.

### A. MongoDB
1.  **Register:** Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2.  **Cluster:** Create a new cluster.
3.  **Connection:** Get your connection string (Driver format).
4.  **Vercel Env Vars:** Add `MONGODB_URI` = `your_connection_string`.

### B. Cloudflare R2
1.  **Create Bucket:** In Cloudflare Dashboard > R2, create a bucket (e.g., `connect-assets`).
2.  **Public Access:** Enable public access for the bucket and note the **Public URL**.
3.  **API Tokens:** Generate an API Token with **Admin Read & Write** permissions.
4.  **Vercel Env Vars:** Add the following:
    *   `R2_ACCOUNT_ID`
    *   `R2_ACCESS_KEY_ID`
    *   `R2_SECRET_ACCESS_KEY`
    *   `R2_BUCKET_NAME`
    *   `R2_PUBLIC_URL`

*Without these, uploads will fail and user data will not be saved.*

## 2. Pi Network Setup (For Login)

1.  **Developer Portal:** Go to [develop.minepi.com](https://develop.minepi.com).
2.  **App Configuration:**
    *   Ensure your **Development URL** matches your Vercel URL.
    *   Ensure **Sandbox** is enabled if testing.
3.  **API Key (Critical):**
    *   If you see "Login Errors", regenerate your API Key in the portal.
    *   Add it to Vercel Env Vars.
    *   `PI_API_KEY` = `your_pi_api_key`

## 3. Deployment
1.  **Download:** Download the latest code provided.
2.  **GitHub:** Upload/Push to your repository.
3.  **Vercel:** Vercel will auto-deploy. Check the "Logs" tab in Vercel if build fails.

## Troubleshooting
*   **"Login Failed":** Open the Pi Browser. Look at the black "Debug Log" overlay at the bottom. It will tell you if the backend rejected the token.
*   **"Upload Failed":** Check Vercel logs. It usually means R2 keys are missing or permissions are wrong.
