import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log(`Processing upload...`);

        if (isCloudinaryConfigured()) {
            console.log("Cloudinary detected. Uploading...");
            try {
                const url = await uploadToCloudinary(file);
                return NextResponse.json({
                    success: true,
                    url: url,
                    thumbnail: url.replace(/\.[^/.]+$/, ".jpg"), // Cloudinary auto-thumbnail
                    fileId: "vid_" + Math.random().toString(36).substring(7),
                    message: "Video uploaded successfully to Cloudinary"
                });
            } catch (err: any) {
                console.error("Cloudinary failed, falling back to local simulation.", err);
                 return NextResponse.json({ error: 'Cloudinary upload failed: ' + err.message }, { status: 500 });
            }
        }

        // --- FALLBACK: LOCAL SIMULATION (For Vercel without keys or Local Dev) ---
        console.warn("No Cloudinary keys found. Using ephemeral local storage.");
        
        // Handle Vercel Read-Only File System gracefully
        try {
            const result = await uploadToLocal(file);
            return NextResponse.json(result);
        } catch (error: any) {
             if (error.code === 'EROFS' || error.code === 'EACCES') {
                 console.warn("Read-only file system detected (Vercel). Returning mock success.");
                 return NextResponse.json({
                    success: true,
                    url: "https://res.cloudinary.com/demo/video/upload/dog.mp4", // Permanent demo video
                    thumbnail: "https://res.cloudinary.com/demo/video/upload/dog.jpg",
                    fileId: "vid_mock_" + Math.random().toString(36).substring(7),
                    message: "Upload Simulated (Server is Read-Only). Add Cloudinary Keys for real uploads."
                });
            }
            throw error;
        }

    } catch (error: any) {
        console.error("Upload error:", error);
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
    
    return {
        success: true,
        url: publicUrl,
        thumbnail: "/mock_thumbnail.jpg",
        fileId: fileName,
        message: "Video uploaded locally (Ephemeral)"
    };
}
