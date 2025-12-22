/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
      R2_ENDPOINT: process.env.R2_ENDPOINT,
      R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
    },
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
