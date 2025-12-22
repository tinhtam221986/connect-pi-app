import { useState } from 'react';
import { usePi } from '@/components/pi/pi-provider';
import { usePiPayment } from '@/hooks/use-pi-payment';
import { toast } from 'sonner';
import { X, MapPin, Truck, CreditCard, CheckCircle, Loader2, FileText, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutModalProps {
    product: any;
    onClose: () => void;
}

type CheckoutStep = 'REVIEW' | 'ADDRESS' | 'PAYMENT' | 'SUCCESS';

export function CheckoutModal({ product, onClose }: CheckoutModalProps) {
    const { user } = usePi();
    const { createPayment, loading: paymentLoading } = usePiPayment();
    const [step, setStep] = useState<CheckoutStep>('REVIEW');
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState<any>(null); // Selected address
    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        note: ''
    });
    const [isNewAddress, setIsNewAddress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    const itemTotal = product.price * quantity;
    const shippingFee = (product.shippingFee || 0); // Flat fee, or * quantity if desired, but typically flat for single product checkout
    // Let's assume flat fee per checkout for MVP as per "Domestic Shipping Fee" field implies.
    // If it was per item, we'd multiply. Let's multiply for safety if user buys 10 items.
    // Actually, usually shipping is per order, but simple "per item" is easier for "Add Product" logic without a cart.
    // Let's keep it flat per order for this "Buy Now" flow to be simple?
    // No, if I buy 10 heavy items, shipping costs more.
    // Let's assume shippingFee is per Item for now since there's no complex cart calculation.
    // Update: User said "Domestic Shipping Fee (Pi)" in Add Product.
    // Formula: Total = Product Price + Shipping Fee.
    // It says "Shipping Fee (Set by Seller)".
    // Let's treat it as a per-item fee for safety in this "Direct Buy" flow.
    const totalShipping = shippingFee; // * quantity ? Let's stick to flat fee per transaction for now to be user friendly unless directed.
    // Actually, looking at route.ts I implemented: `const shippingFee = product.shippingFee || 0; const totalAmount = productTotal + shippingFee;`
    // So it's a FLAT FEE per order in the backend. I will match that in frontend.

    const totalAmount = itemTotal + totalShipping;
    const isPhysical = product.productType === 'physical';

    const handleNext = async () => {
        if (step === 'REVIEW') {
            if (isPhysical) {
                setStep('ADDRESS');
            } else {
                setStep('PAYMENT');
            }
        } else if (step === 'ADDRESS') {
            if (isNewAddress) {
                if (!newAddress.name || !newAddress.phone || !newAddress.street) {
                    toast.error("Please fill in address details");
                    return;
                }
                setAddress(newAddress);
            } else if (!address && !isNewAddress) {
                // If no saved address loaded (mock logic for now), force new
                 toast.error("Please add an address");
                 setIsNewAddress(true);
                 return;
            }
            setStep('PAYMENT');
        } else if (step === 'PAYMENT') {
            handlePayment();
        }
    };

    const handlePayment = async () => {
        if (!user?.uid) return;
        setLoading(true);

        try {
            // 1. Create Order (PENDING)
            const orderRes = await fetch('/api/shop/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buyerId: user.uid,
                    sellerId: product.sellerId,
                    productId: product._id,
                    quantity,
                    shippingAddress: isPhysical ? address : undefined
                })
            });
            const orderData = await orderRes.json();
            if (orderData.error) throw new Error(orderData.error);

            const newOrderId = orderData.order._id;
            setOrderId(newOrderId);

            // 2. Trigger Pi Payment
            await createPayment(
                totalAmount,
                `Buy ${product.title}`,
                { orderId: newOrderId, type: 'SHOP_PURCHASE' },
                {
                    onSuccess: async (txData) => {
                        // 3. Mark Order as PAID
                         await fetch(`/api/shop/orders/${newOrderId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'PAYMENT_COMPLETE',
                                paymentId: txData.paymentId,
                                txid: txData.txid
                            })
                        });
                        setStep('SUCCESS');
                    },
                    onError: (err) => {
                        toast.error("Payment failed");
                    },
                    onCancel: () => {
                        toast.info("Payment cancelled");
                    }
                }
            );

        } catch (error: any) {
            toast.error(error.message || "Checkout failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-end sm:items-center justify-center sm:p-4">
            <div className="bg-gray-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-gray-800 max-h-[90vh] overflow-y-auto flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                    <h3 className="font-bold text-lg text-white">Checkout</h3>
                    <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-4 space-y-6 flex-1">

                    {/* Steps Indicator */}
                    <div className="flex items-center justify-between px-4 mb-2">
                        <div className={cn("w-3 h-3 rounded-full", step === 'REVIEW' || step === 'ADDRESS' || step === 'PAYMENT' || step === 'SUCCESS' ? "bg-purple-500" : "bg-gray-700")} />
                        <div className={cn("h-0.5 flex-1 mx-2", step === 'ADDRESS' || step === 'PAYMENT' || step === 'SUCCESS' ? "bg-purple-500" : "bg-gray-700")} />
                        <div className={cn("w-3 h-3 rounded-full", step === 'ADDRESS' || step === 'PAYMENT' || step === 'SUCCESS' ? "bg-purple-500" : "bg-gray-700")} />
                        <div className={cn("h-0.5 flex-1 mx-2", step === 'PAYMENT' || step === 'SUCCESS' ? "bg-purple-500" : "bg-gray-700")} />
                        <div className={cn("w-3 h-3 rounded-full", step === 'PAYMENT' || step === 'SUCCESS' ? "bg-purple-500" : "bg-gray-700")} />
                    </div>

                    {step === 'REVIEW' && (
                        <div className="space-y-4">
                            <div className="flex gap-4 bg-gray-800/50 p-3 rounded-xl">
                                <img src={product.images?.[0]} className="w-20 h-20 bg-gray-800 rounded-lg object-cover" />
                                <div>
                                    <h4 className="font-bold text-sm text-white">{product.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        {isPhysical ? <Box size={12}/> : <FileText size={12}/>}
                                        {isPhysical ? 'Physical Good' : 'Digital Item'}
                                    </p>
                                    <p className="text-purple-400 font-bold mt-2">π {product.price}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                                <span className="text-sm text-gray-400">Quantity</span>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 bg-gray-800 rounded-lg text-white font-bold">-</button>
                                    <span className="text-white font-bold">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 bg-gray-800 rounded-lg text-white font-bold">+</button>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4 space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Item Total</span>
                                    <span className="text-white">π {itemTotal.toFixed(2)}</span>
                                </div>
                                {isPhysical && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="text-white">π {totalShipping.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                                    <span className="text-gray-400 font-bold">Total</span>
                                    <span className="text-xl font-bold text-purple-400">π {totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'ADDRESS' && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-white flex items-center gap-2">
                                <MapPin size={18} className="text-purple-500" /> Shipping Address
                            </h4>

                            {/* Saved addresses would go here, for now just a simple form */}
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={newAddress.name}
                                    onChange={e => { setIsNewAddress(true); setNewAddress({...newAddress, name: e.target.value}) }}
                                    className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm text-white"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={newAddress.phone}
                                    onChange={e => { setIsNewAddress(true); setNewAddress({...newAddress, phone: e.target.value}) }}
                                    className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={newAddress.street}
                                    onChange={e => { setIsNewAddress(true); setNewAddress({...newAddress, street: e.target.value}) }}
                                    className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm text-white"
                                />
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChange={e => { setIsNewAddress(true); setNewAddress({...newAddress, city: e.target.value}) }}
                                        className="flex-1 bg-black border border-gray-700 rounded-xl p-3 text-sm text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'PAYMENT' && (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto text-purple-500">
                                <CreditCard size={32} />
                            </div>
                            <h4 className="font-bold text-xl text-white">Confirm Payment</h4>
                            <p className="text-gray-400 text-sm">You are about to pay <strong className="text-white">π {totalAmount.toFixed(2)}</strong></p>

                            {paymentLoading && (
                                <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-xl text-yellow-200 text-xs">
                                    Please verify the transaction in your Pi Wallet...
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-500">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="font-bold text-xl text-white">Order Successful!</h4>
                            <p className="text-gray-400 text-sm">Your order has been placed successfully.</p>

                            {isPhysical ? (
                                <p className="text-xs text-gray-500">The seller will process your shipping shortly.</p>
                            ) : (
                                <div className="bg-gray-800 p-3 rounded-xl mt-4">
                                    <p className="text-xs text-gray-300 mb-2">You can access your digital content in "My Orders"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-800 bg-gray-900 sticky bottom-0 z-10 pb-8 sm:pb-4">
                    {step === 'SUCCESS' ? (
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 bg-gray-800 rounded-xl font-bold text-white"
                        >
                            Close
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={loading || paymentLoading}
                            className="w-full py-3.5 bg-purple-600 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {loading || paymentLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                            {step === 'REVIEW' && 'Continue to Checkout'}
                            {step === 'ADDRESS' && 'Proceed to Payment'}
                            {step === 'PAYMENT' && `Pay π ${totalAmount.toFixed(2)}`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
