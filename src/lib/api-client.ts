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
    upload: async (file: File, metadata?: { username?: string; description?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (metadata?.username) formData.append('username', metadata.username);
      if (metadata?.description) formData.append('description', metadata.description);

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
