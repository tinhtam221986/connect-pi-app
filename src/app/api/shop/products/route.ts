import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    let query: any = { status: 'active' };

    // If filtering by seller (e.g., "My Shop" view)
    if (sellerId) {
      query.sellerId = sellerId;
      // If viewing own shop, maybe show inactive too?
      // For now, let's keep it simple: fetch all for owner if requested specially,
      // but the public API typically just shows active.
      // We can add a "status" param later if needed.
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      sellerId, // user_uid from Pi Auth
      title,
      description,
      price,
      images,
      productType,
      digitalContent,
      shippingOptions,
      stock
    } = body;

    if (!sellerId || !title || !price || !productType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic validation
    if (productType === 'digital' && !digitalContent) {
      return NextResponse.json({ error: "Digital products require content" }, { status: 400 });
    }

    if (productType === 'physical' && (!stock || stock < 1)) {
        // Physical usually needs stock, though we can default to 1
    }

    // Verify user exists
    const user = await User.findOne({ user_uid: sellerId });
    if (!user) {
        return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    const newProduct = await Product.create({
      sellerId,
      title,
      description,
      price,
      images: images || [],
      productType,
      digitalContent, // Mongoose will handle select: false on fetch, but it stores it here
      stock: stock || 1,
      shippingOptions: shippingOptions || [],
      status: 'active'
    });

    return NextResponse.json({ product: newProduct });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
