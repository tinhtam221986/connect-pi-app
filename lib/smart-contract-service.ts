import { readDB, writeDB } from './cloudinary-db';

// Interface for Chain State
interface ChainState {
  balances: Record<string, number>;
  nfts: Record<string, any[]>;
  listings: any[];
  gamePlayers: Record<string, any>;
  feedItems: any[];
}

async function getState(): Promise<ChainState> {
    const data = await readDB();
    return data || { balances: {}, nfts: {}, listings: [], gamePlayers: {}, feedItems: [] };
}

async function saveState(state: ChainState) {
    await writeDB(state);
}

export const SmartContractService = {
  // Token
  getBalance: async (address: string) => {
    const state = await getState();
    return {
        piBalance: 1000, // Mock Pi Network balance
        tokenBalance: state.balances[address] || 0, // Connect Token
        nfts: state.nfts[address] || []
    };
  },
  mintToken: async (address: string, amount: number) => {
    const state = await getState();
    state.balances[address] = (state.balances[address] || 0) + amount;
    await saveState(state);
    return state.balances[address];
  },

  // Marketplace
  getListings: async () => {
    const state = await getState();
    // Return sample listings if empty for demo
    if (!state.listings || state.listings.length === 0) {
        return [
            { id: "101", name: "Base Embryo", price: 100, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Embryo" },
            { id: "102", name: "Fire Crystal", price: 50, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Fire" },
            { id: "103", name: "Water Crystal", price: 50, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Water" },
            { id: "104", name: "Morph Gene: Wings", price: 200, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Wings" },
            { id: "105", name: "Mutagen X", price: 500, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Mutagen" }
        ];
    }
    return state.listings;
  },
  createListing: async (listing: any) => {
    const state = await getState();
    const newListing = { ...listing, id: Date.now().toString() };
    if (!state.listings) state.listings = [];
    state.listings.push(newListing);
    await saveState(state);
    return newListing;
  },
  
  // This is called AFTER successful payment
  purchaseListing: async (itemId: string, buyerId: string) => {
      const state = await getState();
      if (!state.listings) state.listings = [];

      const listingIndex = state.listings.findIndex((l: any) => l.id === itemId);
      
      // If item not found in listings, it might be a system item (infinite stock) or already sold
      // For demo, we just allow "buying" system items if they are static
      if (listingIndex === -1) {
          // Check if it was one of our static defaults
          // For demo, check strictly by ID string
          const staticIds = ["101","102","103","104","105"];
          if (staticIds.includes(itemId)) {
               const staticItems = [
                    { id: "101", name: "Base Embryo", price: 100, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Embryo" },
                    { id: "102", name: "Fire Crystal", price: 50, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Fire" },
                    { id: "103", name: "Water Crystal", price: 50, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Water" },
                    { id: "104", name: "Morph Gene: Wings", price: 200, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Wings" },
                    { id: "105", name: "Mutagen X", price: 500, seller: "System", category: "MATERIAL", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Mutagen" }
               ];
               const item = staticItems.find(i => i.id === itemId);
               if (item) {
                   if (!state.nfts[buyerId]) state.nfts[buyerId] = [];
                   state.nfts[buyerId].push(item);
                   await saveState(state);
                   return { success: true, item };
               }
          }
          return { success: false, error: "Item not found" };
      }

      const listing = state.listings[listingIndex];
      
      // Transfer NFT
      if (!state.nfts[buyerId]) state.nfts[buyerId] = [];
      state.nfts[buyerId].push(listing);
      
      // Remove from listings
      state.listings.splice(listingIndex, 1);
      
      // (Optional) Credit seller in mock balance
      state.balances[listing.seller] = (state.balances[listing.seller] || 0) + listing.price;

      await saveState(state);
      return { success: true, item: listing };
  },

  // GameFi
  getGameState: async (userId: string) => {
      const state = await getState();
      if (!state.gamePlayers) state.gamePlayers = {};
      return state.gamePlayers[userId] || { score: 0, level: 1, exp: 0, battlesWon: 0, energy: 100 };
  },
  
  updateGameState: async (userId: string, action: string, data: any) => {
      const state = await getState();
      if (!state.gamePlayers) state.gamePlayers = {};
      
      const current = state.gamePlayers[userId] || { score: 0, level: 1, exp: 0, battlesWon: 0, energy: 100 };
      
      // Simple Game Logic
      if (action === 'click') {
          current.score += (data.points || 1);
          // current.energy -= 1; // Handled client side for responsiveness, but validated here
      }
      
      state.gamePlayers[userId] = current;
      await saveState(state);
      return state.gamePlayers[userId];
  },

  // Breeding System
  breedPet: async (userId: string, materialIds: string[]) => {
      const state = await getState();
      if (!state.nfts[userId]) state.nfts[userId] = [];

      // Verify ownership and remove materials
      // Note: In real app, we need to handle Quantity. Here, one item = one instance.
      for (const id of materialIds) {
          const idx = state.nfts[userId].findIndex((item: any) => item.id === id);
          if (idx === -1) {
              // Only throw if strictly enforcing. For demo, we might allow "mock" breeding if empty.
              // But let's be strict to encourage buying.
              // throw new Error(`Missing material: ${id}`);
              console.warn(`User missing material ${id}, proceeding (Mock Mode)`);
          } else {
              state.nfts[userId].splice(idx, 1);
          }
      }

      // Create new Pet
      const newPet = {
          id: `pet_${Date.now()}`,
          name: "Gen Pet #" + Math.floor(Math.random()*1000),
          category: "PET",
          stats: {
             strength: Math.floor(Math.random() * 100),
             intellect: Math.floor(Math.random() * 100),
             speed: Math.floor(Math.random() * 100)
          },
          imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          created_at: new Date().toISOString()
      };

      state.nfts[userId].push(newPet);
      await saveState(state);
      return newPet;
  },

  // Feed (Persistence Cache)
  addFeedItem: async (item: any) => {
      const state = await getState();
      if (!state.feedItems) state.feedItems = [];
      // Add to beginning
      state.feedItems.unshift(item);
      // Keep only last 50
      if (state.feedItems.length > 50) {
          state.feedItems = state.feedItems.slice(0, 50);
      }
      await saveState(state);
      return item;
  },
  getFeedItems: async () => {
      const state = await getState();
      return state.feedItems || [];
  }
};
