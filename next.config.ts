import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /**
   * Transpila pacotes compartilhados (ex: shared-ui)
   */
  transpilePackages: ["@anpdgovbr/shared-ui"],

  /**
   * Ativa checagens de renderização seguras
   */
  reactStrictMode: true,

  /**
   * Gera build otimizado para produção
   * - Cria pasta `.next/standalone` com todos os deps necessários
   * - Ideal para execução via PM2, Docker ou ambientes isolados
   */
  output: "standalone",

  /**
   * Remove logs redundantes no build
   */
  poweredByHeader: false,

  /**
   * Permite build com variáveis locais de .env.* (Next 15+ já faz isso por padrão)
   */
  typedRoutes: true, // segurança extra em rotas
  experimental: {
    optimizeCss: true, // melhora tempo de build e performance
    scrollRestoration: true, // UX consistente entre páginas
  },
}

export default nextConfig

// ...existing code...
// --- Adicionado automaticamente pelo deploy.sh (ANPD) ---

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports.outputFileTracingRoot = __dirname
}
