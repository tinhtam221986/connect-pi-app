import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
        return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const user = await User.findOne({ user_uid: uid }).select('savedAddresses');
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.savedAddresses || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { uid, address } = body;

    if (!uid || !address) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findOne({ user_uid: uid });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add to address book
    // If set as default, unset others? For now, just append.
    user.savedAddresses.push(address);
    await user.save();

    return NextResponse.json({ addresses: user.savedAddresses });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}
