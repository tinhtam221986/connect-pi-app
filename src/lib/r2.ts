import { S3Client } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

// User might provide R2_ENDPOINT directly (e.g. from Vercel blob or specific setup)
let R2_ENDPOINT = process.env.R2_ENDPOINT;

// Clean endpoint if it contains bucket name (common mistake or Vercel specific)
if (R2_ENDPOINT && R2_ENDPOINT.endsWith(process.env.R2_BUCKET_NAME || 'connect-pi-app-assets')) {
    // Remove the bucket suffix to get the base service endpoint
    R2_ENDPOINT = R2_ENDPOINT.replace(`/${process.env.R2_BUCKET_NAME || 'connect-pi-app-assets'}`, '');
}

// If no endpoint provided, construct from Account ID
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
