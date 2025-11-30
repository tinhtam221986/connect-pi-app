"use client";

import { usePi } from "@/components/pi/pi-provider";

export default function LoginView() {
  const { authenticate, isInitialized, error } = usePi();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          CONNECT
        </h1>
        <p className="text-gray-400 text-lg">Web3 Video Social Network on Pi</p>
      </div>

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl text-center">
          <h2 className="text-2xl font-bold mb-2 text-white">Welcome Back</h2>
          <p className="text-gray-400 mb-6">Login to explore the world of decentralized video.</p>
          
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm mb-4">
              {error}
            </div>
          )}

          <button 
            onClick={() => authenticate()}
            disabled={!isInitialized}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-gray-400 text-white font-bold py-4 rounded-lg text-lg transition-all duration-200"
          >
            {isInitialized ? "Login with Pi" : "Loading SDK..."}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By connecting, you agree to our Terms of Service.
          </p>
      </div>
    </div>
  );
}
