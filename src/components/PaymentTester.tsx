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
      const callbacks = {
        onReadyForServerApproval: (pid: string) => {
          console.log("Approved:", pid);
          setPaymentId(pid);
        },
        onReadyForServerCompletion: (pid: string, txid: string) => {
          console.log("Completed:", pid, txid);
        },
        onCancel: (pid: string) => setError("Đã hủy."),
        onError: (err: any, payment: any) => setError(err.message),
      };
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (err: any) {
      setError(err.message || "Lỗi tạo thanh toán.");
    }
  };

  return (
    <div className="p-4 border rounded bg-white text-black my-4">
      <h2 className="font-bold mb-2">Test Payment</h2>
      <button onClick={handlePayment} className="px-4 py-2 bg-purple-600 text-white rounded">
        Thanh toán 1 Pi
      </button>
      {paymentId && <p className="text-green-600">Payment ID: {paymentId}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
