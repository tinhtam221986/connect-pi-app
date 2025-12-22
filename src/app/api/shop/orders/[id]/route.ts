import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const { paymentId, txid, trackingInfo, action } = body;

    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Handle Payment Success & Money Flow
    if (action === 'PAYMENT_COMPLETE') {
        if (order.status !== 'PENDING') return NextResponse.json({ error: "Order already processed" }, { status: 400 });

        order.status = 'PAID';
        order.paymentId = paymentId;
        order.txid = txid;

        // --- Execute Money Flow Split ---
        // 1. Update Seller Balance
        // Seller gets: Net Earnings + 100% Shipping
        // Ensure values exist (default to 0 if legacy)
        const netEarnings = order.netSellerEarnings || 0;
        const shipping = order.shippingFee || 0;
        const sellerPayout = netEarnings + shipping;

        if (sellerPayout > 0) {
            await User.findOneAndUpdate(
                { user_uid: order.sellerId },
                { $inc: { balance: sellerPayout } }
            );
        }

        // 2. Update Affiliate Balance (if applicable)
        if (order.affiliateCommission > 0 && order.affiliateId) {
             await User.findOneAndUpdate(
                { user_uid: order.affiliateId },
                { $inc: { balance: order.affiliateCommission } }
            );
        }

        // 3. Platform Fee (Revenue) - Logged implicitly in Order

        // Deduct stock if physical
        if (!order.isDigital) {
             const item = order.items[0];
             if (item) {
                 await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
             }
        }

        await order.save();
        return NextResponse.json({ success: true, order });
    }

    // Handle Seller Actions (Ship)
    if (action === 'SHIP') {
        order.status = 'SHIPPED';
        order.trackingInfo = trackingInfo;
        await order.save();
        return NextResponse.json({ success: true, order });
    }

    // Handle Reveal Digital Content
    if (action === 'REVEAL_CONTENT') {
        if (order.status !== 'PAID' && order.status !== 'COMPLETED') {
             return NextResponse.json({ error: "Order not paid" }, { status: 403 });
        }
        const product = await Product.findById(order.items[0].productId).select('+digitalContent');
        if (!product) return NextResponse.json({ error: "Product unavailable" }, { status: 404 });
        return NextResponse.json({ content: product.digitalContent });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
