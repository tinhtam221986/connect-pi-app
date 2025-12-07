"use client";

import React, { useState, useEffect } from 'react';

export function VideoFeed() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    // Dữ liệu giả lập cho Feed
    setVideos([1, 2, 3]); 
  }, []);

  return (
    <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center relative overflow-y-scroll snap-y snap-mandatory">
      {videos.map((v, i) => (
        <div key={i} className="w-full h-[100dvh] snap-start flex items-center justify-center border-b border-gray-800 relative bg-gradient-to-br from-gray-900 to-black">
          <div className="text-center">
             <h2 className="text-2xl font-bold mb-2">Connect Video #{i + 1}</h2>
             <p className="text-sm opacity-60">Vuốt để xem tiếp (TikTok Style)</p>
          </div>
        </div>
      ))}
      {videos.length === 0 && (
          <div className="flex items-center justify-center h-full">
              Loading Feed...
          </div>
      )}
    </div>
  );
}
