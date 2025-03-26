import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src"], // Garantindo que o ESLint veja a pasta correta
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "http://hml-dim.anpd.gov.br", // Permite HTTP
        "https://hml-dim.anpd.gov.br", // Permite HTTPS
        "http://localhost:3000", // Permite Localhost
        "https://10.120.10.170:3000", // Permite IP
      ],
    }, // Ajuste adequado para experimental
  },
}

export default nextConfig
