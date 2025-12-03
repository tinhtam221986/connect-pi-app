import { useState, useCallback } from 'react';
import { usePi } from '@/components/pi/pi-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export type PaymentCallbacks = {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
};

export function usePiPayment() {
  const { isInitialized, isAuthenticated } = usePi();
  const [loading, setLoading] = useState(false);

  const createPayment = useCallback(async (
    amount: number, 
    memo: string, 
    metadata: any = {},
    callbacks?: PaymentCallbacks
  ) => {
    if (!isInitialized || !isAuthenticated) {
      toast.error("Pi SDK not ready or not authenticated");
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        amount,
        memo,
        metadata,
      };

      const piCallbacks = {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("Approving payment...", paymentId);
          try {
            const data = await apiClient.payment.approve(paymentId);
            if (data.error) throw new Error(data.error);
            console.log("Payment approved by server");
          } catch (e: any) {
            console.error("Approval failed", e);
            throw e; // Pi SDK handles this
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log("Completing payment...", paymentId, txid);
            try {
                const data = await apiClient.payment.complete(paymentId, txid);
                if (data.error) throw new Error(data.error);
                console.log("Payment completed by server", data);
                if (callbacks?.onSuccess) callbacks.onSuccess(data);
                toast.success("Payment Successful!");
            } catch (e: any) {
                console.error("Completion failed", e);
                if (callbacks?.onError) callbacks.onError(e);
                throw e;
            } finally {
                setLoading(false);
            }
        },
        onCancel: (paymentId: string) => {
            console.log("Payment cancelled", paymentId);
            if (callbacks?.onCancel) callbacks.onCancel();
            toast.info("Payment Cancelled");
            setLoading(false);
        },
        onError: (error: any, payment: any) => {
            console.error("Payment error", error);
            if (callbacks?.onError) callbacks.onError(error);
            toast.error(`Payment Error: ${error.message || error}`);
            setLoading(false);
        }
      };

      // @ts-ignore
      if (window.Pi) {
          // @ts-ignore
          await window.Pi.createPayment(paymentData, piCallbacks);
      } else {
          throw new Error("Pi SDK Global not found");
      }

    } catch (error: any) {
        console.error("Failed to init payment", error);
        toast.error("Failed to start payment: " + error.message);
        setLoading(false);
    }
  }, [isInitialized, isAuthenticated]);

  return {
    createPayment,
    loading
  };
}
