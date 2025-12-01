"use client";

import { usePi } from "@/app/contexts/PiNetworkContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Moon, Sun, Monitor, Palette, Video, ShoppingBag, Gamepad2, Users } from "lucide-react";

export default function Home() {
  const { authenticate, user, status } = usePi();
  const { mode, setMode, primaryColor, setPrimaryColor } = useTheme();

  const primaryColorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    green: "bg-green-600 hover:bg-green-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    pink: "bg-pink-600 hover:bg-pink-700",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-24 relative overflow-hidden">
        
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
         <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
         <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-10">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          CONNECT - Pi Network Web3 Social
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex gap-4 p-4">
             {/* Theme Toggle */}
             <div className="flex bg-white/20 backdrop-blur rounded-full p-1 border border-gray-200 dark:border-gray-700">
                <button onClick={() => setMode('light')} className={`p-2 rounded-full ${mode === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}><Sun size={16}/></button>
                <button onClick={() => setMode('system')} className={`p-2 rounded-full ${mode === 'system' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}><Monitor size={16}/></button>
                <button onClick={() => setMode('dark')} className={`p-2 rounded-full ${mode === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500'}`}><Moon size={16}/></button>
             </div>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
          CONNECT <span className={`text-transparent bg-clip-text bg-gradient-to-r ${primaryColor === 'purple' ? 'from-purple-400 to-pink-600' : 'from-blue-400 to-green-600'}`}>Web3 Social</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Kiến tạo Vũ trụ Phi tập trung cho Sáng tạo, Kết nối và Kinh tế Mở trên Pi Network.
        </p>
        
        {status !== "connected" ? (
             <button
                onClick={authenticate} 
                className={`px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all transform hover:scale-105 ${primaryColorClasses[primaryColor]}`}
             >
                {status === "loading" ? "Đang kết nối..." : "Kết nối với Pi Network"}
             </button>
        ) : (
            <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <p className="text-xl font-semibold">Xin chào, @{user?.username}!</p>
                    <p className="text-sm opacity-70">UID: {user?.uid.substring(0, 8)}...</p>
                </div>
            </div>
        )}
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 w-full max-w-6xl">
        <FeatureCard 
            icon={<Video className="w-8 h-8 text-blue-500"/>}
            title="Sáng tạo Video AI"
            description="Biên tập thông minh, hiệu ứng AI và tối ưu hóa nội dung tự động."
        />
        <FeatureCard 
            icon={<ShoppingBag className="w-8 h-8 text-green-500"/>}
            title="Thương mại Phi tập trung"
            description="Mua bán sản phẩm bằng Pi Coin an toàn với Smart Contract."
        />
        <FeatureCard 
            icon={<Gamepad2 className="w-8 h-8 text-purple-500"/>}
            title="GameFi & Play-to-Earn"
            description="Chơi game, kiếm thưởng và giải trí không giới hạn."
        />
        <FeatureCard 
            icon={<Users className="w-8 h-8 text-orange-500"/>}
            title="Cộng đồng & Kết nối"
            description="Mạng xã hội đích thực với tính năng Livestream tương tác."
        />
      </div>

       {/* Theme Color Picker Demo */}
       <div className="mt-20 flex flex-col items-center gap-4">
           <h3 className="flex items-center gap-2 text-lg font-semibold"><Palette size={20}/> Tùy chỉnh Giao diện</h3>
           <div className="flex gap-4">
               {(['blue', 'purple', 'green', 'orange', 'pink'] as const).map((color) => (
                   <button
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${color === primaryColor ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                        style={{ backgroundColor: `var(--color-${color}-600, ${getColorHex(color)})` }}
                   />
               ))}
           </div>
       </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-sm"
        >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </motion.div>
    )
}

function getColorHex(color: string) {
    switch(color) {
        case 'blue': return '#2563eb';
        case 'purple': return '#9333ea';
        case 'green': return '#16a34a';
        case 'orange': return '#ea580c';
        case 'pink': return '#db2777';
        default: return '#9333ea';
    }
}
