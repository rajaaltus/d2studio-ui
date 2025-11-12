import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow server components to make external requests
  serverExternalPackages: ["convex"],
  // Add environment variables for server-side rendering
  env: {
    CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
