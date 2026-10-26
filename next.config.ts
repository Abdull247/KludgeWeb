import type { NextConfig } from "next";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://kludgeserver.onrender.com").replace(/\/$/, "");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.monkeycode-ai.live"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Android has a tiny inotify limit, so poll instead of using native watchers
      config.watchOptions = {
        poll: 1500,
        aggregateTimeout: 500,
        ignored: ["**/node_modules/**", "**/.next/**", "**/.git/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
