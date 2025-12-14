import { NextResponse } from 'next/server';
import { Upload } from "@aws-sdk/lib-storage";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `avatars/${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    const upload = new Upload({
      client: r2Client,
      params: {
        Bucket: R2_BUCKET_NAME,
        Key: filename,
        Body: file.stream(),
        ContentType: file.type,
      },
    });

    await upload.done();
    const fileUrl = `${R2_PUBLIC_URL}/${filename}`;

    return NextResponse.json({ secure_url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
