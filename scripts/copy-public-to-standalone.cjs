/**
 * Script para copiar arquivos públicos e estáticos para o build standalone do Next.js
 *
 * Quando usamos `output: "standalone"` no next.config.ts, o Next.js cria
 * uma pasta .next/standalone otimizada, mas NÃO copia automaticamente:
 * 1. Os arquivos da pasta public/
 * 2. Os assets estáticos da pasta .next/static/
 *
 * Este script faz essas cópias.
 *
 * Deve ser executado após `next build`.
 */

const fs = require("fs")
const path = require("path")

// Caminhos
const publicDir = path.resolve(__dirname, "../public")
const standalonePublicDir = path.resolve(__dirname, "../.next/standalone/public")
const staticDir = path.resolve(__dirname, "../.next/static")
const standaloneStaticDir = path.resolve(__dirname, "../.next/standalone/.next/static")

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
    }
  }
}

console.log("📦 Copiando arquivos para build standalone...")
console.log()

try {
  // Verifica se a pasta standalone existe
  if (!fs.existsSync(path.dirname(standalonePublicDir))) {
    console.error("❌ Pasta .next/standalone não encontrada!")
    console.error("   Execute 'npm run build' primeiro.")
    process.exit(1)
  }

  // 1. Copia public/
  if (fs.existsSync(publicDir)) {
    console.log("📂 Copiando public/ → .next/standalone/public/")
    copyRecursive(publicDir, standalonePublicDir)
    console.log("   ✅ Public copiado")
  } else {
    console.warn("   ⚠️  Pasta public/ não encontrada")
  }

  console.log()

  // 2. Copia .next/static/
  if (fs.existsSync(staticDir)) {
    console.log("📂 Copiando .next/static/ → .next/standalone/.next/static/")
    copyRecursive(staticDir, standaloneStaticDir)
    console.log("   ✅ Static copiado")
  } else {
    console.error("   ❌ Pasta .next/static não encontrada!")
    process.exit(1)
  }

  console.log()
  console.log("✅ Todos os arquivos copiados com sucesso!")
} catch (error) {
  console.error("❌ Erro ao copiar arquivos:", error.message)
  process.exit(1)
}
