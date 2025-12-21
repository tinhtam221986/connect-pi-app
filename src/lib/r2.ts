import { S3Client } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

// User might provide R2_ENDPOINT directly (e.g. from Vercel blob or specific setup)
let R2_ENDPOINT = process.env.R2_ENDPOINT;

// Robust Sanitization:
// The S3Client expects the *base* service endpoint (e.g., https://<account>.r2.cloudflarestorage.com).
// Vercel or users often copy the full bucket URL (e.g., .../bucket-name).
// We aggressively strip any path to prevent signature mismatches.
if (R2_ENDPOINT) {
    try {
        // If it lacks protocol, add https:// to make it parsable
        if (!R2_ENDPOINT.startsWith('http')) {
            R2_ENDPOINT = `https://${R2_ENDPOINT}`;
        }

        const url = new URL(R2_ENDPOINT);
        // .origin gives us just 'https://hostname.com' without the path
        R2_ENDPOINT = url.origin;

        console.log(`[R2 Config] Sanitized Endpoint: ${R2_ENDPOINT}`);
    } catch (e) {
        console.warn("[R2 Config] Failed to sanitize R2_ENDPOINT, using as-is:", e);
    }
}

// Fallback: Construct from Account ID if Endpoint is missing
if (!R2_ENDPOINT && R2_ACCOUNT_ID) {
    R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
}

// Warn instead of throw during initialization to allow build to proceed
if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.warn("Missing R2 credentials (ACCESS_KEY_ID or SECRET_ACCESS_KEY). Uploads will fail.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT || "https://undefined.r2.cloudflarestorage.com",
  forcePathStyle: true, // Critical for R2 to avoid SSL errors with bucket subdomains
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "mock-access-key",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "mock-secret-key",
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "connect-pi-app-assets";

// Support both naming conventions
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_DOMAIN || "";
