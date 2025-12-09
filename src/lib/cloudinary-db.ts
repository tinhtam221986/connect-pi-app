import { v2 as cloudinary } from 'cloudinary';

// Ensure config is set
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DB_FILE_ID = "connect_chain_state.json";

export async function readDB(): Promise<any> {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.error("Cloudinary Cloud Name is missing!");
        return null;
    }

    try {
        // Construct the URL directly.
        // Note: For raw resources, it's /raw/upload/v<version>/<public_id> usually, or just /raw/upload/<public_id>
        // We skip version for the fetch url construction to keep it simple, but we might get cached version.
        // We append timestamp to query to bust browser/network cache.
        const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${DB_FILE_ID}`;

        console.log("Fetching DB from:", url);
        const res = await fetch(`${url}?t=${Date.now()}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (!res.ok) {
            if (res.status === 404) {
                console.log("DB file not found, initializing new.");
                return null;
            }
            throw new Error(`Failed to fetch DB: ${res.status} ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.warn("Cloudinary DB read warning:", error);
        return null;
    }
}

export async function writeDB(data: any): Promise<void> {
    // Convert data to Buffer
    const buffer = Buffer.from(JSON.stringify(data, null, 2));

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                public_id: DB_FILE_ID, // This will result in connect_chain_state.json
                overwrite: true,
                invalidate: true, // Invalidate CDN cache
                unique_filename: false // Ensure it uses the exact public_id
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary DB Write Error:", error);
                    reject(error);
                } else {
                    console.log("Cloudinary DB Saved:", result?.public_id);
                    resolve();
                }
            }
        );
        stream.end(buffer);
    });
}
