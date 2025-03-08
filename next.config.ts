import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src"] // Garantindo que o ESLint veja a pasta correta
  },
  experimental: {
    serverActions: { allowedOrigins: [] } // Ajuste adequado para experimental
  }
}

export default nextConfig
