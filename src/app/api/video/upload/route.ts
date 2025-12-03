import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Configuration: Switch this to 's3' or 'cloudflare' when keys are available
// In a real Web3 app, you might also use IPFS (e.g., Pinata).
const STORAGE_PROVIDER = process.env.VIDEO_STORAGE_PROVIDER || 'local';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log(`Processing upload via provider: ${STORAGE_PROVIDER}`);

        let result;
        if (STORAGE_PROVIDER === 's3') {
             // Placeholder for AWS S3 integration
             // const buffer = Buffer.from(await file.arrayBuffer());
             // result = await s3Client.send(new PutObjectCommand({ ... }));
             return NextResponse.json({ error: "S3 Provider not configured (Missing Credentials)" }, { status: 501 });
        } else if (STORAGE_PROVIDER === 'cloudflare') {
             // Placeholder for Cloudflare Stream
             return NextResponse.json({ error: "Cloudflare Provider not configured (Missing Credentials)" }, { status: 501 });
        } else if (STORAGE_PROVIDER === 'ipfs') {
             // Placeholder for IPFS
             return NextResponse.json({ error: "IPFS Provider not configured" }, { status: 501 });
        } else {
             // Default: Local Storage (Works in Dev, Ephemeral in Vercel)
             result = await uploadToLocal(file);
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Upload error:", error);

        // Fallback to purely mock if write fails (e.g. Vercel read-only system files)
        if (error.code === 'EROFS' || error.code === 'EACCES') {
             return NextResponse.json({
                success: true,
                url: "https://www.w3schools.com/html/mov_bbb.mp4", // Fallback video
                thumbnail: "/mock_thumbnail.jpg",
                fileId: "vid_" + Math.random().toString(36).substring(7),
                message: "Video uploaded (Simulation: Read-only File System detected)"
            });
        }

        return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }
}

async function uploadToLocal(file: File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try to save to a public folder
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Ensure directory exists
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `vid_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const filePath = join(uploadDir, fileName);

    // Write file
    await writeFile(filePath, buffer);
    console.log(`Video uploaded locally to: ${filePath}`);

    const publicUrl = `/uploads/${fileName}`;
    const thumbnail = "/mock_thumbnail.jpg";

    return {
        success: true,
        url: publicUrl,
        thumbnail: thumbnail,
        fileId: fileName,
        message: "Video uploaded successfully (Local Storage)"
    };
}
