const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Obter o tipo de bump da linha de comando (padrão: patch)
const bumpType = process.argv[2] || "patch"

// Validar o tipo de bump
if (!["patch", "minor", "major"].includes(bumpType)) {
  console.error("❌ Tipo de bump inválido. Use: patch, minor ou major")
  process.exit(1)
}

// Caminho absoluto do package.json
const packagePath = path.resolve(__dirname, "../package.json")
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"))

// Quebra a versão atual em partes
const [major, minor, patch] = pkg.version.split(".").map(Number)

// Incrementa baseado no tipo
let newVersion
switch (bumpType) {
  case "major":
    newVersion = `${major + 1}.0.0`
    break
  case "minor":
    newVersion = `${major}.${minor + 1}.0`
    break
  case "patch":
  default:
    newVersion = `${major}.${minor}.${patch + 1}`
    break
}

// Atualiza a versão no package.json
pkg.version = newVersion
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2))

console.log(`✅ Versão atualizada para: ${newVersion}`)

// Gera o version.json automaticamente
try {
  execSync("node ./scripts/generate-version.cjs", { stdio: "inherit" })
} catch (error) {
  console.log("⚠️  Erro ao gerar version.json:", error.message)
}

// Faz o commit apenas uma vez com todos os arquivos
try {
  execSync("git add package.json public/version.json")
  execSync(`git commit -m "bump: versão ${newVersion}"`)
  console.log("✅ Commit realizado com sucesso")
} catch (error) {
  console.log("⚠️  Erro no commit:", error.message)
}
// Escreve de volta no mesmo lugar com quebra de linha no final
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n")

console.log(`✅ Versão atualizada para: ${newVersion} (${bumpType})`)

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

// Adiciona AMBOS os arquivos ao git ANTES do commit
try {
  execSync("git add package.json public/version.json", { stdio: "inherit" })
  console.log("📄 Arquivos adicionados ao git: package.json e version.json")
} catch (error) {
  console.log("⚠️  Erro ao adicionar arquivos ao git:", error.message)
}

// Faz o commit com ambos os arquivos
try {
  execSync(`git commit -m "chore: bump ${bumpType} version to ${newVersion}"`, {
    stdio: "inherit",
  })
  console.log(`🚀 Commit realizado: versão ${newVersion}`)

  // Pergunta se quer criar uma tag
  console.log(
    `💡 Para criar uma tag, execute: git tag v${newVersion} && git push origin v${newVersion}`
  )
} catch (error) {
  console.log("⚠️  Erro ao fazer commit:", error.message)
  console.log(
    '💡 Execute manualmente: git add . && git commit -m "chore: bump ' +
      bumpType +
      " version to " +
      newVersion +
      '"'
  )
}
