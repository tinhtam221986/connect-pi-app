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
    uploadAvatar: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      // We reuse the video upload endpoint but it might need adjustment if we want specific image handling
      // For now, let's assume we use a dedicated or flexible endpoint.
      // Actually, let's use the same pattern but point to a new generic upload or reuse existing if capable.
      // To be safe and clean, let's add a `type` field to the upload endpoint or just use `updateProfile` with formData if supported?
      // No, `updateProfile` expects JSON.

      // Let's create a specific upload endpoint later, or use the video one with a flag?
      // The video upload endpoint strictly expects video logic (thumbnails etc).
      // We should use a new endpoint `api/upload/image` or similar.
      // Or just client-side for now? No, we want to hide keys.

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      return res.json();
    }
  },
  video: {
    // Updated signature to accept any metadata fields including deviceSignature
    upload: async (file: File, metadata?: { username?: string; description?: string; deviceSignature?: string; hashtags?: string; privacy?: string }) => {
      const formData = new FormData();
      formData.append('file', file);

      // Dynamic append for all metadata fields
      if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                  formData.append(key, String(value));
              }
          });
      }

      const res = await fetch('/api/video/upload', {
        method: 'POST',
        body: formData,
      });
      return res.json();
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
