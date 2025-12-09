import { NextResponse } from 'next/server';
import { SmartContractService } from '@/lib/smart-contract-service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, materialIds } = body;

        if (!userId || !materialIds || !Array.isArray(materialIds)) {
            return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
        }

        const newPet = await SmartContractService.breedPet(userId, materialIds);
        return NextResponse.json({ success: true, pet: newPet });

    } catch (error: any) {
        console.error("Breeding Error:", error);
        return NextResponse.json({ error: error.message || "Breeding failed" }, { status: 500 });
    }
}
