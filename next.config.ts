import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { hostname: "zeno.fm" },
      { hostname: "cdn.zenofm.com" },
    ],
  },
};

export default nextConfig;
