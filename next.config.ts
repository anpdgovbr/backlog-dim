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
  // Rewrites para servir favicons 16/32 apontando para o arquivo existente
  // `public/favicon.ico`. Isso evita 404 quando browsers pedem as imagens
  // padrão sem precisar criar arquivos separados.
  async rewrites() {
    return [
      { source: "/favicon-16x16.png", destination: "/favicon.ico" },
      { source: "/favicon-32x32.png", destination: "/favicon.ico" },
    ]
  },
}

export default nextConfig
