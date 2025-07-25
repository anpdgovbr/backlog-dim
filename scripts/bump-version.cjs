const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Caminho absoluto do package.json
const packagePath = path.resolve(__dirname, "../package.json")
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"))

// Quebra a versão atual em partes
const [major, minor, patch] = pkg.version.split(".").map(Number)

// Incrementa o patch
const newVersion = `${major}.${minor}.${patch + 1}`
pkg.version = newVersion

// Escreve de volta no mesmo lugar com quebra de linha no final
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n")

console.log(`✅ Versão atualizada para: ${newVersion}`)

// Gera o version.json automaticamente
try {
  execSync("node ./scripts/generate-version.cjs", { stdio: "inherit" })
} catch (error) {
  console.log("⚠️  Erro ao gerar version.json:", error.message)
}
