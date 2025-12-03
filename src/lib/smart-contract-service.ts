import fs from 'fs';
import path from 'path';

const CHAIN_STATE_FILE = path.join(process.cwd(), 'src/lib/mock-chain-state.json');

// Interface for Chain State
interface ChainState {
  balances: Record<string, number>;
  nfts: Record<string, any[]>;
  listings: any[];
  gamePlayers: Record<string, any>;
}

// Helper to read state
function readState(): ChainState {
  try {
    if (!fs.existsSync(CHAIN_STATE_FILE)) {
      return { balances: {}, nfts: {}, listings: [], gamePlayers: {} };
    }
    const data = fs.readFileSync(CHAIN_STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read chain state:", error);
    return { balances: {}, nfts: {}, listings: [], gamePlayers: {} };
  }
}

// Helper to write state
function writeState(state: ChainState) {
  try {
    fs.writeFileSync(CHAIN_STATE_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error("Failed to write chain state:", error);
  }
}

export const SmartContractService = {
  // Token
  getBalance: (address: string) => {
    const state = readState();
    return {
        piBalance: 1000, // Mock Pi Network balance (since we can't read real mainnet wallet easily)
        tokenBalance: state.balances[address] || 0, // Connect Token
        nfts: state.nfts[address] || []
    };
  },
  mintToken: (address: string, amount: number) => {
    const state = readState();
    state.balances[address] = (state.balances[address] || 0) + amount;
    writeState(state);
    return state.balances[address];
  },

  // Marketplace
  getListings: () => {
    const state = readState();
    // Return sample listings if empty for demo
    if (!state.listings || state.listings.length === 0) {
        return [
            { id: "1", name: "Cyber Pet #001", price: 100, seller: "0x123...", category: "PET", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
            { id: "2", name: "Golden Ticket", price: 500, seller: "0x456...", category: "ITEM", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Ticket" },
            { id: "3", name: "Energy Pack", price: 50, seller: "System", category: "CONSUMABLE", imageUrl: "https://api.dicebear.com/7.x/icons/svg?seed=Energy" }
        ];
    }
    return state.listings;
  },
  createListing: (listing: any) => {
    const state = readState();
    const newListing = { ...listing, id: Date.now().toString() };
    if (!state.listings) state.listings = [];
    state.listings.push(newListing);
    writeState(state);
    return newListing;
  },
  
  // This is called AFTER successful payment
  purchaseListing: (itemId: string, buyerId: string) => {
      const state = readState();
      if (!state.listings) return { success: false, error: "No listings" };

      const listingIndex = state.listings.findIndex((l: any) => l.id === itemId);
      
      // If item not found in listings, it might be a system item (infinite stock) or already sold
      // For demo, we just allow "buying" system items if they are static
      if (listingIndex === -1) {
          // Check if it was one of our static defaults
          if (["1","2","3"].includes(itemId)) {
               const staticItems = [
                    { id: "1", name: "Cyber Pet #001", price: 100, seller: "0x123...", category: "PET", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
                    { id: "2", name: "Golden Ticket", price: 500, seller: "0x456...", category: "ITEM", imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Ticket" },
                    { id: "3", name: "Energy Pack", price: 50, seller: "System", category: "CONSUMABLE", imageUrl: "https://api.dicebear.com/7.x/icons/svg?seed=Energy" }
               ];
               const item = staticItems.find(i => i.id === itemId);
               if (item) {
                   if (!state.nfts[buyerId]) state.nfts[buyerId] = [];
                   state.nfts[buyerId].push(item);
                   writeState(state);
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

      writeState(state);
      return { success: true, item: listing };
  },

  // GameFi
  getGameState: (userId: string) => {
      const state = readState();
      if (!state.gamePlayers) state.gamePlayers = {};
      return state.gamePlayers[userId] || { score: 0, level: 1, exp: 0, battlesWon: 0, energy: 100 };
  },
  
  updateGameState: (userId: string, action: string, data: any) => {
      const state = readState();
      if (!state.gamePlayers) state.gamePlayers = {};
      
      const current = state.gamePlayers[userId] || { score: 0, level: 1, exp: 0, battlesWon: 0, energy: 100 };
      
      // Simple Game Logic
      if (action === 'click') {
          current.score += (data.points || 1);
          // current.energy -= 1; // Handled client side for responsiveness, but validated here
      }
      
      state.gamePlayers[userId] = current;
      writeState(state);
      return state.gamePlayers[userId];
  }
};
