import { NextResponse } from "next/server";
import { R2_PUBLIC_URL } from "@/lib/r2";

export const dynamic = 'force-dynamic'; // Ensure this isn't cached at build time

export async function GET() {
  const endpoint = process.env.R2_ENDPOINT || "Not Set";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || "Not Set";
  const secretKey = process.env.R2_SECRET_ACCESS_KEY || "Not Set";

  // Masking
  const maskedAccessKeyId = accessKeyId !== "Not Set" && accessKeyId.length > 4
    ? `****${accessKeyId.slice(-4)}`
    : accessKeyId;

  const maskedSecretKey = secretKey !== "Not Set" && secretKey.length > 8
    ? `${secretKey.slice(0, 4)}...${secretKey.slice(-4)} (Length: ${secretKey.length})`
    : secretKey;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
        R2_ENDPOINT: endpoint,
        R2_ACCESS_KEY_ID: maskedAccessKeyId,
        R2_SECRET_ACCESS_KEY: maskedSecretKey,
        R2_PUBLIC_URL: R2_PUBLIC_URL || "Not Set (Warning: Videos won't play)",
        R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || "Default: connect-pi-app-assets"
    }
  });
}
