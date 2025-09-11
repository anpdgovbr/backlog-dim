const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Caminho absoluto do package.json
const packagePath = path.resolve(__dirname, "../package.json")
const pkgRaw = fs.readFileSync(packagePath, "utf-8")
const pkg = JSON.parse(pkgRaw)

// Quebra a versão atual em partes
const [major, minor, patch] = String(pkg.version)
  .split(".")
  .map((n) => Number(n))

if (!Number.isFinite(major) || !Number.isFinite(minor) || !Number.isFinite(patch)) {
  console.error("❌ Versão inválida no package.json. Formato esperado: x.y.z")
  process.exit(1)
}

// Incrementa o patch
const newVersion = `${major}.${minor}.${patch + 1}`
pkg.version = newVersion

// Persiste o package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n")
console.log(`✅ Versão atualizada para: ${newVersion}`)

// Sincroniza package-lock.json (se existir) para evitar erro no CI
try {
  const lockPath = path.resolve(__dirname, "../package-lock.json")
  if (fs.existsSync(lockPath)) {
    const lockRaw = fs.readFileSync(lockPath, "utf-8")
    const lock = JSON.parse(lockRaw)
    // Atualiza a versão no topo e na entrada raiz de packages
    if (typeof lock.version === "string") lock.version = newVersion
    if (lock.packages && lock.packages[""] && typeof lock.packages[""] === "object") {
      lock.packages[""].version = newVersion
    }
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n")
    console.log("🔄 package-lock.json sincronizado com a nova versão")
  }
} catch (error) {
  console.log("⚠️  Não foi possível sincronizar o package-lock.json:", error.message)
}

// Gera o version.json automaticamente com base na nova versão
try {
  execSync("node ./scripts/generate-version.cjs", { stdio: "inherit" })
} catch (error) {
  console.log("⚠️  Erro ao gerar version.json:", error.message)
}

// Adiciona os arquivos ao índice para entrarem no MESMO commit do usuário
try {
  // Sempre adiciona o package.json
  execSync("git add package.json", { stdio: "inherit" })

  // Adiciona package-lock.json se existir
  try {
    const lockPath = path.resolve(__dirname, "../package-lock.json")
    if (fs.existsSync(lockPath)) {
      execSync("git add package-lock.json", { stdio: "inherit" })
      console.log("📄 package-lock.json adicionado ao commit")
    }
  } catch (err) {
    console.log(
      "⚠️  Falha ao adicionar package-lock.json:",
      (err && err.message) || String(err)
    )
  }

  // Só adiciona version.json se não estiver ignorado
  let isIgnored = false
  try {
    execSync("git check-ignore -q -- public/version.json")
    isIgnored = true
  } catch {
    isIgnored = false
  }

  if (!isIgnored) {
    execSync("git add public/version.json", { stdio: "inherit" })
    console.log("📄 Arquivos adicionados ao commit: package.json e public/version.json")
  } else {
    console.log(
      "ℹ️ public/version.json está ignorado no .gitignore; apenas package.json será commitado."
    )
  }
} catch (error) {
  console.log("⚠️  Erro ao adicionar arquivos ao git:", error.message)
  // Não falha o commit — segue apenas com o que foi adicionado
}
