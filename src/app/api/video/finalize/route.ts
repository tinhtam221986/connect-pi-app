import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";
import { R2_PUBLIC_URL } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const { key, username, description, privacy, deviceSignature, hashtags, resourceType, metadata: fileMeta } = await request.json();

    if (!key) {
      return NextResponse.json({ success: false, error: "Missing file key" }, { status: 400 });
    }

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    await connectDB();

    const newVideo = await Video.create({
        videoUrl: publicUrl,
        caption: description || "",
        resourceType: resourceType || 'video',
        privacy: privacy || 'public',
        author: {
            username: username || "Anonymous",
            user_uid: `user_${username || 'anon'}`,
            avatar: ""
        },
        metadata: {
            duration: 0,
            width: 0,
            height: 0,
            fileSize: fileMeta?.size || 0,
            format: fileMeta?.type?.split('/')[1] || ""
        },
        deviceSignature: deviceSignature || "unknown",
        likes: [],
        comments: [],
        createdAt: new Date()
    });

    return NextResponse.json({
        success: true,
        url: publicUrl,
        public_id: key,
        resource_type: resourceType || 'video'
    });

  } catch (error: any) {
    console.error("Finalize Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
