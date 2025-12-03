import { NextResponse } from 'next/server';
import { SmartContractService } from '@/lib/smart-contract-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const gameState = SmartContractService.getGameState(userId);
    return NextResponse.json(gameState);
  } catch (error) {
    console.error('Game State API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch game state' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, action, data } = body;

    // In a real app, this would transact with the GameFi contract
    // For now, we update the mock state
    const newState = SmartContractService.updateGameState(userId, action, data);

    return NextResponse.json(newState);
  } catch (error) {
    console.error('Game Action Error:', error);
    return NextResponse.json({ error: 'Failed to process game action' }, { status: 500 });
  }
}
