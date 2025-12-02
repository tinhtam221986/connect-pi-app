"use client";

import { useState } from 'react';
import { usePi } from '@/components/pi/pi-provider';
import { toast } from 'sonner';

export function usePiPayment() {
    const { isMock } = usePi();
    const [loading, setLoading] = useState(false);

    const createPayment = async (amount: number, memo: string, metadata: any, onSuccess?: () => void) => {
        setLoading(true);

        if (isMock) {
            // Mock Flow for development/testing
            console.log("Mock Payment Initiated", { amount, memo });
            setTimeout(() => {
                setLoading(false);
                toast.success(`Mock Payment of ${amount} Pi Successful!`);
                if (onSuccess) onSuccess();
            }, 1500);
            return;
        }

        try {
            if (!window.Pi) throw new Error("Pi SDK not loaded");

            const paymentData = {
                amount,
                memo,
                metadata
            };

            const callbacks = {
                onReadyForServerApproval: async (paymentId: string) => {
                    console.log("Server Approval Needed for", paymentId);
                    try {
                        const res = await fetch('/api/payment/approve', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId })
                        });
                        if (!res.ok) {
                            const err = await res.json();
                            throw new Error(err.error || "Approval Failed");
                        }
                        // Pi SDK handles the response via internal polling or continuation
                    } catch (err) {
                        console.error("Server Approval Error", err);
                        throw err;
                    }
                },
                onReadyForServerCompletion: async (paymentId: string, txid: string) => {
                     console.log("Server Completion Needed for", paymentId, txid);
                     try {
                        const res = await fetch('/api/payment/complete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId, txid })
                        });
                        if (!res.ok) {
                            const err = await res.json();
                            throw new Error(err.error || "Completion Failed");
                        }
                        setLoading(false);
                        toast.success("Payment Verified & Completed!");
                        if (onSuccess) onSuccess();
                     } catch (err) {
                         console.error("Server Completion Error", err);
                         throw err;
                     }
                },
                onCancel: (paymentId: string) => {
                    toast.warning("Payment cancelled");
                    setLoading(false);
                },
                onError: (error: Error, payment: any) => {
                    console.error("Payment Error", error);
                    toast.error("Payment failed: " + error.message);
                    setLoading(false);
                }
            };

            await window.Pi.createPayment(paymentData, callbacks);

        } catch (e: any) {
            console.error(e);
            toast.error("Payment Request Failed: " + e.message);
            setLoading(false);
        }
    };

    return { createPayment, loading };
}
