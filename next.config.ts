import type { NextConfig } from "next"

// Parse allowed origins from env var (comma-separated).
const parseAllowedOrigins = (): string[] => {
  const raw = process.env.ALLOWED_ORIGINS || ""
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const isProd = process.env.NODE_ENV === "production"
  if (isProd) {
    // In production, ignore wildcards and localhost-like entries for safety.
    return list.filter(
      (o) => !o.includes("*") && !/localhost|127\.0\.0\.1|0\.0\.0\.0/.test(o)
    )
  }

  // In dev, fall back to common localhost origins if none provided.
  return list.length > 0
    ? list
    : ["http://localhost:3000", "http://127.0.0.1:3000", "https://dim.dev.anpd.gov.br"]
}

const nextConfig: NextConfig = {
  transpilePackages: ["@anpdgovbr/shared-ui"],
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: parseAllowedOrigins(),
    },
  },
}

export default nextConfig
