import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Ensure this is not cached

export async function GET() {
  const envStatus = {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID ? "Set" : "Missing",
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ? "Set" : "Missing",
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ? "Set" : "Missing",
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME ? "Set" : "Missing",
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL ? "Set" : "Missing",
    MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Missing",
    NODE_ENV: process.env.NODE_ENV,
    TIMESTAMP: new Date().toISOString(),
  };

  const isConfigured = Object.values(envStatus).every(val => val !== "Missing");

  return NextResponse.json({
    status: isConfigured ? "ok" : "error",
    env: envStatus,
    message: isConfigured
      ? "All required environment variables are set."
      : "Some environment variables are missing. Please check Vercel Settings."
  }, { status: isConfigured ? 200 : 500 });
}
