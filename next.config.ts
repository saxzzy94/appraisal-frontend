import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloud.funda.nl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.funda.nl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.pararius.nl',
        pathname: '/**',
      },
      // Add more domains as needed
    ],
  },
};

export default nextConfig;
