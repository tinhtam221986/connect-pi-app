/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
       {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
      },
    ],
  },
  // Ensure env vars are passed to the client if needed (though mostly server side)
  // Cleaned up to avoid hard-coding secrets. Server-side vars are read from process.env automatically.
  env: {
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
    // Sensitive keys removed to enforce runtime usage
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
