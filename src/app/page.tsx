import Image from "next/image";
import PaymentTester from "@/components/PaymentTester"; // <--- Dòng này để lấy "Cỗ máy" từ kho ra

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
      
      <h1 className="text-2xl font-bold">Pi Network Payment Test</h1>
      
      {/* Dòng dưới đây chính là đặt "Cỗ máy" vào vị trí hiển thị */}
      <PaymentTester /> 

      <p className="text-sm text-gray-500">
        Hãy mở ứng dụng này bằng Pi Browser để test thanh toán.
      </p>

    </div>
  );
}
