import { S3Client } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

// Warn instead of throw during initialization to allow build to proceed
// This is the "lazy loading" equivalent for the R2 client to prevent build-time crashes
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.warn("Missing R2 environment variables. R2 client will be initialized with mock credentials for build purposes.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ACCOUNT_ID
    ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "https://undefined.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "mock-access-key",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "mock-secret-key",
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "connect-pi-app-assets";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";
