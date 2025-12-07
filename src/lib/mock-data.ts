export const MOCK_USERS = [
    {
        id: "user_1",
        username: "CryptoQueen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoQueen",
        level: 42,
        reputation: "Diamond",
        followers: "12.5k",
        bio: "Web3 content creator. Love Pi Network! 🚀"
    },
    {
        id: "user_2",
        username: "PiDeveloper",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PiDeveloper",
        level: 15,
        reputation: "Gold",
        followers: "3.2k",
        bio: "Building the future of social."
    },
    {
        id: "user_3",
        username: "TravelWithMe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TravelWithMe",
        level: 28,
        reputation: "Platinum",
        followers: "8.9k",
        bio: "Exploring the world on Pi."
    }
];

export const MOCK_VIDEOS = [
    // VI
    {
        id: "vid_1_vi",
        language: "vi",
        user: MOCK_USERS[0],
        description: "Trải nghiệm ứng dụng CONNECT mới trên Pi Network! Tuyệt vời quá! 🚀 #PiNetwork #Web3",
        likes: 1205,
        comments: 45,
        shares: 12,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
        thumbnail: "bg-purple-900" 
    },
    {
        id: "vid_2_vi",
        language: "vi",
        user: MOCK_USERS[2],
        description: "Hoàng hôn tuyệt đẹp tại Bali. Chuyến đi này được tài trợ bởi Pi! 🌅",
        likes: 8500,
        comments: 342,
        shares: 150,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
        thumbnail: "bg-blue-900"
    },
    {
        id: "vid_3_vi",
        language: "vi",
        user: MOCK_USERS[1],
        description: "Đang code tính năng mới cho CONNECT. Mọi người chờ nhé! 💻",
        likes: 560,
        comments: 23,
        shares: 5,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
        thumbnail: "bg-gray-900"
    },
    // EN
    {
        id: "vid_1_en",
        language: "en",
        user: MOCK_USERS[0],
        description: "Checking out the new CONNECT app on Pi Network! Amazing! 🚀 #PiNetwork #Web3",
        likes: 1205,
        comments: 45,
        shares: 12,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
        thumbnail: "bg-purple-900" 
    },
    {
        id: "vid_2_en",
        language: "en",
        user: MOCK_USERS[2],
        description: "Beautiful sunset in Bali. Funded by Pi! 🌅",
        likes: 8500,
        comments: 342,
        shares: 150,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
        thumbnail: "bg-blue-900"
    },
    {
        id: "vid_3_en",
        language: "en",
        user: MOCK_USERS[1],
        description: "Coding new features for CONNECT. Stay tuned! 💻",
        likes: 560,
        comments: 23,
        shares: 5,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
        thumbnail: "bg-gray-900"
    }
];

export const MOCK_PRODUCTS = [
    { id: "p1_vi", name: "Giao diện Premium", price: 50, currency: "Pi", image: "🎨", seller: "ThemeMaster", language: "vi" },
    { id: "p2_vi", name: "Avatar 3D Độc quyền", price: 100, currency: "Pi", image: "👾", seller: "CryptoQueen", language: "vi" },
    { id: "p1_en", name: "Premium Theme", price: 50, currency: "Pi", image: "🎨", seller: "ThemeMaster", language: "en" },
    { id: "p2_en", name: "Exclusive 3D Avatar", price: 100, currency: "Pi", image: "👾", seller: "CryptoQueen", language: "en" }
];

export const AI_RESPONSES = {
    vi: [
        "Tôi có thể giúp bạn chỉnh sửa video này! Bạn có muốn thêm bộ lọc không?",
        "Ý tưởng tuyệt vời! Các thẻ hashtag xu hướng hôm nay là #PiNetwork và #Web3.",
        "Tương tác của bạn đã tăng 20% trong tuần này! Hãy tiếp tục phát huy!",
        "Tôi phát hiện nội dung này có thể vi phạm chính sách cộng đồng. Đang xem xét."
    ],
    en: [
        "I can help you edit this video! Would you like to add filters?",
        "Great idea! Trending hashtags today are #PiNetwork and #Web3.",
        "Your engagement is up 20% this week! Keep it up!",
        "I detected a potential policy violation in this content. Reviewing now."
    ]
};
