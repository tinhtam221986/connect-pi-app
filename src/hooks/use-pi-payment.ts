import { useState, useCallback } from "react";
import { usePi } from "@/components/pi/pi-provider";
import { toast } from "sonner";

export interface PiPaymentData {
    amount: number;
    memo: string;
    metadata: any;
}

export function usePiPayment() {
    const { isInitialized, isMock, user } = usePi();
    const [loading, setLoading] = useState(false);

    const purchase = useCallback(async (product: any) => {
        if (!isInitialized) {
            toast.error("Pi SDK not initialized");
            return;
        }

        if (!user) {
            toast.error("Please login first");
            return;
        }

        setLoading(true);
        const paymentData = {
            amount: product.price,
            memo: `Purchase: ${product.name}`,
            metadata: { productId: product.id, type: "digital_item" }
        };

        const callbacks = {
            onReadyForServerApproval: async (paymentId: string) => {
                console.log("onReadyForServerApproval", paymentId);
                try {
                    const res = await fetch("/api/payment/approve", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentId })
                    });

                    if (!res.ok) throw new Error("Server approval failed");
                    toast.info("Payment approved by server...");
                } catch (e: any) {
                    console.error(e);
                    toast.error("Approval Error: " + e.message);
                }
            },
            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
                console.log("onReadyForServerCompletion", paymentId, txid);
                try {
                    const res = await fetch("/api/payment/complete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentId, txid })
                    });

                    if (!res.ok) throw new Error("Server completion failed");

                    toast.success("Purchase Successful!");
                } catch (e: any) {
                    console.error(e);
                    toast.error("Completion Error: " + e.message);
                } finally {
                    setLoading(false);
                }
            },
            onCancel: (paymentId: string) => {
                console.log("Payment Cancelled", paymentId);
                toast.warning("Payment cancelled");
                setLoading(false);
            },
            onError: (error: Error, payment: any) => {
                console.error("Payment Error", error, payment);
                toast.error("Payment Error: " + error.message);
                setLoading(false);
            }
        };

        try {
            if (window.Pi) {
                await window.Pi.createPayment(paymentData, callbacks);
            } else {
                throw new Error("Pi SDK Global Object missing");
            }
        } catch (e: any) {
            setLoading(false);
            console.error(e);
            toast.error("Create Payment Failed");
        }
    }, [isInitialized, user]);

    return {
        purchase,
        loading
    };
}
