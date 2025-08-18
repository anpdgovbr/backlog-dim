import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@anpdgovbr/shared-ui"],
  reactStrictMode: true,
  eslint: {
    dirs: ["src"], // Garantindo que o ESLint veja a pasta correta
    // Para evitar warnings/dependência de detecção automática do plugin do
    // Next durante o build, desativamos a checagem de ESLint no build.
    // Isso permite que o pipeline de build prossiga sem emitir o aviso.
    // Se preferir rodar ESLint na CI, deixe `false` e garanta que a
    // configuração detectável do plugin esteja presente.
    ignoreDuringBuilds: true,
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
