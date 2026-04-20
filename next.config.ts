import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
