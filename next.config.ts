import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src"], // Garantindo que o ESLint veja a pasta correta
    ignoreDuringBuilds: false, // Força a execução do ESLint durante builds
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "http://hml-dim.anpd.gov.br", // Permite HTTP
        "https://hml-dim.anpd.gov.br", // Permite HTTPS
        "http://localhost:3000", // Permite Localhost
        "https://10.120.10.170:3000", // Permite IP
      ],
    },
  },
  // Configurações de segurança para evitar warnings TLS em desenvolvimento
  ...(process.env.NODE_ENV === "development" && {
    webpack: (config: any) => {
      // Permite certificados auto-assinados apenas em desenvolvimento
      config.resolve.fallback = {
        ...config.resolve.fallback,
        tls: false,
        net: false,
        fs: false,
      }
      return config
    },
  }),
}

export default nextConfig
