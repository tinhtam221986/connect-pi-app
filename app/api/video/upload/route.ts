import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { SmartContractService } from "@/lib/smart-contract-service";

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  // Check for missing Cloudinary keys
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Server Misconfiguration: Cloudinary keys are missing.");
      return NextResponse.json({
          success: false,
          error: "Cloudinary keys are missing in server environment. Please configure them in Vercel Settings."
      }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const username = formData.get("username") as string;
    const description = formData.get("description") as string;
    const hashtags = formData.get("hashtags") as string;
    const privacy = formData.get("privacy") as string;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "connect-pi-app", 
          resource_type: "auto",
          context: {
              username: username || 'Anonymous',
              caption: description || ''
          },
          tags: ['connect_video', `user_${username || 'anon'}`]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const resAny = result as any;
    // Save metadata to persistent DB
    await SmartContractService.addFeedItem({
        id: resAny.public_id,
        url: resAny.secure_url,
        thumbnail: resAny.resource_type === 'video'
            ? resAny.secure_url.replace(/\.[^/.]+$/, ".jpg")
            : resAny.secure_url,
        description: description || "No description",
        username: username || "Anonymous",
        likes: 0,
        comments: 0,
        resource_type: resAny.resource_type || 'image',
        created_at: new Date().toISOString(),
        hashtags: hashtags ? JSON.parse(hashtags) : [],
        privacy: privacy || 'public'
    });

    return NextResponse.json({ 
        success: true,
        url: resAny.secure_url,
        public_id: resAny.public_id,
        resource_type: resAny.resource_type
    });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
