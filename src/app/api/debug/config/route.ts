import { NextResponse } from "next/server";
import { r2Client, R2_PUBLIC_URL, R2_BUCKET_NAME } from "@/lib/r2";
import { ListObjectsV2Command, HeadBucketCommand } from "@aws-sdk/client-s3";

export const dynamic = 'force-dynamic';

export async function GET() {
  const endpoint = process.env.R2_ENDPOINT || "Not Set";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || "Not Set";
  const secretKey = process.env.R2_SECRET_ACCESS_KEY || "Not Set";

  // Masking
  const maskedAccessKeyId = accessKeyId !== "Not Set" && accessKeyId.length > 4
    ? `****${accessKeyId.slice(-4)}`
    : accessKeyId;

  // Check if Access Key looks like a Token (Tokens are usually long, S3 Keys are 32 chars hex)
  const isSuspiciousKey = accessKeyId !== "Not Set" && accessKeyId.length > 40;

  const maskedSecretKey = secretKey !== "Not Set" && secretKey.length > 8
    ? `${secretKey.slice(0, 4)}...${secretKey.slice(-4)} (Length: ${secretKey.length})`
    : secretKey;

  let connectivityStatus = "Not Checked";
  let connectivityError = null;

  try {
    // Try to list 1 file to verify credentials and bucket existence
    const command = new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        MaxKeys: 1
    });
    await r2Client.send(command);
    connectivityStatus = "Success: Connected to R2 & Bucket found";
  } catch (error: any) {
    connectivityStatus = "Failed";
    connectivityError = error.message;
    console.error("R2 Connectivity Check Failed:", error);
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    config_check: {
        R2_ENDPOINT_SANITIZED: endpoint,
        R2_ACCESS_KEY_ID_MASKED: maskedAccessKeyId,
        KEY_FORMAT_WARNING: isSuspiciousKey ? "WARNING: R2_ACCESS_KEY_ID looks too long (like a Token). It should be an S3 Access Key (32 chars)." : "OK (Length looks like S3 Key)",
        R2_PUBLIC_URL: R2_PUBLIC_URL || "Not Set (Warning: Videos won't play)",
        R2_BUCKET_NAME: R2_BUCKET_NAME
    },
    connectivity: {
        status: connectivityStatus,
        error: connectivityError
    }
  });
}
