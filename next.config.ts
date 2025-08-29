import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@anpdgovbr/shared-ui"],
  reactStrictMode: true,
}

export default nextConfig
