/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.r2.dev',
        },
        {
          protocol: 'https',
          hostname: '**.r2.cloudflarestorage.com',
        },
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
          hostname: 'pbs.twimg.com',
        },
      ],
    },
};

export default nextConfig;
