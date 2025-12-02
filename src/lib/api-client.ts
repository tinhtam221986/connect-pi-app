export const apiClient = {
    getUser: async (uid: string) => {
        try {
            const res = await fetch(`/api/auth/user?uid=${uid}`);
            if (!res.ok) throw new Error("Failed to fetch user");
            return await res.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    updateUser: async (uid: string, data: any) => {
        try {
            const res = await fetch(`/api/auth/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, data })
            });
            if (!res.ok) throw new Error("Failed to update user");
            return await res.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
