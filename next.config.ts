import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/webp'],
  },
};

export default nextConfig;
