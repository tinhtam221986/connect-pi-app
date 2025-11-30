"use client"

import { useState } from 'react';

// Định nghĩa interface cho window.Pi
declare global {
  interface Window {
    Pi: any;
  }
}

export default function PaymentTester() {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onPaymentIncomplete = (payment: any) => {
    console.log("Payment incomplete:", payment);
  };

  const handlePayment = async () => {
    setError(null);
    try {
      if (!window.Pi) {
        setError("Pi Network SDK chưa được tải.");
        return;
      }

      // Tạo payment
      const paymentData = {
        amount: 1, // 1 Pi
        memo: "Test transaction for task 10",
        metadata: { type: "test" },
      };

      const callbacks = {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("Ready for server approval:", paymentId);
          setPaymentId(paymentId);
          // Trong môi trường thực tế, bạn sẽ gửi paymentId lên server của mình để approve
          // Ở đây với client-side only (hoặc test), SDK có thể tự xử lý hoặc cần server flow
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("Ready for server completion:", paymentId, txid);
          // Gửi txid lên server để complete payment
        },
        onCancel: (paymentId: string) => {
          console.log("Payment cancelled:", paymentId);
          setError("Giao dịch đã bị hủy.");
        },
        onError: (error: Error, payment: any) => {
          console.error("Payment error:", error, payment);
          setError(`Lỗi thanh toán: ${error.message}`);
        },
      };

      const payment = await window.Pi.createPayment(paymentData, callbacks);
      console.log("Payment created:", payment);

    } catch (err: any) {
      console.error("Error initiating payment:", err);
      setError(err.message || "Đã xảy ra lỗi khi tạo thanh toán.");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white text-black mt-4">
      <h2 className="text-xl font-bold mb-2">Test Payment (Task 10)</h2>
      <button
        onClick={handlePayment}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Thanh toán 1 Pi
      </button>
      {paymentId && <p className="mt-2 text-green-600">Payment ID: {paymentId}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
