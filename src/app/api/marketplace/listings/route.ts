import { NextResponse } from 'next/server';
import { SmartContractService } from '@/lib/smart-contract-service';

export async function GET() {
  try {
    const items = await SmartContractService.getListings();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Market API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const listing = await SmartContractService.createListing(body);
        return NextResponse.json(listing);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
    }
}
