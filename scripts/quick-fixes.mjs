#!/usr/bin/env node
/**
 * Script rápido para corrigir problemas comuns detectados pelo ESLint
 */
import fs from "fs"
import { glob } from "glob"

const fixes = [
  // Corrigir imports MUI com desestruturação
  {
    pattern: /import\s+{\s*([^}]+)\s*}\s+from\s+['"]@mui\/material['"]/g,
    replacement: (match, imports) => {
      const importList = imports.split(",").map((imp) => imp.trim())
      return importList
        .map((imp) => {
          const cleanName = imp.split(" as ")[0].trim()
          return `import ${imp} from '@mui/material/${cleanName}'`
        })
        .join("\n")
    },
  },

  // Corrigir React não definido
  {
    pattern: /^(?!.*import.*React)(.*)export default function/gm,
    replacement: (match, content) => {
      if (content.includes("React.")) {
        return `import React from 'react'\n${match}`
      }
      return match
    },
  },

  // Corrigir variáveis não utilizadas com underscore
  {
    pattern: /(\w+)\s*=>\s*{/g,
    replacement: (match, param) => {
      if (param.includes("_")) return match
      return match.replace(param, `_${param}`)
    },
  },
]

async function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8")
    let hasChanges = false

    for (const fix of fixes) {
      const newContent = content.replace(fix.pattern, fix.replacement)
      if (newContent !== content) {
        content = newContent
        hasChanges = true
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, "utf8")
      console.log(`✅ Corrigido: ${filePath}`)
      return true
    }

    return false
  } catch (error) {
    console.error(`❌ Erro em ${filePath}:`, error.message)
    return false
  }
}

async function main() {
  console.log("🔧 Aplicando correções rápidas...")

  const files = await glob("src/**/*.{ts,tsx}", {
    ignore: ["node_modules/**", ".next/**"],
  })

  let fixed = 0
  for (const file of files) {
    if (await fixFile(file)) {
      fixed++
    }
  }

  console.log(`\n📊 Resumo: ${fixed} arquivos corrigidos de ${files.length} processados`)
}

main().catch(console.error)
