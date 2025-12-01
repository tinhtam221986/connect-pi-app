"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import { usePi } from "@/components/pi/pi-provider"

export function PiConnect() {
  const { authenticate, isAuthenticated, isInitialized, user, error } = usePi()
  const isLoading = !isInitialized && !error

  if (isAuthenticated && user) {
    return (
      <Alert className="border-green-500/50 bg-green-500/10 text-green-500">
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>Pi Wallet Connected</AlertTitle>
        <AlertDescription>
          Authenticated as <span className="font-mono font-bold">@{user.username}</span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full bg-gradient-to-r from-purple-900/10 to-blue-900/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-purple-600" />
            Connect Pi Network
        </CardTitle>
        <CardDescription>
          Link your Pi Wallet to unlock earning features, NFTs, and tipping.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        <Button 
            className="w-full bg-[#5d2f8e] hover:bg-[#4a2571] text-white font-bold"
            onClick={authenticate}
            disabled={!isInitialized}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Pi SDK...
            </>
          ) : (
            "Authenticate with Pi Browser"
          )}
        </Button>
        <p className="text-[10px] text-center mt-3 text-muted-foreground">
          By connecting, you agree to our Terms & Privacy Policy compliant with GDPR & Pi Core Team guidelines.
        </p>
      </CardContent>
    </Card>
  )
}
