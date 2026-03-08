import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    webpackBuildWorker: false
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config) => {
    // OneDrive-backed workspaces can intermittently lose cache/chunk artifacts.
    // Keep webpack outputs in memory to avoid ENOENT and MODULE_NOT_FOUND churn.
    config.cache = false;

    return config;
  }
};

export default nextConfig;
