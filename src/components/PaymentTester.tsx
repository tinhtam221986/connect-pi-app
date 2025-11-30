"use client";

import { useState } from "react";
import { usePi } from "@/components/pi/pi-provider";

export default function PaymentTester() {
  const { isInitialized, error: sdkError, authenticate } = usePi();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = sdkError || localError;
  const sdkLoaded = isInitialized;

  const onIncompletePaymentFound = (payment: any) => {
    console.log("Incomplete payment found", payment);
  };

  const handlePayment = async () => {
    setLocalError(null);
    if (!window.Pi || !isInitialized) {
      setLocalError("Pi SDK chưa được tải (Pi SDK not loaded).");
      return;
    }

    try {
      const scopes = ["payments"];
      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      console.log("Auth:", auth);

      const paymentData = {
        amount: 1,
        memo: "Test transaction Task 10",
        metadata: { type: "test" },
      };

      // @ts-ignore
      const payment = await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("Ready for approval", paymentId);
          setPaymentId(paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("Ready for completion", paymentId, txid);
        },
        onCancel: (paymentId: string) => {
          console.log("Cancelled", paymentId);
          setLocalError("Giao dịch đã bị hủy (Cancelled).");
        },
        onError: (error: any, payment: any) => {
          console.error("Payment Error", error);
          setLocalError(error.message || "Lỗi thanh toán (Payment Error).");
        },
      });

    } catch (err: any) {
      console.error("Error starting payment:", err);
      setLocalError(err.message || "Không thể khởi tạo thanh toán.");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white text-gray-800 max-w-md mx-auto mt-10">
      
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Task 10: Pi Payment Tester</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6 space-y-2">
        <div className="flex justify-between">
            <span className="font-semibold">SDK Status:</span>
            <span className={sdkLoaded ? "text-green-600" : "text-yellow-600"}>
                {sdkLoaded ? "Ready" : "Loading..."}
            </span>
        </div>
        {paymentId && (
             <div className="text-sm bg-gray-100 p-2 rounded break-all">
                <span className="font-semibold">Payment ID:</span> {paymentId}
             </div>
        )}
      </div>

      <button
        onClick={handlePayment}
        disabled={!sdkLoaded}
        className={`w-full font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
          sdkLoaded 
            ? "bg-purple-600 hover:bg-purple-700 text-white" 
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        Pay 1 Pi (Test)
      </button>
    </div>
  );
}
