export const storageService = {
    /**
     * Uploads a file to the configured storage provider (S3/Cloudflare/IPFS)
     * @param file The file blob to upload
     * @param path The destination path/key
     * @returns The public URL of the uploaded file
     */
    upload: async (file: Blob, path: string): Promise<string> => {
        console.log(`[Storage] Uploading ${file.size} bytes to ${path}...`);

        // Simulate upload delay
        await new Promise(r => setTimeout(r, 1500));

        // Return a mock URL for now
        return `https://cdn.connect-pi.network/uploads/${path}/${Date.now()}_video.webm`;
    }
}
