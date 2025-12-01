export type AIAction =
  | { type: 'NAVIGATE', payload: string }
  | { type: 'TOAST', payload: string }
  | { type: 'SHOW_USERS', payload: {id: string, username: string, role: string}[] }
  | { type: 'SHOW_TRENDS', payload: {id: string, title: string, views: string}[] }
  | { type: 'NONE' };

const KNOWLEDGE_BASE: Record<string, string> = {
    "pi": "Pi Network is the first digital currency you can mine on your phone. CONNECT integrates with Pi for secure transactions and identity.",
    "web3": "Web3 empowers you with ownership. On CONNECT, your content and items belong to you.",
    "connect": "CONNECT is a decentralized Super App combining Social Video, GameFi, and Marketplace in one ecosystem.",
    "level": "Increase your Level by being active. High levels unlock the Gold Frame and higher earning rates.",
    "kyc": "KYC ensures a real-human ecosystem. Connect your Pi Wallet to verify.",
    "wallet": "Your Wallet holds Pi coins and digital assets. It is non-custodial and secure.",
};

const MOCK_USERS = [
    { id: 'u1', username: 'Pi_Whale_99', role: 'Investor' },
    { id: 'u2', username: 'Art_By_Alice', role: 'Creator' },
    { id: 'u3', username: 'GameMaster_X', role: 'Gamer' },
];

const MOCK_TRENDS = [
    { id: 't1', title: '#PiHackathon2024', views: '2.5M Views' },
    { id: 't2', title: '#CONNECT_Launch', views: '1.2M Views' },
    { id: 't3', title: '#BitcoinHalving', views: '800K Views' },
];

export function parseCommand(input: string): { response: string, action: AIAction } {
    const lower = input.toLowerCase();

    // --- Social Discovery ("Connect Universe") ---
    if (lower.includes("friend") || lower.includes("people") || lower.includes("connect") || lower.includes("match") || lower.includes("who")) {
        return {
            response: "Analyzing the Universe... I found these creators matching your interests:",
            action: { type: 'SHOW_USERS', payload: MOCK_USERS }
        };
    }

    // --- Trends ---
    if (lower.includes("trend") || lower.includes("hot") || lower.includes("news") || lower.includes("viral")) {
        return {
            response: "Scanning the data streams. Here are the hottest topics right now:",
            action: { type: 'SHOW_TRENDS', payload: MOCK_TRENDS }
        };
    }

    // --- Knowledge Base ---
    for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
        if (lower.includes(key)) {
            return { response: value, action: { type: 'NONE' } };
        }
    }

    // --- Navigation ---
    if (lower.includes("game") || lower.includes("play") || lower.includes("mining")) {
        return { response: "Warping to Game Center! 🚀", action: { type: 'NAVIGATE', payload: 'game' } };
    }
    if (lower.includes("wallet") || lower.includes("balance") || lower.includes("money")) {
        return { response: "Accessing Secure Wallet.", action: { type: 'NAVIGATE', payload: 'wallet' } };
    }
    if (lower.includes("shop") || lower.includes("store") || lower.includes("buy")) {
        return { response: "Opening Marketplace.", action: { type: 'NAVIGATE', payload: 'game' } };
    }
    if (lower.includes("create") || lower.includes("video") || lower.includes("upload") || lower.includes("studio")) {
        return { response: "Initializing AI Content Studio.", action: { type: 'NAVIGATE', payload: 'create' } };
    }
    if (lower.includes("live") || lower.includes("stream")) {
        return { response: "Preparing Live Stream uplink.", action: { type: 'NAVIGATE', payload: 'create' } };
    }
    if (lower.includes("home") || lower.includes("feed") || lower.includes("watch")) {
        return { response: "Returning to the Main Feed.", action: { type: 'NAVIGATE', payload: 'home' } };
    }
    if (lower.includes("profile") || lower.includes("me") || lower.includes("settings")) {
        return { response: "Opening User Profile.", action: { type: 'NAVIGATE', payload: 'profile' } };
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        return { response: "Greetings! I am CONNECT AI, your guide to the Web3 Universe. How can I assist?", action: { type: 'NONE' } };
    }
    if (lower.includes("sing")) {
        return { response: "🎶 Coding logic... in the key of Pi... 🎶", action: { type: 'TOAST', payload: 'AI is singing...' } };
    }

    // Default
    return { response: "I am ready. Ask me to find friends, show trends, or navigate the app.", action: { type: 'NONE' } };
}
