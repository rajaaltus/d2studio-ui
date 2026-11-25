import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Subnet wildcard, not fixed IPs — DHCP reassigns these on every reconnect.
  allowedDevOrigins: ["192.168.0.*", "192.168.1.*", "*.local"],
  images: {
    // Keep optimized images cached for 31 days. Site images are static files,
    // so a short TTL only re-runs transformations (billed against the Hobby
    // image limit) without changing the output.
    minimumCacheTTL: 2678400,
    // Only hosts the site actually renders through next/image. A "**" wildcard
    // let anyone use /_next/image as an open optimizer for any URL.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
  async redirects() {
    return [
      {
        source: "/cosma",
        destination: "/cosmo",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
