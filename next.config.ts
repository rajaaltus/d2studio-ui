import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Subnet wildcard, not fixed IPs — DHCP reassigns these on every reconnect.
  allowedDevOrigins: ["192.168.0.*", "192.168.1.*", "*.local"],
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
