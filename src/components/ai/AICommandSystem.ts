export type AIMode = 'CORE' | 'CREATIVE' | 'TRADER' | 'GUARDIAN';

export type AIAction =
  | { type: 'NAVIGATE', payload: string }
  | { type: 'TOAST', payload: string }
  | { type: 'SHOW_USERS', payload: {id: string, username: string, role: string}[] }
  | { type: 'SHOW_TRENDS', payload: {id: string, title: string, views: string}[] }
  | { type: 'SHOW_WEB_RESULTS', payload: {title: string, snippet: string, url: string}[] }
  | { type: 'SHOW_CRYPTO_DATA', payload: {symbol: string, price: string, change: string, trend: 'up' | 'down'} }
  | { type: 'SHOW_GENERATED_IMAGE', payload: { prompt: string, url: string } }
  | { type: 'SET_MODE', payload: AIMode }
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

export function parseCommand(input: string, context: string = 'home', currentMode: AIMode = 'CORE'): { response: string, action: AIAction } {
    const lower = input.toLowerCase();

    // --- Mode Switching ---
    if (lower.includes("creative mode") || lower.includes("artist mode") || lower.includes("design mode")) {
        return { response: "Activating CREATIVE Engine. Let's imagine the impossible.", action: { type: 'SET_MODE', payload: 'CREATIVE' } };
    }
    if (lower.includes("trader mode") || lower.includes("finance mode") || lower.includes("market mode")) {
        return { response: "Engaging TRADER Protocols. Analyzing markets.", action: { type: 'SET_MODE', payload: 'TRADER' } };
    }
    if (lower.includes("guardian mode") || lower.includes("security mode") || lower.includes("defense mode")) {
        return { response: "GUARDIAN Shield Online. Protecting your assets.", action: { type: 'SET_MODE', payload: 'GUARDIAN' } };
    }
    if (lower.includes("reset") || lower.includes("normal mode") || lower.includes("core mode") || lower.includes("system mode")) {
        return { response: "Restoring CORE Systems.", action: { type: 'SET_MODE', payload: 'CORE' } };
    }

    // --- Generative AI (Images) ---
    if (lower.includes("draw") || lower.includes("generate") || lower.includes("paint") || lower.includes("image of") || lower.includes("picture of")) {
        const prompt = input.replace(/draw|generate|paint|image of|picture of|an|a/gi, "").trim();
        const prefix = currentMode === 'CREATIVE' ? "Unleashing artistic algorithms for" : "Manifesting visual data for";
        return {
            response: `${prefix} "${prompt}"...`,
            action: {
                type: 'SHOW_GENERATED_IMAGE',
                payload: {
                    prompt: prompt,
                    url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`
                }
            }
        };
    }

    // --- Web3 Intelligence (Crypto Data) ---
    if (lower.includes("price") || lower.includes("market") || lower.includes("coin") || lower.includes("value") || lower.includes("btc") || lower.includes("eth")) {
        const coin = lower.includes("bitcoin") || lower.includes("btc") ? "BTC" :
                     lower.includes("eth") ? "ETH" :
                     lower.includes("sol") ? "SOL" : "Pi";

        const prices: Record<string, string> = { "BTC": "64,230", "ETH": "3,450", "Pi": "31.41", "SOL": "145" };
        const price = prices[coin] || "Unknown";

        const responseText = currentMode === 'TRADER'
            ? `Market analysis for ${coin}: Bullish divergence detected.`
            : `Accessing Web3 Oracles for ${coin}...`;

        return {
            response: responseText,
            action: {
                type: 'SHOW_CRYPTO_DATA',
                payload: {
                    symbol: coin,
                    price: price,
                    change: coin === 'Pi' ? '+314%' : '+2.4%',
                    trend: 'up'
                }
            }
        };
    }

    // --- Internet Search Simulation ---
    if (lower.includes("search") || lower.includes("google") || lower.includes("find info") || lower.includes("what is") || lower.includes("who is")) {
        const query = input.replace(/search|google|find info|what is|who is|for/gi, "").trim();
        return {
            response: `Searching the Decentralized Web for "${query}"...`,
            action: {
                type: 'SHOW_WEB_RESULTS',
                payload: [
                    { title: `${query} - Decentralized Wiki`, snippet: `Comprehensive information about ${query} stored on the blockchain.`, url: `dweb://${query.replace(/ /g, '_')}` },
                    { title: `Latest News on ${query}`, snippet: `Breaking updates and real-time analysis regarding ${query}.`, url: `news://${query.replace(/ /g, '-')}` },
                    { title: `${query} Community`, snippet: `Join the official community for ${query}.`, url: `pi://${query.replace(/ /g, '')}` }
                ]
            }
        }
    }

    // --- Social Discovery ("Connect Universe") ---
    if (lower.includes("friend") || lower.includes("people") || lower.includes("connect") || lower.includes("match") || lower.includes("who")) {
        return {
            response: "Scanning the Metaverse... Found these creators matching your vibe:",
            action: { type: 'SHOW_USERS', payload: MOCK_USERS }
        };
    }

    // --- Trends ---
    if (lower.includes("trend") || lower.includes("hot") || lower.includes("news") || lower.includes("viral")) {
        return {
            response: "Downloading universal data streams. Here is what's viral:",
            action: { type: 'SHOW_TRENDS', payload: MOCK_TRENDS }
        };
    }

    // --- Knowledge Base ---
    for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
        if (lower.includes(key)) {
            return { response: value, action: { type: 'NONE' } };
        }
    }

    // --- Context Aware Help ---
    if (lower.includes("help") || lower.includes("what can i do")) {
        if (context === 'wallet') return { response: "You are in the Wallet. I can help you 'Check Balance', 'Send Pi', or 'Review Transactions'.", action: { type: 'NONE' } };
        if (context === 'game') return { response: "You are in the Game Center. Try 'Play Clicker' or 'Check Leaderboard'.", action: { type: 'NONE' } };
        if (context === 'create') return { response: "In the Studio? I can 'Generate Script' or 'Start Live Stream'.", action: { type: 'NONE' } };
        if (context === 'profile') return { response: "Viewing Profile. Ask me to 'Edit Profile' or 'Change Theme'.", action: { type: 'NONE' } };
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
        return { response: "Greetings! I am CONNECT Super AI. I am connected to the Web3 Universe. Try 'Generate image of Pi City' or 'Price of BTC'.", action: { type: 'NONE' } };
    }
    if (lower.includes("sing")) {
        return { response: "🎶 Computing harmony... across the galaxy... 🎶", action: { type: 'TOAST', payload: 'AI is singing...' } };
    }

    // Default
    const defaultResponses: Record<AIMode, string> = {
        'CORE': "I am online. Command me to Generate Images, Search, Navigate, or Analyze Data.",
        'CREATIVE': "My imagination is limitless. What shall we create together?",
        'TRADER': "Market data streams are active. Query for price or trends.",
        'GUARDIAN': "Systems secure. Standing by for instructions."
    };
    return { response: defaultResponses[currentMode], action: { type: 'NONE' } };
}
