import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  sellerId: { type: String, required: true }, // user_uid of the seller
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  productType: {
    type: String,
    enum: ['physical', 'digital'],
    required: true,
    default: 'physical'
  },
  digitalContent: {
    type: String,
    select: false // Hidden by default
  },
  stock: { type: Number, default: 1 },

  // Simplified Shipping as per Money Flow Formula
  shippingFee: { type: Number, default: 0 },

  // Commission Config
  affiliateRate: { type: Number, default: 0 }, // e.g. 0.10 for 10%

  // Legacy/Detailed options (kept for backward compatibility or future use)
  shippingOptions: [{
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    estimatedDays: { type: String }
  }],

  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProductSchema.index({ sellerId: 1, status: 1 });
ProductSchema.index({ productType: 1 });

let Product: any;
try {
  Product = mongoose.model("Product");
} catch {
  Product = mongoose.model("Product", ProductSchema);
}

export default Product;
