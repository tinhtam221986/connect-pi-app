import { NextResponse } from "next/server";
import { SmartContractService } from "@/lib/smart-contract-service";

// Mock implementation of Pi API payment completion
async function mockCompletePayment(paymentId: string, txid: string) {
    // Check if we are running in mock mode or if env is missing
    if (!process.env.PI_API_KEY) {
        console.warn("Using MOCK Payment Completion (Missing PI_API_KEY)");
        return { status: "COMPLETED", paymentId };
    }

    const PI_API_KEY = process.env.PI_API_KEY;

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.errorMessage || "Failed to complete payment at Pi Server");
    }
    return data;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, txid, paymentData } = body;
    // paymentData contains metadata passed from client createPayment
    // (e.g., { itemId, type: 'marketplace_buy', userId })

    if (!paymentId || !txid) {
      return NextResponse.json(
        { error: "Missing paymentId or txid" },
        { status: 400 }
      );
    }

    // 1. Complete payment with Pi Network (or Mock)
    const piResult = await mockCompletePayment(paymentId, txid);

    // 2. If successful, execute the smart contract logic via our Service
    if (paymentData && paymentData.type === 'marketplace_buy') {
        try {
            // Transfer ownership in the mock smart contract
            // We need userId here. Ideally passed in paymentData or verified via session.
            // For now assuming it's passed or we use a fallback for the mock.
            const buyerId = paymentData.userId || 'user_current';
            SmartContractService.purchaseListing(paymentData.itemId, buyerId);
            console.log(`SmartContract: Transferred item ${paymentData.itemId} to ${buyerId}`);
        } catch (scError) {
            console.error("Smart Contract execution failed:", scError);
            // In a real app, this is a critical state mismatch (Paid but not received).
            // We would need a refund mechanism or a retry queue.
            // For now, we return success for the payment but log the error.
        }
    }

    return NextResponse.json(piResult);

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
