import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  output: 'standalone',
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // YENİ EKLENEN SATIR:
  allowedDevOrigins: ['10.0.0.35', 'localhost:3000'], 
};

export default nextConfig;