"use client";

import { usePi } from "@/components/pi/pi-provider";
import { PiNetworkStatus } from "@/components/pi/PiNetworkStatus";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginView() {
  const { authenticate, isInitialized, error } = usePi();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!isInitialized) return;
    setIsLoggingIn(true);
    await authenticate();
    setIsLoggingIn(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      <PiNetworkStatus />
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          CONNECT
        </h1>
        <p className="text-gray-400 text-lg">Web3 Video Social Network on Pi</p>
      </div>

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 text-white shadow-2xl rounded-lg overflow-hidden">
        <div className="p-6 text-center">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Welcome Back</h3>
          <p className="text-sm text-gray-400 mt-2">
            Login to explore the world of decentralized video.
          </p>
        </div>
        <div className="p-6 pt-0 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm break-words">
              {error}
            </div>
          )}

          <button 
            onClick={handleLogin}
            disabled={!isInitialized || isLoggingIn}
            className="inline-flex items-center justify-center rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all duration-200"
            style={{ height: '3.5rem', fontSize: '1.125rem' }}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : !isInitialized ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading SDK...
              </>
            ) : (
              "Login with Pi"
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By connecting, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
