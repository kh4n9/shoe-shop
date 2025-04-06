import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // allow images from all domains
  images: {
    remotePatterns: [
      { hostname: "media.discordapp.net" },
      { hostname: "cdn.discordapp.com" },
      { hostname: "flowbite.com" },
    ],
  },
};

export default nextConfig;
