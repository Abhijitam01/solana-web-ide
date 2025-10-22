/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  experimental: {
    serverComponentsExternalPackages: ['@solana/web3.js', '@coral-xyz/anchor'],
  },
};

export default nextConfig;
