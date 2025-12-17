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
    getPresignedUrl: async (filename: string, contentType: string, username?: string) => {
        const res = await fetch('/api/video/presigned', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, contentType, username })
        });
        return res.json();
    },

    uploadToR2: (url: string, file: File, onProgress?: (percent: number) => void): Promise<void> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.setRequestHeader('Content-Type', file.type);

            if (onProgress) {
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        onProgress(percent);
                    }
                };
            }

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.send(file);
        });
    },

    finalizeUpload: async (data: { key: string; username?: string; description?: string; deviceSignature?: string; hashtags?: string; privacy?: string, metadata?: any }) => {
        const res = await fetch('/api/video/finalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // Legacy wrapper or refactor target
    upload: async (file: File, metadata?: { username?: string; description?: string; deviceSignature?: string; hashtags?: string; privacy?: string }, onProgress?: (percent: number) => void) => {
        // 1. Get Presigned URL
        const presignedRes = await apiClient.video.getPresignedUrl(file.name, file.type, metadata?.username);
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
