export const MOCK_USERS = [
    {
        id: "user_1",
        username: "CryptoQueen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoQueen",
        level: 42,
        reputation: "Diamond",
        followers: "12.5k",
        bio: "Web3 content creator. Love Pi Network!"
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
    {
        id: "vid_1",
        user: MOCK_USERS[0],
        description: "Checking out the new Pi CONNECT app! 🚀 #PiNetwork #Web3",
        likes: 1205,
        comments: 45,
        shares: 12,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
        thumbnail: "bg-purple-900" 
    },
    {
        id: "vid_2",
        user: MOCK_USERS[2],
        description: "Amazing sunset in Bali. Paid for this trip with Pi! 🌅",
        likes: 8500,
        comments: 342,
        shares: 150,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
        thumbnail: "bg-blue-900"
    },
    {
        id: "vid_3",
        user: MOCK_USERS[1],
        description: "Coding session. Building the next big thing. 💻",
        likes: 560,
        comments: 23,
        shares: 5,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
        thumbnail: "bg-gray-900"
    }
];

export const MOCK_PRODUCTS = [
    {
        id: "prod_1",
        name: "Connect Premium Theme",
        price: 50,
        currency: "Pi",
        image: "🎨",
        seller: "ThemeMaster"
    },
    {
        id: "prod_2",
        name: "Exclusive 3D Avatar",
        price: 100,
        currency: "Pi",
        image: "👾",
        seller: "CryptoQueen"
    },
    {
        id: "prod_3",
        name: "Verified Badge Service",
        price: 500,
        currency: "Pi",
        image: "✅",
        seller: "ConnectOfficial"
    }
];

export const AI_RESPONSES = [
    "I can help you edit this video! Would you like to add some filters?",
    "That's a great idea for a post. Trending hashtags today are #PiNetwork and #Web3.",
    "Your engagement is up 20% this week! Keep it up!",
    "I found a violation in this comment. It has been flagged for review."
];
