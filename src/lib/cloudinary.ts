
import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary is configured via Env Vars
export const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dv1hnl0wo', // Fallback from screenshot
  api_key: process.env.CLOUDINARY_API_KEY || '727564581351668',  // Fallback from screenshot
  api_secret: process.env.CLOUDINARY_API_SECRET, // Must be provided via Env Var
});

export const uploadToCloudinary = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using a stream
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Adjust based on file type if needed
          folder: 'connect-pi-uploads',
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            reject(error);
          } else {
            resolve(result?.secure_url || '');
          }
        }
      );

      // Write buffer to stream
      const Readable = require('stream').Readable;
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });

  } catch (error) {
    console.error("Cloudinary upload wrapper failed:", error);
    throw error;
  }
};
