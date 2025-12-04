import { NextResponse } from 'next/server';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log(`Processing upload for file: ${file.name}`);

        // Try to upload to Cloudinary first
        // Note: The lib/cloudinary.ts has fallbacks for Name/Key, but SECRET must be in Env.
        if (process.env.CLOUDINARY_API_SECRET) {
            console.log("Cloudinary API Secret found. Attempting real upload...");
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
                console.error("Cloudinary upload failed:", err);
                return NextResponse.json({
                    error: 'Cloudinary upload failed. Check API Keys/Secret. ' + err.message
                }, { status: 500 });
            }
        } else {
             console.warn("Missing CLOUDINARY_API_SECRET. Cannot upload to Cloudinary.");
             return NextResponse.json({
                error: "Configuration Error: CLOUDINARY_API_SECRET is missing. Please add it to your Vercel Environment Variables."
             }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Upload route error:", error);
        return NextResponse.json({ error: 'Upload process failed: ' + error.message }, { status: 500 });
    }
}
