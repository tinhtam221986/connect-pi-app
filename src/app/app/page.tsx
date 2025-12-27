"use client";

import { VideoFeed } from '@/components/feed/VideoFeed';

// This is the new main page for the authenticated app.
// It sits inside the AppLayout and is responsible for rendering the VideoFeed.
export default function AppPage() {
  return <VideoFeed />;
}
