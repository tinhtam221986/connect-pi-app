"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePi } from '@/components/pi/pi-provider';
import LoginView from '@/components/LoginView';

export default function HomePage() {
  const { user, isInitialized } = usePi();
  const router = useRouter();

  useEffect(() => {
    // As soon as the user object is available and the SDK is initialized,
    // we fire the redirect.
    if (user && isInitialized) {
      router.replace('/app');
    }
  }, [user, isInitialized, router]);

  // While the SDK is initializing, we can show a loading spinner.
  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-2">Initializing Pi SDK...</p>
      </div>
    );
  }

  // If we are initialized and there is no user, it's safe to show the LoginView.
  // The useEffect above will handle the redirect as soon as the user logs in.
  // This avoids showing a "Redirecting..." flash for authenticated users.
  return <LoginView />;
}
