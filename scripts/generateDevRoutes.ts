import fs from "fs"
import path from "path"

const getRoutes = (dir: string, baseUrl = ""): string[] => {
  console.warn(`📂 Lendo diretório: ${dir}`) // Log de cada diretório acessado

  let routes: string[] = []

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true })

    console.warn(`📄 Arquivos encontrados: ${files.length}`)

    for (const file of files) {
      const fullPath = path.join(dir, file.name)
      const routePath = `${baseUrl}/${file.name.replace(/\.tsx?$/, "")}`

      if (file.isDirectory()) {
        // Evita recursão infinita ignorando `node_modules`, `.git`, `public`
        if (!["node_modules", ".git", "public"].includes(file.name)) {
          console.warn(`🔍 Entrando em: ${fullPath}`)
          routes = [...routes, ...getRoutes(fullPath, routePath)]
        }
      } else if (file.name === "page.tsx" || file.name === "route.ts") {
        routes.push(baseUrl.replace("/src/app", "").replace("/route", ""))
        console.warn(`✅ Adicionando rota: ${routePath}`)
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao ler ${dir}:`, error)
  }

  return routes
}

// Diretórios do Next.js
const pagesDir = path.join(process.cwd(), "src", "app")
const apiDir = path.join(pagesDir, "api")

console.warn("🔎 Buscando páginas e APIs...")

// Obtendo as rotas
const pages = getRoutes(pagesDir).filter((r) => !r.includes("/api"))
const apis = getRoutes(apiDir)

// Criando JSON com as rotas
const devRoutes = { pages, apis }
const outputPath = path.join(process.cwd(), "public", "dev-routes.json")

try {
  fs.writeFileSync(outputPath, JSON.stringify(devRoutes, null, 2))
  console.warn("✅ JSON de rotas gerado com sucesso:", outputPath)
} catch (error) {
  console.error("❌ Erro ao escrever JSON:", error)
}
