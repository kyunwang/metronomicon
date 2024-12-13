import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
    nextScriptWorkers: true,
    reactCompiler: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  redirects: async () => [
    {
      source: "/home",
      destination: "/",
      permanent: true,
    },
  ],
  rewrites: async () => [
    {
      source: "/",
      destination: "/home",
    },
  ],
};

const bundleAnalyzerPlugin = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const NextApp = () => {
  const plugins = [bundleAnalyzerPlugin];
  return plugins.reduce((config, plugin) => plugin(config), nextConfig);
};

export default NextApp;
