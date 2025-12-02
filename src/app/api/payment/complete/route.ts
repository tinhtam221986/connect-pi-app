import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, txid } = body;

    if (!paymentId || !txid) {
      return NextResponse.json(
        { error: "Missing paymentId or txid" },
        { status: 400 }
      );
    }

    // Mock Mode
    if (paymentId.toString().startsWith("mock_")) {
        console.log("Mock Payment Complete for:", paymentId);
        return NextResponse.json({
            identifier: paymentId,
            status: "COMPLETED_AND_CLOSED",
            amount: 1,
            memo: "Mock Payment",
            to_address: "mock_address",
            transaction: { txid }
        });
    }

    const PI_API_KEY = process.env.PI_API_KEY || "";

    if (!PI_API_KEY) {
      return NextResponse.json(
        { error: "Server Error: PI_API_KEY is not configured." },
        { status: 500 }
      );
    }

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
      console.error("Pi API Complete Error:", data);
      return NextResponse.json(
        { error: "Failed to complete payment", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
