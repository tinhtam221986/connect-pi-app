export const apiClient = {
  auth: {
    verify: async (accessToken: string) => {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });
      return res.json();
    },
  },
  user: {
    getProfile: async (username?: string) => {
      const url = username ? `/api/user/profile?username=${username}` : '/api/user/profile';
      const res = await fetch(url);
      return res.json();
    },
    updateProfile: async (data: any) => {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },
  video: {
    getPresignedUrl: async (filename: string, contentType: string, username?: string, timeout: number = 30000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const res = await fetch('/api/video/presigned', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename, contentType, username }),
                signal: controller.signal
            });
            clearTimeout(id);
            return res.json();
        } catch (error: any) {
            clearTimeout(id);
            if (error.name === 'AbortError') {
                throw new Error('Request timed out (30s)');
            }
            throw error;
        }
    },

    uploadToR2: async (url: string, file: File, onProgress?: (percent: number) => void, timeout: number = 120000): Promise<void> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.timeout = timeout;

            // Important: Set Content-Type. Android might give empty string for file.type
            const contentType = file.type || 'video/mp4';
            xhr.setRequestHeader('Content-Type', contentType);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable && onProgress) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    onProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}. Response: ${xhr.responseText}`));
                }
            };

            xhr.onerror = () => {
                // Try to get more info if possible (though usually empty on Status 0)
                const errorDetails = `Status: ${xhr.status}`;
                reject(new Error(`Network error during upload (CORS or Connectivity). ${errorDetails}. Check R2 CORS config and Vercel Credentials.`));
            };

            xhr.ontimeout = () => {
                reject(new Error(`Upload timed out after ${timeout / 1000}s`));
            };

            xhr.send(file);
        });
    },

    finalizeUpload: async (data: { key: string; username?: string; description?: string; deviceSignature?: string; hashtags?: string; privacy?: string, metadata?: any }, timeout: number = 60000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const res = await fetch('/api/video/finalize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                signal: controller.signal
            });
            clearTimeout(id);
            return res.json();
        } catch (error: any) {
             clearTimeout(id);
             if (error.name === 'AbortError') {
                 throw new Error('Request timed out (60s)');
             }
             throw error;
        }
    },

    // Legacy wrapper or refactor target
    upload: async (file: File, metadata?: { username?: string; description?: string; deviceSignature?: string; hashtags?: string; privacy?: string }, onProgress?: (percent: number) => void) => {
        // 1. Get Presigned URL
        const contentType = file.type || 'video/mp4';
        const presignedRes = await apiClient.video.getPresignedUrl(file.name, contentType, metadata?.username);
        if (!presignedRes.url) throw new Error(presignedRes.error || "Failed to get upload URL");

        // 2. Upload to R2
        await apiClient.video.uploadToR2(presignedRes.url, file, onProgress);

        // 3. Finalize
        return apiClient.video.finalizeUpload({
            key: presignedRes.key,
            ...metadata,
            metadata: { size: file.size, type: file.type }
        });
    },
  },
  ai: {
    generate: async (prompt: string, type: 'script' | 'image') => {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type }),
      });
      return res.json();
    },
  },
  game: {
    getState: async (userId?: string) => {
      const url = userId ? `/api/game/state?userId=${userId}` : '/api/game/state';
      const res = await fetch(url);
      return res.json();
    },
    action: async (action: string, data?: any) => {
      const res = await fetch('/api/game/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user_current', action, data }),
      });
      return res.json();
    },
    breed: async (userId: string, materialIds: string[]) => {
      const res = await fetch('/api/game/breed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, materialIds }),
      });
      return res.json();
    }
  },
  feed: {
    get: async () => {
      const res = await fetch('/api/feed');
      return res.json();
    }
  },
  market: {
    getListings: async () => {
      const res = await fetch('/api/marketplace/listings');
      return res.json();
    },
    buy: async (itemId: string) => {
        const res = await fetch('/api/marketplace/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId })
        });
        return res.json();
    }
  },
  payment: {
    approve: async (paymentId: string) => {
      const res = await fetch("/api/payment/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId })
      });
      return res.json();
    },
    complete: async (paymentId: string, txid: string, paymentData?: any) => {
      const res = await fetch("/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, txid, paymentData })
      });
      return res.json();
    }
  }
};
