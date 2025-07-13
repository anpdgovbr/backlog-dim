const fs = require("fs")
const path = require("path")

const packageJson = require("../package.json")
const version = packageJson.version ?? "0.0.0"
const envPath = path.resolve(__dirname, "../.env.local")

// Define ou atualiza a variável de ambiente
fs.writeFileSync(envPath, `NEXT_PUBLIC_APP_VERSION=${version}\n`)
console.log(`✅ Versão ${version} gravada em .env.local`)
