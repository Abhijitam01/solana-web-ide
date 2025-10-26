/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  outputFileTracingRoot: '/home/abhijitam/Desktop/solana-web',
  experimental: {
    turbo: {
      root: '/home/abhijitam/Desktop/solana-web/apps/web'
    }
  }
};

export default nextConfig;
