import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/tongshifu",
  assetPrefix: "/tongshifu/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
