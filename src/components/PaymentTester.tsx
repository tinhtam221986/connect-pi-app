"use client";

import { useState, useEffect } from "react";
import { usePi } from "@/components/pi/pi-provider";

export default function PaymentTester() {
  const { 
    isInitialized, 
    isAuthenticated, 
    authenticate, 
    user, 
    error: sdkError, 
    incompletePayment 
  } = usePi();
  
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [authTried, setAuthTried] = useState(false);

  // Auto-authenticate when SDK is ready, but only once
  useEffect(() => {
    if (isInitialized && !isAuthenticated && !authTried) {
        authenticate();
        setAuthTried(true);
    }
  }, [isInitialized, isAuthenticated, authenticate, authTried]);

  // Handle incomplete payments detected by the Provider
  useEffect(() => {
    if (incompletePayment) {
        setLocalError(`Found incomplete payment: ${incompletePayment.identifier}. Transaction ID: ${incompletePayment.transaction?.txid}. Please check your server logs or wait for it to expire.`);
    }
  }, [incompletePayment]);

  const handleManualAuth = () => {
      setLocalError(null);
      authenticate();
  };

  const handlePayment = async () => {
    setLocalError(null);
    setStatus("Initializing payment...");
    setPaymentId(null);

    if (!window.Pi || !isInitialized) {
      setLocalError("Pi SDK is not loaded.");
      return;
    }

    try {
      // 1. Create Payment
      const paymentData = {
        amount: 0.1, // Use a small amount
        memo: "Test transaction Task 10",
        metadata: { type: "test_task_10" },
      };

      const callbacks = {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("onReadyForServerApproval", paymentId);
          setPaymentId(paymentId);
          setStatus("Waiting for Server Approval...");
          
          try {
            const res = await fetch("/api/payment/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Approval failed");
            
            console.log("Approved:", data);
            setStatus("Server Approved. Please complete in Pi Wallet.");
          } catch (e: any) {
            console.error("Server Approval Error:", e);
            setLocalError(`Server Approval Failed: ${e.message}`);
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("onReadyForServerCompletion", paymentId, txid);
          setStatus("Waiting for Server Completion...");

          try {
             const res = await fetch("/api/payment/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Completion failed");

            console.log("Completed:", data);
            setStatus("Transaction Completed Successfully! (Task 10 Done)");
          } catch (e: any) {
             console.error("Server Completion Error:", e);
             setLocalError(`Server Completion Failed: ${e.message}`);
          }
        },
        onCancel: (paymentId: string) => {
          console.log("Cancelled", paymentId);
          setLocalError("User cancelled the transaction.");
          setStatus("Cancelled.");
        },
        onError: (error: any, payment: any) => {
          console.error("Payment Error", error);
          setLocalError(`Payment Error: ${error.message || error}`);
          setStatus("Error occurred.");
        },
      };

      // @ts-ignore
      await window.Pi.createPayment(paymentData, callbacks);

    } catch (err: any) {
      console.error("Error starting payment:", err);
      setLocalError(err.message || "Failed to start payment.");
      setStatus("Failed to start.");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white text-gray-800 max-w-md mx-auto mt-10">
      
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Task 10: Pi Payment Tester</h2>
      
      {/* SDK Error */}
      {sdkError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 text-sm">
          <p><strong>SDK Error:</strong> {sdkError}</p>
        </div>
      )}

      {/* Local/Payment Error */}
      {localError && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 text-sm">
           <p><strong>Error:</strong> {localError}</p>
           {localError.includes("Server Error") && (
               <p className="mt-2 text-xs text-black">
                   Mẹo: Bạn đã cài đặt <code>PI_API_KEY</code> chưa?
               </p>
           )}
        </div>
      )}

      {/* Status Info */}
      <div className="mb-6 space-y-2 text-sm">
        <div className="flex justify-between">
            <span className="font-semibold">SDK Status:</span>
            <span className={isInitialized ? "text-green-600" : "text-yellow-600"}>
                {isInitialized ? "Ready" : "Loading..."}
            </span>
        </div>
        <div className="flex justify-between items-center">
            <span className="font-semibold">Auth Status:</span>
            <span className={isAuthenticated ? "text-green-600" : "text-gray-500"}>
                {isAuthenticated ? `Logged in as ${user?.username}` : "Not Authenticated"}
            </span>
            {!isAuthenticated && isInitialized && (
                <button 
                    onClick={handleManualAuth}
                    className="ml-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded"
                >
                    Đăng nhập lại
                </button>
            )}
        </div>
        
        {status && (
            <div className="bg-blue-50 text-blue-800 p-2 rounded">
                <strong>Status:</strong> {status}
            </div>
        )}

        {paymentId && (
             <div className="bg-gray-100 p-2 rounded break-all">
                <span className="font-semibold">Payment ID:</span> {paymentId}
             </div>
        )}
      </div>

      <button
        onClick={handlePayment}
        disabled={!isInitialized || !isAuthenticated}
        className={`w-full font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
          isInitialized && isAuthenticated
            ? "bg-purple-600 hover:bg-purple-700 text-white" 
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        {isAuthenticated ? "Pay 0.1 Pi (Test)" : "Waiting for Auth..."}
      </button>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
          Đảm bảo bạn đang ở môi trường Pi Browser Sandbox.
      </div>
    </div>
  );
}
