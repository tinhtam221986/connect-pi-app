export const aiService = {
    /**
     * Generates text response using LLM
     */
    generateText: async (prompt: string, context?: string): Promise<string> => {
        // Simulate thinking
        await new Promise(r => setTimeout(r, 1000));

        // In production, call OpenAI/Anthropic API
        // const res = await fetch('https://api.openai.com/v1/chat/completions', ...);

        return `[AI Analysis]: I have processed "${prompt}" in the context of ${context || 'general'}. Here are my insights...`;
    },

    /**
     * Generates an image using Stable Diffusion / DALL-E
     */
    generateImage: async (prompt: string): Promise<string> => {
        // Use Pollinations for free generation without key
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;
    }
}
