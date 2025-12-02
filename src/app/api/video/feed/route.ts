import { NextResponse } from 'next/server';

const VIDEOS = [
  {
    id: 1,
    user: { username: "Alice_Crypto", avatar: "https://placehold.co/100x100/purple/white?text=A" },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Building on Pi Network is amazing! #PiNetwork #Web3",
    likes: 1200,
    comments: 45,
    shares: 12,
    language: "en"
  },
  {
      id: 2,
      user: { username: "Minh_Pi", avatar: "https://placehold.co/100x100/green/white?text=M" },
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
      description: "Hướng dẫn KYC Pi Network mới nhất 2024. #PiKYC #VietNam",
      likes: 3400,
      comments: 120,
      shares: 300,
      language: "vi"
  },
  {
      id: 3,
      user: { username: "Connect_Official", avatar: "https://placehold.co/100x100/blue/white?text=C" },
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "Welcome to CONNECT - The future of SocialFi on Pi. #Connect #SocialFi",
      likes: 10000,
      comments: 999,
      shares: 5000,
      language: "en"
  }
];

export async function GET(request: Request) {
    return NextResponse.json({ success: true, videos: VIDEOS });
}
