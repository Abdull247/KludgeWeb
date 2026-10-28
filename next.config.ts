import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // <--- This tells Next.js to create the 'out' folder
  allowedDevOrigins: ["*.monkeycode-ai.live"],
  webpack: (config, { dev }) => {
    if (dev) {
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