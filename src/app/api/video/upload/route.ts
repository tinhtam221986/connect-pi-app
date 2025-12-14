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

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `videos/${username || 'anon'}/${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    // Convert to buffer/stream
    // @aws-sdk/lib-storage accepts Web ReadableStream directly
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

    // --- SAVE TO MONGODB ---
    try {
        await connectDB();

        await Video.create({
            videoUrl: fileUrl,
            caption: description || "",
            privacy: privacy || 'public',
            author: {
                username: username || "Anonymous",
                user_uid: `user_${username || 'anon'}`,
                avatar: ""
            },
            // Note: R2 upload doesn't return metadata like Cloudinary (duration, etc.)
            // We would need a Lambda or client-side extraction for that.
            // Saving defaults for now.
            metadata: {
                duration: 0,
                width: 0,
                height: 0,
                fileSize: file.size,
                format: file.type
            },
            deviceSignature: deviceSignature || "unknown",
            likes: [],
            comments: [],
            createdAt: new Date()
        });
    } catch (dbError) {
        console.error("Failed to save video to MongoDB:", dbError);
    }

    // Save metadata to persistent DB (Legacy/Backup)
    await SmartContractService.addFeedItem({
        id: filename,
        url: fileUrl,
        thumbnail: fileUrl, // Video thumbnail generation needs processing service
        description: description || "No description",
        username: username || "Anonymous",
        likes: 0,
        comments: 0,
        resource_type: file.type.startsWith('video') ? 'video' : 'image',
        created_at: new Date().toISOString(),
        hashtags: hashtags ? JSON.parse(hashtags) : [],
        privacy: privacy || 'public'
    });

    return NextResponse.json({ 
        success: true,
        url: fileUrl,
        public_id: filename,
        resource_type: file.type.startsWith('video') ? 'video' : 'image'
    });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
