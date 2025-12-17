import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";

export async function POST(request: Request) {
  try {
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
