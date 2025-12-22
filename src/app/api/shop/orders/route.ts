import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      buyerId,
      sellerId,
      productId,
      shippingAddress,
      quantity = 1
    } = body;

    if (!buyerId || !sellerId || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch Product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 2. Validate Stock
    if (product.productType === 'physical' && product.stock < quantity) {
        return NextResponse.json({ error: "Out of stock" }, { status: 400 });
    }

    // 3. Calculate Fees & Totals (Money Flow Formula)
    // Formula: Total = (Product Price * Qty) + Shipping
    const productTotal = product.price * quantity;
    const shippingFee = product.shippingFee || 0;
    const totalAmount = productTotal + shippingFee;

    // Split Logic (Calculated now, executed on Payment Success)
    // 1. Platform Fee (5% of Product Price only, Shipping excluded)
    const GLOBAL_FEE_RATE = 0.05;
    const platformFee = productTotal * GLOBAL_FEE_RATE;

    // 2. Affiliate Commission (Product Price * Rate)
    const affiliateRate = product.affiliateRate || 0;
    const affiliateCommission = productTotal * affiliateRate;

    // 3. Net Seller Earnings (Product Price - Fees)
    // Note: Seller gets 100% of Shipping Fee later in the final sum
    const netSellerEarnings = productTotal - platformFee - affiliateCommission;

    // Check if Shipping is required but missing
    if (product.productType === 'physical' && !shippingAddress) {
        return NextResponse.json({ error: "Shipping address required for physical goods" }, { status: 400 });
    }

    const newOrder = await Order.create({
      buyerId,
      sellerId,
      items: [{
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity,
        productType: product.productType
      }],
      totalAmount,

      // Store Breakdown
      shippingFee,
      platformFee,
      affiliateCommission,
      netSellerEarnings,

      status: 'PENDING',
      isDigital: product.productType === 'digital',
      shippingAddress: shippingAddress || undefined
    });

    return NextResponse.json({ order: newOrder });

  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");
    const buyerId = searchParams.get("buyerId");

    let query: any = {};
    if (sellerId) query.sellerId = sellerId;
    if (buyerId) query.buyerId = buyerId;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
