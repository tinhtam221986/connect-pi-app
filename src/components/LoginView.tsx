"use client";

import { usePi } from "@/components/pi/pi-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoginView() {
  const { authenticate, isInitialized, error } = usePi();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          CONNECT
        </h1>
        <p className="text-gray-400 text-lg">Web3 Video Social Network on Pi</p>
      </div>

      <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400">
            Login to explore the world of decentralized video.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={() => authenticate()}
            disabled={!isInitialized}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 text-lg transition-all duration-200"
          >
            {isInitialized ? (
              "Login with Pi"
            ) : (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading SDK...
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By connecting, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
