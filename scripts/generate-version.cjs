const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Caminhos
const packagePath = path.resolve(__dirname, "../package.json")
const versionJsonPath = path.resolve(__dirname, "../public/version.json")

// Lê o package.json
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"))

// Obtém informações do Git (se disponível)
let gitInfo = {}
try {
  const gitCommit = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim()
  const gitBranch = execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf-8",
  }).trim()
  const gitCommitShort = gitCommit.substring(0, 7)

  gitInfo = {
    commit: gitCommit,
    commitShort: gitCommitShort,
    branch: gitBranch,
  }
} catch (error) {
  console.log("⚠️  Informações do Git não disponíveis:", error.message)
}

// Cria o objeto de versão
const versionInfo = {
  name: pkg.name,
  version: pkg.version,
  buildTime: new Date().toISOString(),
  buildTimestamp: Date.now(),
  environment: process.env.NODE_ENV || "development",
  ...gitInfo,
}

// Garante que o diretório public existe
const publicDir = path.dirname(versionJsonPath)
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Escreve o version.json
fs.writeFileSync(versionJsonPath, JSON.stringify(versionInfo, null, 2) + "\n")

console.log(`✅ version.json gerado em: ${versionJsonPath}`)
console.log(`📦 Versão: ${versionInfo.version}`)
console.log(`🕒 Build: ${versionInfo.buildTime}`)
if (gitInfo.commit) {
  console.log(`🌿 Branch: ${gitInfo.branch}`)
  console.log(`📝 Commit: ${gitInfo.commitShort}`)
}
