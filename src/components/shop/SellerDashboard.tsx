import { useState, useEffect } from 'react';
import { usePi } from '@/components/pi/pi-provider';
import { Box, Truck, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
    _id: string;
    items: any[];
    totalAmount: number;
    status: string;
    buyerId: string;
    shippingAddress?: any;
    createdAt: string;
}

export function SellerDashboard() {
    const { user } = usePi();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.uid) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`/api/shop/orders?sellerId=${user?.uid}`);
            const data = await res.json();
            if (data.orders) setOrders(data.orders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleShip = async (orderId: string) => {
        const tracking = prompt("Enter Tracking Number:");
        if (!tracking) return;

        try {
            const res = await fetch(`/api/shop/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'SHIP',
                    trackingInfo: {
                        trackingNumber: tracking,
                        carrier: 'Standard',
                        shippedAt: new Date()
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Order marked as shipped");
                fetchOrders();
            }
        } catch (e) {
            toast.error("Failed to update order");
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading orders...</div>;

    return (
        <div className="space-y-4 px-3 pb-20">
            <h3 className="font-bold text-white text-lg">Incoming Orders</h3>
            {orders.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-10">No orders yet</div>
            ) : (
                orders.map(order => (
                    <div key={order._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                                    order.status === 'PAID' ? 'bg-green-900 text-green-400' :
                                    order.status === 'SHIPPED' ? 'bg-blue-900 text-blue-400' : 'bg-gray-800 text-gray-400'
                                }`}>
                                    {order.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">ID: {order._id.slice(-6)}</p>
                            </div>
                            <span className="font-bold text-purple-400">π {order.totalAmount}</span>
                        </div>

                        <div className="flex gap-3 mb-3">
                             {/* Items preview */}
                             <div className="flex-1">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-2 items-center text-sm text-white mb-1">
                                        <span className="text-gray-500">{item.quantity}x</span>
                                        <span>{item.title}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {order.shippingAddress && (
                            <div className="bg-gray-800/50 p-2 rounded-lg text-xs text-gray-300 mb-3">
                                <p className="font-bold mb-1">Shipping to:</p>
                                <p>{order.shippingAddress.name}, {order.shippingAddress.phone}</p>
                                <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                            </div>
                        )}

                        {order.status === 'PAID' && order.shippingAddress && (
                            <button
                                onClick={() => handleShip(order._id)}
                                className="w-full py-2 bg-blue-600 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2"
                            >
                                <Truck size={16} /> Mark as Shipped
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
