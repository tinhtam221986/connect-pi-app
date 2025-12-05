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
                // If Cloudinary fails, we tell frontend to use local fallback
                return NextResponse.json({
                    success: false,
                    useLocalFallback: true,
                    error: 'Cloudinary upload failed. Check API Keys/Secret. ' + err.message
                }, { status: 200 }); // Status 200 so frontend can handle gracefully
            }
        } else {
             console.warn("Missing CLOUDINARY_API_SECRET. Using Local Fallback.");
             // Return success: false but with a flag telling frontend to use IndexedDB
             return NextResponse.json({
                success: false,
                useLocalFallback: true,
                error: "Cloudinary not configured. Using local storage."
             }, { status: 200 });
        }

    } catch (error: any) {
        console.error("Upload route error:", error);
        return NextResponse.json({ error: 'Upload process failed: ' + error.message }, { status: 500 });
    }
}
