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
  feed: {
      get: async (lang: string = 'en') => {
          try {
              const res = await fetch(`/api/feed?lang=${lang}`, { cache: 'no-store' });
              if (!res.ok) throw new Error("Failed to fetch feed");
              return await res.json();
          } catch (e) {
              console.error("Feed fetch error", e);
              return [];
          }
      },
      create: async (postData: any) => {
           const res = await fetch(`/api/feed`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(postData)
           });
           if (!res.ok) throw new Error("Failed to create post");
           return await res.json();
      }
  },
  user: {
    getProfile: async () => {
      const res = await fetch('/api/user/profile');
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
    upload: async (file: Blob | File) => {
      const formData = new FormData();
      formData.append('file', file);
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
    getState: async () => {
      const res = await fetch('/api/game/state');
      return res.json();
    },
    action: async (action: string, data?: any) => {
      const res = await fetch('/api/game/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
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
    complete: async (paymentId: string, txid: string) => {
      const res = await fetch("/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, txid })
      });
      return res.json();
    }
  }
};
