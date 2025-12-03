import { NextResponse } from 'next/server';
import { SmartContractService } from '@/lib/smart-contract-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const balance = SmartContractService.getBalance(userId);
    // Ensure we return the shape expected by the frontend
    return NextResponse.json({
      balance: balance.piBalance, // Pi Mainnet balance
      connectToken: balance.tokenBalance, // Connect Token (CT)
      nfts: balance.nfts // Owned NFTs
    });
  } catch (error) {
    console.error('Wallet API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
  }
}
