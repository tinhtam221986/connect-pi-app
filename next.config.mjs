/** @type {import('next').NextConfig} */
const nextConfig = {
  // Đã xóa phần env, chỉ giữ lại phần images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;