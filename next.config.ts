import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.lummi.ai",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // cacheComponents: true,
};

export default nextConfig;
