"use client";
import { useState } from 'react';

declare global {
  interface Window {
    Pi: any;
  }
}

export default function PaymentTester() {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setError(null);
    try {
      if (!window.Pi) {
        setError("Pi Network SDK chưa được tải (hãy mở trên Pi Browser).");
        return;
      }

      const paymentData = {
        amount: 1,
        memo: "Test transaction Task 10",
        metadata: { type: "test" },
      };

      const payment = await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("Ready for approval", paymentId);
          setPaymentId(paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("Ready for completion", paymentId, txid);
        },
        onCancel: (paymentId: string) => {
          setError("Giao dịch đã bị hủy.");
        },
        onError: (error: any, payment: any) => {
          console.error(error);
          setError(error.message || "Đã xảy ra lỗi thanh toán.");
        },
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Lỗi không xác định.");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">Test Pi Payment</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {paymentId && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Payment ID: {paymentId}
        </div>
      )}

      <button
        onClick={handlePayment}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        Thanh toán 1 Pi (Test)
      </button>
    </div>
  );
}
