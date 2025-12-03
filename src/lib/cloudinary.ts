import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = () => {
    return !!(CLOUD_NAME && API_KEY && API_SECRET);
};

if (isCloudinaryConfigured()) {
    cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: API_KEY,
        api_secret: API_SECRET,
    });
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!isCloudinaryConfigured()) {
        throw new Error("Cloudinary not configured");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'video',
                folder: 'connect-pi-app',
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    resolve(result?.secure_url || "");
                }
            }
        );
        uploadStream.end(buffer);
    });
};
