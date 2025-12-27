"use client";

import React from 'react';

interface MockupPageProps {
  title: string;
}

const MockupPage: React.FC<MockupPageProps> = ({ title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white bg-black/50">
      <div className="text-center p-8 border border-white/20 rounded-lg bg-black/30 backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-white/70">Tính năng đang được phát triển</p>
      </div>
    </div>
  );
};

export default MockupPage;
