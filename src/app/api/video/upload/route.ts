import { NextResponse } from "next/server";
import { Upload } from "@aws-sdk/lib-storage";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";
import { SmartContractService } from "@/lib/smart-contract-service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const username = formData.get("username") as string;
    const description = formData.get("description") as string;
    const hashtags = formData.get("hashtags") as string;
    const privacy = formData.get("privacy") as string;
    const deviceSignature = formData.get("deviceSignature") as string;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const cleanFilename = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const key = `uploads/${username || 'anon'}/${timestamp}-${cleanFilename}`;

    // Convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudflare R2
    const upload = new Upload({
      client: r2Client,
      params: {
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      },
    });

    await upload.done();

    // Construct Public URL
    // Ensure R2_PUBLIC_URL is configured, otherwise fallback might be needed (though strict config preferred)
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    // --- SAVE TO MONGODB ---
    try {
        await connectDB();

        // Determine resource type based on MIME type
        const isVideo = file.type.startsWith('video');
        const resourceType = isVideo ? 'video' : 'image';

        const newVideo = await Video.create({
            videoUrl: publicUrl,
            caption: description || "",
            privacy: privacy || 'public',
            resourceType: resourceType, // Explicitly save resource type
            author: {
                username: username || "Anonymous",
                user_uid: `user_${username || 'anon'}`,
                avatar: "" // Placeholder, ideally fetched from User profile
            },
            metadata: {
                // R2 doesn't return metadata like Cloudinary, so we use file props or placeholders
                // Real duration extraction requires ffprobe on server, skipping for MVP
                duration: 0,
                width: 0,
                height: 0,
                fileSize: file.size,
                format: file.type.split('/')[1] || ""
            },
            deviceSignature: deviceSignature || "unknown",
            likes: [],
            comments: [],
            createdAt: new Date()
        });

        // Update legacy/service layer if needed (SmartContractService now uses MongoDB,
        // but if it had cache logic, we call it here)
        // Note: SmartContractService.addFeedItem was refactored to do nothing or compatible logic.

        console.log("Video saved to MongoDB and R2 successfully");

        return NextResponse.json({
            success: true,
            url: publicUrl,
            public_id: key,
            resource_type: resourceType
        });

    } catch (dbError) {
        console.error("Failed to save video to MongoDB:", dbError);
        return NextResponse.json({ success: false, error: "Database save failed" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
