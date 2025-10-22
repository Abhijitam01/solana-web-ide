/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  serverExternalPackages: ['@solana/web3.js', '@coral-xyz/anchor'],
  transpilePackages: ['@solana/web3.js', '@coral-xyz/anchor'],
  experimental: {
    turbopack: {
      root: '/home/abhijitam/Desktop/solana-web/apps/web'
    }
  }
};

export default nextConfig;
