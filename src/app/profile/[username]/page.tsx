import React from 'react';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl">Profile Page for <span className="font-bold text-yellow-400">@{params.username}</span></h1>
      <div className="mt-4">
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white">
          Nhắn tin
        </button>
      </div>
    </div>
  );
}
