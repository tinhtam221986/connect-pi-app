import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    // 1. Validate Environment Configuration
    if (!process.env.R2_ACCOUNT_ID && !process.env.R2_ENDPOINT) {
        console.error("Critical: Missing R2_ACCOUNT_ID or R2_ENDPOINT");
        return NextResponse.json(
            { error: "Server Configuration Error: Missing R2_ACCOUNT_ID. Please check Vercel Settings." },
            { status: 500 }
        );
    }

    if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
        console.error("Critical: Missing R2 Credentials");
        return NextResponse.json(
            { error: "Server Configuration Error: Missing R2 Access Keys. Please check Vercel Settings." },
            { status: 500 }
        );
    }

    const { filename, contentType, username } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    const timestamp = Date.now();
    const cleanFilename = filename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const key = `uploads/${username || 'anon'}/${timestamp}-${cleanFilename}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    return NextResponse.json({
      url: signedUrl,
      key: key
    });
  } catch (error: any) {
    console.error("Presigned URL Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
