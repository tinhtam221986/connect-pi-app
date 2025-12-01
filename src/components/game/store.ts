import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Types ---

export type ElementType = 'metal' | 'wood' | 'water' | 'fire' | 'earth';

export type BodyPart = 'eyes' | 'ears' | 'horn' | 'mouth' | 'back' | 'tail';

export interface Gene {
  part: BodyPart;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  element: ElementType;
  statsBonus: {
    str: number;
    int: number;
    spd: number;
    vit: number;
  };
}

export interface Pet {
  id: string;
  name: string;
  element: ElementType;
  genes: Record<BodyPart, Gene>;
  stats: {
    str: number;
    int: number;
    spd: number;
    vit: number;
  };
  rarity: number; // calculated score
  createdAt: number;
  parents?: [string, string];
  wins: number;
  losses: number;
}

export type ItemType = 'embryo' | 'crystal' | 'morph' | 'mutagen';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  price: number;
  effect: any;
  element?: ElementType;
  image?: string;
}

export interface MarketListing {
    id: string;
    pet: Pet;
    sellerId: string; // 'player' or 'bot_name'
    price: number;
    createdAt: number;
}

export interface GameState {
  piBalance: number;
  inventory: Record<string, number>; // ItemID -> Quantity
  pets: Pet[];
  marketListings: MarketListing[];

  // Actions
  addPi: (amount: number) => void;
  buyItem: (itemId: string, cost: number) => boolean;
  createPet: (inputs: { embryoId: string; crystalId?: string; mutagenId?: string }) => Pet;

  // Market
  listPet: (petId: string, price: number) => void;
  buyPet: (listingId: string) => boolean;
  cancelListing: (listingId: string) => void;

  // Battle
  recordBattleResult: (petId: string, win: boolean, reward: number) => void;
}

// --- Constants ---

export const BREEDING_FEE = 50;
export const MARKET_TAX = 0.05;

// --- Mock Data ---

export const SHOP_ITEMS: Item[] = [
  { id: 'embryo_basic', name: 'Phôi Gốc', type: 'embryo', description: 'Nguyên liệu bắt buộc (Base Embryo)', price: 100, effect: {}, image: '🥚' },
  { id: 'crystal_fire', name: 'Tinh thể Lửa', type: 'crystal', description: '80% ra hệ Hỏa (Fire Crystal)', price: 50, element: 'fire', effect: { chance: 0.8, element: 'fire' }, image: '🔥' },
  { id: 'crystal_water', name: 'Tinh thể Thủy', type: 'crystal', description: '80% ra hệ Thủy (Water Crystal)', price: 50, element: 'water', effect: { chance: 0.8, element: 'water' }, image: '💧' },
  { id: 'crystal_wood', name: 'Tinh thể Mộc', type: 'crystal', description: '80% ra hệ Mộc (Wood Crystal)', price: 50, element: 'wood', effect: { chance: 0.8, element: 'wood' }, image: '🌿' },
  { id: 'crystal_metal', name: 'Tinh thể Kim', type: 'crystal', description: '80% ra hệ Kim (Metal Crystal)', price: 50, element: 'metal', effect: { chance: 0.8, element: 'metal' }, image: '⚔️' },
  { id: 'crystal_earth', name: 'Tinh thể Thổ', type: 'crystal', description: '80% ra hệ Thổ (Earth Crystal)', price: 50, element: 'earth', effect: { chance: 0.8, element: 'earth' }, image: '⛰️' },
  { id: 'mutagen_x', name: 'Thuốc Đột Biến X', type: 'mutagen', description: 'Tạo đột biến hiếm (Mutagen)', price: 200, effect: { mutationChance: 0.5 }, image: '🧪' },
];

const ELEMENTS: ElementType[] = ['metal', 'wood', 'water', 'fire', 'earth'];

// --- Helper Logic ---

const BASE_STATS = { str: 10, int: 10, spd: 10, vit: 10 };

const generateRandomGene = (part: BodyPart, elementBias?: ElementType, mutationFactor: number = 0): Gene => {
    const roll = Math.random();
    let element: ElementType;

    if (elementBias && roll < 0.8) {
        element = elementBias;
    } else {
        element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    }

    const rarityRoll = Math.random();
    let rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';
    if (rarityRoll < 0.05 + (mutationFactor * 0.2)) rarity = 'legendary';
    else if (rarityRoll < 0.15 + (mutationFactor * 0.3)) rarity = 'epic';
    else if (rarityRoll < 0.3 + (mutationFactor * 0.4)) rarity = 'rare';

    const multiplier = rarity === 'legendary' ? 5 : rarity === 'epic' ? 3 : rarity === 'rare' ? 2 : 1;

    const stats = { str: 0, int: 0, spd: 0, vit: 0 };
    if (element === 'fire') stats.str += 5 * multiplier;
    if (element === 'water') stats.int += 5 * multiplier;
    if (element === 'wood') stats.vit += 5 * multiplier;
    if (element === 'metal') stats.str += 3 * multiplier;
    if (element === 'earth') stats.vit += 3 * multiplier;

    stats.str += Math.floor(Math.random() * 3 * multiplier);
    stats.int += Math.floor(Math.random() * 3 * multiplier);
    stats.spd += Math.floor(Math.random() * 3 * multiplier);
    stats.vit += Math.floor(Math.random() * 3 * multiplier);

    return {
        part,
        name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${element} ${part}`,
        rarity,
        element,
        statsBonus: stats
    };
};

const createMockPet = (id: string, name: string, element: ElementType): Pet => {
    const parts: BodyPart[] = ['eyes', 'ears', 'horn', 'mouth', 'back', 'tail'];
    const genes: any = {};
    const totalStats = { ...BASE_STATS };

    parts.forEach(part => {
        const gene = generateRandomGene(part, element, 0);
        genes[part] = gene;
        totalStats.str += gene.statsBonus.str;
        totalStats.int += gene.statsBonus.int;
        totalStats.spd += gene.statsBonus.spd;
        totalStats.vit += gene.statsBonus.vit;
    });

    return {
        id,
        name,
        element,
        genes,
        stats: totalStats,
        rarity: 2,
        createdAt: Date.now(),
        wins: Math.floor(Math.random() * 10),
        losses: Math.floor(Math.random() * 5),
    };
};

const MOCK_LISTINGS: MarketListing[] = [
    { id: 'm1', sellerId: 'DragonSlayer', price: 500, pet: createMockPet('pet_m1', 'Fire Drake', 'fire'), createdAt: Date.now() },
    { id: 'm2', sellerId: 'AquaQueen', price: 1200, pet: createMockPet('pet_m2', 'Hydra', 'water'), createdAt: Date.now() },
    { id: 'm3', sellerId: 'ForestGuard', price: 350, pet: createMockPet('pet_m3', 'Treant', 'wood'), createdAt: Date.now() },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      piBalance: 2000,
      inventory: {},
      pets: [],
      marketListings: MOCK_LISTINGS,

      addPi: (amount) => set((state) => ({ piBalance: state.piBalance + amount })),

      buyItem: (itemId, cost) => {
        const { piBalance, inventory } = get();
        if (piBalance >= cost) {
          set({
            piBalance: piBalance - cost,
            inventory: {
              ...inventory,
              [itemId]: (inventory[itemId] || 0) + 1
            }
          });
          return true;
        }
        return false;
      },

      createPet: ({ embryoId, crystalId, mutagenId }) => {
        const state = get();
        if (state.piBalance < BREEDING_FEE) throw new Error("Not enough Pi for Breeding Fee");

        // Consume items
        const newInventory = { ...state.inventory };
        if (newInventory[embryoId] > 0) newInventory[embryoId]--;
        else throw new Error("Missing Embryo");

        if (crystalId) {
             if (newInventory[crystalId] > 0) newInventory[crystalId]--;
        }
        if (mutagenId) {
             if (newInventory[mutagenId] > 0) newInventory[mutagenId]--;
        }

        // Logic
        let elementBias: ElementType | undefined;
        if (crystalId) {
             const crystal = SHOP_ITEMS.find(i => i.id === crystalId);
             if (crystal?.element) elementBias = crystal.element;
        }

        const mutationFactor = mutagenId ? 0.5 : 0;

        const parts: BodyPart[] = ['eyes', 'ears', 'horn', 'mouth', 'back', 'tail'];
        const genes: any = {};
        const totalStats = { ...BASE_STATS };

        const mainElement = elementBias || ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];

        parts.forEach(part => {
            const gene = generateRandomGene(part, elementBias, mutationFactor);
            genes[part] = gene;
            totalStats.str += gene.statsBonus.str;
            totalStats.int += gene.statsBonus.int;
            totalStats.spd += gene.statsBonus.spd;
            totalStats.vit += gene.statsBonus.vit;
        });

        const newPet: Pet = {
            id: `pet_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: `Beast #${state.pets.length + state.marketListings.length + 1}`,
            element: mainElement,
            genes: genes,
            stats: totalStats,
            rarity: Object.values(genes).filter((g: any) => ['rare', 'epic', 'legendary'].includes(g.rarity)).length,
            createdAt: Date.now(),
            wins: 0,
            losses: 0
        };

        set({
            piBalance: state.piBalance - BREEDING_FEE,
            inventory: newInventory,
            pets: [newPet, ...state.pets]
        });

        return newPet;
      },

      listPet: (petId, price) => {
          const state = get();
          const pet = state.pets.find(p => p.id === petId);
          if (!pet) return;

          const listing: MarketListing = {
              id: `list_${Date.now()}`,
              pet: pet,
              sellerId: 'player',
              price,
              createdAt: Date.now()
          };

          set({
              pets: state.pets.filter(p => p.id !== petId),
              marketListings: [listing, ...state.marketListings]
          });
      },

      buyPet: (listingId) => {
          const state = get();
          const listing = state.marketListings.find(l => l.id === listingId);
          if (!listing) return false;

          if (state.piBalance < listing.price) return false;

          // If seller is player (shouldn't buy own, but for testing allow cancellation via separate action, buy is for others)
          // In single player mock, 'player' listed items can be bought back? Or just restrict?
          // Let's assume we are buying from OTHERS.

          set({
              piBalance: state.piBalance - listing.price,
              pets: [listing.pet, ...state.pets],
              marketListings: state.marketListings.filter(l => l.id !== listingId)
          });
          return true;
      },

      cancelListing: (listingId) => {
          const state = get();
          const listing = state.marketListings.find(l => l.id === listingId);
          if (!listing || listing.sellerId !== 'player') return;

          set({
              pets: [listing.pet, ...state.pets],
              marketListings: state.marketListings.filter(l => l.id !== listingId)
          });
      },

      recordBattleResult: (petId, win, reward) => {
          set(state => ({
              piBalance: state.piBalance + (win ? reward : 0),
              pets: state.pets.map(p => {
                  if (p.id === petId) {
                      return {
                          ...p,
                          wins: p.wins + (win ? 1 : 0),
                          losses: p.losses + (win ? 0 : 1)
                      };
                  }
                  return p;
              })
          }));
      }
    }),
    {
      name: 'pi-gene-lab-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true
    }
  )
);
