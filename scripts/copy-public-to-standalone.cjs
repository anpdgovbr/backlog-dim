/**
 * Script para copiar arquivos públicos para o build standalone do Next.js
 *
 * Quando usamos `output: "standalone"` no next.config.ts, o Next.js cria
 * uma pasta .next/standalone otimizada, mas NÃO copia automaticamente
 * os arquivos da pasta public/. Este script faz essa cópia.
 *
 * Deve ser executado após `next build`.
 */

const fs = require("fs")
const path = require("path")

// Caminhos
const publicDir = path.resolve(__dirname, "../public")
const standalonePublicDir = path.resolve(__dirname, "../.next/standalone/public")

/**
 * Copia recursivamente um diretório
 */
function copyRecursive(src, dest) {
  // Garante que o destino existe
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  // Lê o diretório fonte
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      // Recursão para subdiretórios
      copyRecursive(srcPath, destPath)
    } else {
      // Copia arquivo
      fs.copyFileSync(srcPath, destPath)
      console.log(`  ✓ ${entry.name}`)
    }
  }
}

console.log("📦 Copiando arquivos públicos para build standalone...")
console.log(`   Origem: ${publicDir}`)
console.log(`   Destino: ${standalonePublicDir}`)
console.log()

try {
  // Verifica se a pasta standalone existe
  if (!fs.existsSync(path.dirname(standalonePublicDir))) {
    console.error("❌ Pasta .next/standalone não encontrada!")
    console.error("   Execute 'npm run build' primeiro.")
    process.exit(1)
  }

  // Verifica se public existe
  if (!fs.existsSync(publicDir)) {
    console.warn("⚠️  Pasta public/ não encontrada, nada a copiar.")
    process.exit(0)
  }

  // Copia os arquivos
  copyRecursive(publicDir, standalonePublicDir)

  console.log()
  console.log("✅ Arquivos públicos copiados com sucesso!")
} catch (error) {
  console.error("❌ Erro ao copiar arquivos:", error.message)
  process.exit(1)
}
