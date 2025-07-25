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

// Adiciona o package.json ao git antes de gerar o version.json
try {
  execSync("git add package.json", { stdio: "inherit" })
  console.log("📄 package.json adicionado ao git")
} catch (error) {
  console.log("⚠️  Erro ao adicionar package.json ao git:", error.message)
}

// Gera o version.json automaticamente (agora vai incluir as mudanças do package.json)
try {
  execSync("node ./scripts/generate-version.cjs", { stdio: "inherit" })
} catch (error) {
  console.log("⚠️  Erro ao gerar version.json:", error.message)
}

// Adiciona o version.json ao git e faz o commit
try {
  execSync("git add public/version.json", { stdio: "inherit" })
  execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: "inherit" })
  console.log(`🚀 Commit realizado: versão ${newVersion}`)
} catch (error) {
  console.log("⚠️  Erro ao fazer commit:", error.message)
  console.log("💡 Execute manualmente: git add . && git commit -m \"chore: bump version to " + newVersion + "\"")
}
