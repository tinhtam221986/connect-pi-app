import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  buyerId: { type: String, required: true }, // user_uid
  sellerId: { type: String, required: true }, // user_uid

  // Snapshot of products at time of purchase
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    productType: { type: String, enum: ['physical', 'digital'] }
  }],

  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'PI' },

  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },

  // Shipping Info (Required for Physical items)
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    note: String
  },

  // Tracking (Filled by Seller)
  trackingInfo: {
    carrier: String,
    trackingNumber: String,
    shippedAt: Date
  },

  isDigital: { type: Boolean, default: false },

  // Pi Network Payment Info
  paymentId: { type: String },
  txid: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrderSchema.index({ buyerId: 1, status: 1 });
OrderSchema.index({ sellerId: 1, status: 1 });

let Order: any;
try {
  Order = mongoose.model("Order");
} catch {
  Order = mongoose.model("Order", OrderSchema);
}

export default Order;
