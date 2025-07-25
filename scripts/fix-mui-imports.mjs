#!/usr/bin/env node
/**
 * Script para migrar automaticamente imports MUI de primeiro nível para imports específicos
 *
 * USO:
 * node scripts/fix-mui-imports.mjs
 *
 * OU para arquivos específicos:
 * node scripts/fix-mui-imports.mjs src/components/**
 */
import fs from "fs"
import { glob } from "glob"

const DRY_RUN = process.argv.includes("--dry-run")

// Mapeamentos comuns de componentes MUI
const MUI_MATERIAL_MAPPINGS = {
  Alert: "@mui/material/Alert",
  AlertTitle: "@mui/material/AlertTitle",
  Avatar: "@mui/material/Avatar",
  Accordion: "@mui/material/Accordion",
  AccordionSummary: "@mui/material/AccordionSummary",
  AccordionDetails: "@mui/material/AccordionDetails",
  AppBar: "@mui/material/AppBar",
  Backdrop: "@mui/material/Backdrop",
  Badge: "@mui/material/Badge",
  Box: "@mui/material/Box",
  Breadcrumbs: "@mui/material/Breadcrumbs",
  Button: "@mui/material/Button",
  Card: "@mui/material/Card",
  CardContent: "@mui/material/CardContent",
  CardActions: "@mui/material/CardActions",
  CardMedia: "@mui/material/CardMedia",
  CardHeader: "@mui/material/CardHeader",
  Checkbox: "@mui/material/Checkbox",
  Chip: "@mui/material/Chip",
  CircularProgress: "@mui/material/CircularProgress",
  Collapse: "@mui/material/Collapse",
  Container: "@mui/material/Container",
  createTheme: "@mui/material/styles/createTheme",
  CssBaseline: "@mui/material/CssBaseline",
  Dialog: "@mui/material/Dialog",
  DialogTitle: "@mui/material/DialogTitle",
  DialogContent: "@mui/material/DialogContent",
  DialogActions: "@mui/material/DialogActions",
  Divider: "@mui/material/Divider",
  Drawer: "@mui/material/Drawer",
  Fade: "@mui/material/Fade",
  FormControl: "@mui/material/FormControl",
  FormControlLabel: "@mui/material/FormControlLabel",
  FormGroup: "@mui/material/FormGroup",
  FormLabel: "@mui/material/FormLabel",
  FormHelperText: "@mui/material/FormHelperText",
  Grid: "@mui/material/Grid",
  IconButton: "@mui/material/IconButton",
  InputLabel: "@mui/material/InputLabel",
  LinearProgress: "@mui/material/LinearProgress",
  Link: "@mui/material/Link",
  List: "@mui/material/List",
  ListItem: "@mui/material/ListItem",
  ListItemText: "@mui/material/ListItemText",
  ListItemIcon: "@mui/material/ListItemIcon",
  ListItemButton: "@mui/material/ListItemButton",
  Menu: "@mui/material/Menu",
  MenuItem: "@mui/material/MenuItem",
  Modal: "@mui/material/Modal",
  Paper: "@mui/material/Paper",
  Radio: "@mui/material/Radio",
  RadioGroup: "@mui/material/RadioGroup",
  Select: "@mui/material/Select",
  Skeleton: "@mui/material/Skeleton",
  Slide: "@mui/material/Slide",
  Snackbar: "@mui/material/Snackbar",
  Stack: "@mui/material/Stack",
  Switch: "@mui/material/Switch",
  Tab: "@mui/material/Tab",
  Tabs: "@mui/material/Tabs",
  TabPanel: "@mui/material/TabPanel",
  Table: "@mui/material/Table",
  TableBody: "@mui/material/TableBody",
  TableCell: "@mui/material/TableCell",
  TableContainer: "@mui/material/TableContainer",
  TableHead: "@mui/material/TableHead",
  TableRow: "@mui/material/TableRow",
  TablePagination: "@mui/material/TablePagination",
  TextField: "@mui/material/TextField",
  ThemeProvider: "@mui/material/styles/ThemeProvider",
  Toolbar: "@mui/material/Toolbar",
  Tooltip: "@mui/material/Tooltip",
  Typography: "@mui/material/Typography",
  useTheme: "@mui/material/styles/useTheme",
  Zoom: "@mui/material/Zoom",
}

function fixMuiImports(content) {
  let modifiedContent = content
  let changes = []

  // Regex para capturar imports do @mui/material
  const muiMaterialRegex = /import\s+{([^}]+)}\s+from\s+['"]@mui\/material['"]/g

  let match
  while ((match = muiMaterialRegex.exec(content)) !== null) {
    const importedItems = match[1].split(",").map((item) => item.trim())
    const newImports = []

    importedItems.forEach((item) => {
      // Remove 'as' aliases para processar
      const cleanItem = item.split(" as ")[0].trim()

      if (MUI_MATERIAL_MAPPINGS[cleanItem]) {
        newImports.push(`import ${item} from '${MUI_MATERIAL_MAPPINGS[cleanItem]}'`)
        changes.push(`${cleanItem} -> ${MUI_MATERIAL_MAPPINGS[cleanItem]}`)
      } else {
        console.warn(`⚠️  Componente MUI não mapeado: ${cleanItem}`)
        // Fallback: tentar criar o import automaticamente
        newImports.push(`import ${item} from '@mui/material/${cleanItem}'`)
        changes.push(`${cleanItem} -> @mui/material/${cleanItem} (auto-gerado)`)
      }
    })

    // Substitui o import original pelos novos imports
    modifiedContent = modifiedContent.replace(match[0], newImports.join("\n"))
  }

  // Regex para capturar imports do @mui/icons-material com destrutucuração
  const muiIconsRegex = /import\s+{([^}]+)}\s+from\s+['"]@mui\/icons-material['"]/g

  while ((match = muiIconsRegex.exec(content)) !== null) {
    const importedItems = match[1].split(",").map((item) => item.trim())
    const newImports = []

    importedItems.forEach((item) => {
      const cleanItem = item.split(" as ")[0].trim()
      newImports.push(`import ${item} from '@mui/icons-material/${cleanItem}'`)
      changes.push(`${cleanItem} (icon) -> @mui/icons-material/${cleanItem}`)
    })

    modifiedContent = modifiedContent.replace(match[0], newImports.join("\n"))
  }

  return { modifiedContent, changes, hasChanges: changes.length > 0 }
}

async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    const { modifiedContent, changes, hasChanges } = fixMuiImports(content)

    if (hasChanges) {
      console.log(`\n📁 ${filePath}`)
      changes.forEach((change) => console.log(`  ✅ ${change}`))

      if (!DRY_RUN) {
        fs.writeFileSync(filePath, modifiedContent, "utf8")
        console.log(`  💾 Arquivo atualizado`)
      } else {
        console.log(`  🔍 (DRY RUN - não foi modificado)`)
      }

      return true
    }

    return false
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message)
    return false
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRunIndex = args.indexOf("--dry-run")

  let pattern = "src/**/*.{ts,tsx}"

  if (dryRunIndex > -1) {
    // Remove --dry-run dos argumentos
    args.splice(dryRunIndex, 1)
  }

  if (args.length > 0) {
    pattern = args[0]
  }

  console.log(`🔍 Procurando arquivos em: ${pattern}`)
  console.log(
    `📋 Modo: ${DRY_RUN ? "DRY RUN (apenas visualização)" : "APLICAR MUDANÇAS"}`
  )

  try {
    const files = await glob(pattern, {
      ignore: ["node_modules/**", ".next/**", "build/**", "dist/**"],
    })

    console.log(`📄 Encontrados ${files.length} arquivos`)

    let processedFiles = 0
    let modifiedFiles = 0

    for (const file of files) {
      processedFiles++
      const wasModified = await processFile(file)
      if (wasModified) modifiedFiles++
    }

    console.log(`\n📊 Resumo:`)
    console.log(`  📄 Arquivos processados: ${processedFiles}`)
    console.log(`  ✅ Arquivos modificados: ${modifiedFiles}`)

    if (DRY_RUN && modifiedFiles > 0) {
      console.log(`\n💡 Para aplicar as mudanças, execute:`)
      console.log(`   node scripts/fix-mui-imports.mjs`)
    }
  } catch (error) {
    console.error("❌ Erro:", error.message)
    process.exit(1)
  }
}

main()
