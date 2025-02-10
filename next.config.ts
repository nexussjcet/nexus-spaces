import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark onnxruntime-node as external to prevent webpack from trying to bundle it
      config.externals.push({
        'onnxruntime-node': 'commonjs onnxruntime-node'
      });
    }
    return config;
  }
};

export default nextConfig;
