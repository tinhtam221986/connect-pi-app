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
    select: false // Hidden by default, only revealed via specific API call
  },
  stock: { type: Number, default: 1 },
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

// Index for search/filtering
ProductSchema.index({ sellerId: 1, status: 1 });
ProductSchema.index({ productType: 1 });

let Product: any;
try {
  Product = mongoose.model("Product");
} catch {
  Product = mongoose.model("Product", ProductSchema);
}

export default Product;
