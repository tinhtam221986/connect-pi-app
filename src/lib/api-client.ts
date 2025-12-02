export const apiClient = {
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
    video: {
        upload: async (blob: Blob) => {
            const formData = new FormData();
            formData.append('file', blob, 'recording.webm');

            const res = await fetch(`/api/video/upload`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");
            return await res.json();
        }
    },
    user: {
        profile: async () => {
             // Mock
             return { username: "CurrentUser", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser" };
        }
    }
};
