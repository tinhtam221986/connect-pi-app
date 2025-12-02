
export const mockDb = {
    users: [
        {
            id: "user_1",
            username: "CryptoQueen",
            avatar: "https://placehold.co/100x100/purple/white?text=CQ",
            wallet: 100,
            videos: []
        },
        {
            id: "user_2",
            username: "PiDeveloper",
            avatar: "https://placehold.co/100x100/green/white?text=PD",
            wallet: 250,
            videos: []
        },
        {
            id: "currentUser",
            username: "You",
            avatar: "https://placehold.co/100x100/blue/white?text=You",
            wallet: 50,
            videos: []
        }
    ],
    videos: [
        {
            id: "1",
            user: { username: "Alice_Crypto", avatar: "https://placehold.co/100x100/purple/white?text=A" },
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            description: "Building on Pi Network is amazing! #PiNetwork #Web3",
            likes: 1200,
            comments: 45,
            shares: 12,
            language: "en"
        },
        {
            id: "2",
            user: { username: "Minh_Pi", avatar: "https://placehold.co/100x100/green/white?text=M" },
            videoUrl: "https://www.w3schools.com/html/movie.mp4",
            description: "Hướng dẫn KYC Pi Network mới nhất 2024. #PiKYC #VietNam",
            likes: 3400,
            comments: 120,
            shares: 300,
            language: "vi"
        },
        {
            id: "3",
            user: { username: "Connect_Official", avatar: "https://placehold.co/100x100/blue/white?text=C" },
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            description: "Welcome to CONNECT - The future of SocialFi on Pi. #Connect #SocialFi",
            likes: 10000,
            comments: 999,
            shares: 5000,
            language: "en"
        }
    ]
};

// Helper methods to simulate persistence
const globalForDb = global as unknown as { mockDb: typeof mockDb };

export const db = globalForDb.mockDb || mockDb;

if (process.env.NODE_ENV !== 'production') globalForDb.mockDb = db;
