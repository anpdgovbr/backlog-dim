const fs = require('fs')
const path = require('path')

const isVerbose = process.argv.includes('--verbose')
const log = (message, type = 'info') => {
  if (!isVerbose && type !== 'error') return
  const logFn = type === 'error' ? console.error : console.warn
  logFn(message)
}

const getRoutes = (dir, baseUrl = '') => {
  log(`📂 Lendo diretório: ${dir}`, 'info')
  let routes = []
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    log(`📄 Arquivos encontrados: ${files.length}`, 'info')
    for (const file of files) {
      const fullPath = path.join(dir, file.name)
      const routePath = `${baseUrl}/${file.name.replace(/\.tsx?$/, '')}`
      if (file.isDirectory()) {
        if (!['node_modules', '.git', 'public'].includes(file.name)) {
          log(`🔍 Entrando em: ${fullPath}`, 'info')
          routes = routes.concat(getRoutes(fullPath, routePath))
        }
      } else if (file.name === 'page.tsx' || file.name === 'route.ts') {
        routes.push(baseUrl.replace('/src/app', '').replace('/route', ''))
        log(`✅ Adicionando rota: ${routePath}`, 'info')
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao ler ${dir}:`, error)
  }
  return routes
}

const pagesDir = path.join(process.cwd(), 'src', 'app')
const apiDir = path.join(pagesDir, 'api')

if (!isVerbose) console.warn('🔎 Gerando rotas de desenvolvimento...')
else console.warn('🔎 Buscando páginas e APIs (modo verbose)...')

const pages = getRoutes(pagesDir).filter((r) => !r.includes('/api'))
const apis = getRoutes(apiDir)

const devRoutes = { pages, apis }
const outputPath = path.join(process.cwd(), 'public', 'dev-routes.json')

try {
  fs.writeFileSync(outputPath, JSON.stringify(devRoutes, null, 2))
  console.warn(`✅ Rotas geradas: ${pages.length} páginas, ${apis.length} APIs${isVerbose ? ` → ${outputPath}` : ''}`)
} catch (error) {
  console.error('❌ Erro ao escrever JSON:', error)
}

