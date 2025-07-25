#!/usr/bin/env node
/**
 * Script de desenvolvimento HTTPS
 * Este script é uma versão melhorada do server.js para desenvolvimento HTTPS
 *
 * NOTA: O server.js original usa IP específico (10.120.10.170) registrado no Entra ID
 * Este script pode ser adaptado para diferentes IPs conforme necessário
 */
import fs from "fs"
import { createServer } from "https"
import { parse } from "url"

import next from "next"

// Configuração específica para desenvolvimento
const isDevelopment = process.env.NODE_ENV !== "production"

if (isDevelopment) {
  // Suprimir warnings TLS apenas em desenvolvimento
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  console.log("🔒 TLS warnings suprimidos para desenvolvimento local")
  console.log("⚠️  ATENÇÃO: Esta configuração é APENAS para desenvolvimento!")
  console.log("📝 Para produção, server.js usa IP específico cadastrado no Entra ID")
}

const app = next({ dev: isDevelopment, turbo: isDevelopment })
const handle = app.getRequestHandler()

// Verificar se os certificados existem
const certFiles = {
  key: "dev-key.pem",
  cert: "dev-cert.pem",
}

const httpsOptions = {}

try {
  httpsOptions.key = fs.readFileSync(certFiles.key)
  httpsOptions.cert = fs.readFileSync(certFiles.cert)
  console.log("✅ Certificados SSL carregados com sucesso")
} catch (error) {
  console.error("❌ Erro ao carregar certificados SSL:", error.message)
  console.log("💡 Execute: npm run generate:certs para gerar certificados")
  process.exit(1)
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, "10.120.10.170", () => {
    console.log("🚀 Next.js rodando com HTTPS e Turbopack")
    console.log("🌐 URL: https://10.120.10.170:3000")
    console.log("📁 Modo: desenvolvimento")
  })
})
