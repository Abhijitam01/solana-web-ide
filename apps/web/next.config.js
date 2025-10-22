/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  experimental: {
    turbopack: {
      root: '/home/abhijitam/Desktop/solana-web/apps/web'
    }
  }
};

export default nextConfig;
