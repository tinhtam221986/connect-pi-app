import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Missing paymentId" },
        { status: 400 }
      );
    }

    // QUAN TRỌNG: Bạn cần lấy API Key từ Pi Developer Portal
    const PI_API_KEY = process.env.PI_API_KEY || ""; 

    if (!PI_API_KEY) {
      return NextResponse.json(
        { error: "Server Error: PI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Pi API Approve Error:", data);
      return NextResponse.json(
        { error: "Failed to approve payment", details: data },
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
