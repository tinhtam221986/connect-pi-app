import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a basic browser fingerprint for device identification.
 * Note: This is a client-side approximation for the PWA environment where IMEI is inaccessible.
 */
export function getBrowserFingerprint(): string {
  if (typeof window === 'undefined') return 'server-side';

  const { userAgent, language, platform } = window.navigator;
  const { width, height, colorDepth, pixelDepth } = window.screen;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Create a raw string of device characteristics
  const rawFingerprint = [
    userAgent,
    language,
    platform,
    `${width}x${height}`,
    `${colorDepth}`,
    `${pixelDepth}`,
    timezone
  ].join('||');

  // Simple hash function (DJB2 variant) to create a shorter string ID
  let hash = 5381;
  for (let i = 0; i < rawFingerprint.length; i++) {
    hash = (hash * 33) ^ rawFingerprint.charCodeAt(i);
  }

  // Return hex string (positive)
  return (hash >>> 0).toString(16);
}
