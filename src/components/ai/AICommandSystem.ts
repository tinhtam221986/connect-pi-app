export type AIAction =
  | { type: 'NAVIGATE', payload: string }
  | { type: 'TOAST', payload: string }
  | { type: 'NONE' };

export function parseCommand(input: string): { response: string, action: AIAction } {
    const lower = input.toLowerCase();

    if (lower.includes("game") || lower.includes("play") || lower.includes("mining")) {
        return { response: "Opening Game Center! Let's earn some Pi.", action: { type: 'NAVIGATE', payload: 'game' } };
    }
    if (lower.includes("wallet") || lower.includes("balance") || lower.includes("money") || lower.includes("pi")) {
        return { response: "Checking your wallet securely.", action: { type: 'NAVIGATE', payload: 'wallet' } };
    }
    if (lower.includes("shop") || lower.includes("store") || lower.includes("buy")) {
        return { response: "Heading to the Marketplace.", action: { type: 'NAVIGATE', payload: 'game' } }; // Marketplace is in Game/Wallet currently
    }
    if (lower.includes("create") || lower.includes("video") || lower.includes("upload") || lower.includes("script")) {
        return { response: "Let's create something amazing in the AI Studio!", action: { type: 'NAVIGATE', payload: 'create' } };
    }
    if (lower.includes("live") || lower.includes("stream")) {
        return { response: "Going live? I'll take you to the studio.", action: { type: 'NAVIGATE', payload: 'create' } };
    }
    if (lower.includes("home") || lower.includes("feed") || lower.includes("watch")) {
        return { response: "Back to the video feed.", action: { type: 'NAVIGATE', payload: 'home' } };
    }
    if (lower.includes("profile") || lower.includes("me") || lower.includes("settings")) {
        return { response: "Opening your profile.", action: { type: 'NAVIGATE', payload: 'profile' } };
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        return { response: "Hello! I am CONNECT AI. I can guide you through the Pi Universe. Try saying 'Go to Games' or 'Check Wallet'.", action: { type: 'NONE' } };
    }
    if (lower.includes("sing")) {
        return { response: "🎶 La la la! I'm better at coding than singing.", action: { type: 'TOAST', payload: 'AI is singing...' } };
    }

    // Default mock response
    return { response: "I'm listening. You can ask me to navigate or explain features.", action: { type: 'NONE' } };
}
