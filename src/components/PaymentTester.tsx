"use client";

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
Bước 2: Cập nhật trang chủ
Hãy mở file src/app/page.tsx và thêm component PaymentTester vào. File của bạn nên trông giống như thế này:

import Image from "next/image";
import PaymentTester from "@/components/PaymentTester"; // <--- Thêm dòng này

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        {/* Thêm Component Test Thanh Toán vào đây */}
        <PaymentTester /> 

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
