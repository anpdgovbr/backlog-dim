#!/usr/bin/env node
import { readFile, writeFile } from "fs/promises"
import { glob } from "glob"

// Mapeamento de componentes MUI mais comuns
const muiComponentMap = {
  // Material components
  Typography: "@mui/material/Typography",
  Button: "@mui/material/Button",
  Box: "@mui/material/Box",
  Container: "@mui/material/Container",
  Grid: "@mui/material/Grid",
  Stack: "@mui/material/Stack",
  Paper: "@mui/material/Paper",
  Card: "@mui/material/Card",
  CardContent: "@mui/material/CardContent",
  CardActions: "@mui/material/CardActions",
  TextField: "@mui/material/TextField",
  FormControl: "@mui/material/FormControl",
  InputLabel: "@mui/material/InputLabel",
  Select: "@mui/material/Select",
  MenuItem: "@mui/material/MenuItem",
  Checkbox: "@mui/material/Checkbox",
  Radio: "@mui/material/Radio",
  Switch: "@mui/material/Switch",
  Slider: "@mui/material/Slider",
  Dialog: "@mui/material/Dialog",
  DialogTitle: "@mui/material/DialogTitle",
  DialogContent: "@mui/material/DialogContent",
  DialogActions: "@mui/material/DialogActions",
  Link: "@mui/material/Link",
  List: "@mui/material/List",
  ListItem: "@mui/material/ListItem",
  ListItemText: "@mui/material/ListItemText",
  ListItemIcon: "@mui/material/ListItemIcon",
  ListItemButton: "@mui/material/ListItemButton",
  Divider: "@mui/material/Divider",
  Breadcrumbs: "@mui/material/Breadcrumbs",
  Chip: "@mui/material/Chip",
  Badge: "@mui/material/Badge",
  IconButton: "@mui/material/IconButton",
  Fab: "@mui/material/Fab",
  Tooltip: "@mui/material/Tooltip",
  Menu: "@mui/material/Menu",
  Drawer: "@mui/material/Drawer",
  AppBar: "@mui/material/AppBar",
  Toolbar: "@mui/material/Toolbar",
  Tab: "@mui/material/Tab",
  Tabs: "@mui/material/Tabs",
  Alert: "@mui/material/Alert",
  AlertTitle: "@mui/material/AlertTitle",
  CircularProgress: "@mui/material/CircularProgress",
  LinearProgress: "@mui/material/LinearProgress",
  Skeleton: "@mui/material/Skeleton",
  Accordion: "@mui/material/Accordion",
  AccordionSummary: "@mui/material/AccordionSummary",
  AccordionDetails: "@mui/material/AccordionDetails",
  Stepper: "@mui/material/Stepper",
  Step: "@mui/material/Step",
  StepLabel: "@mui/material/StepLabel",
  Table: "@mui/material/Table",
  TableBody: "@mui/material/TableBody",
  TableCell: "@mui/material/TableCell",
  TableContainer: "@mui/material/TableContainer",
  TableHead: "@mui/material/TableHead",
  TableRow: "@mui/material/TableRow",
  TablePagination: "@mui/material/TablePagination",
  CssBaseline: "@mui/material/CssBaseline",

  // Hooks e utilities
  useTheme: "@mui/material/styles",
  useMediaQuery: "@mui/material/useMediaQuery",

  // Types que devem permanecer como destructuring
  Theme: "@mui/material/styles",
  SxProps: "@mui/material/styles",
  SelectChangeEvent: "@mui/material/Select",
  DialogProps: "@mui/material/Dialog",
  ButtonProps: "@mui/material/Button",
  TextFieldProps: "@mui/material/TextField",
}

// Hooks e funções que devem usar destructuring
const destructuringAllowed = new Set([
  "useTheme",
  "styled",
  "createTheme",
  "ThemeProvider",
])

function fixMuiImports(content) {
  let newContent = content
  let hasChanges = false

  // Regex para encontrar imports com destructuring do @mui/material
  const destructuringRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]@mui\/material['"]/g

  const matches = [...content.matchAll(destructuringRegex)]

  for (const match of matches) {
    const importedItems = match[1]
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    let newImports = []
    let remainingDestructured = []

    for (const item of importedItems) {
      // Remove 'type' prefix se existir
      const cleanItem = item.replace(/^type\s+/, "")
      const isTypeImport = item.startsWith("type ")

      if (isTypeImport || destructuringAllowed.has(cleanItem)) {
        // Mantém como destructuring para tipos e hooks/utilities permitidos
        remainingDestructured.push(item)
      } else if (muiComponentMap[cleanItem]) {
        // Converte para import individual
        if (cleanItem === "useTheme") {
          newImports.push(`import { useTheme } from "@mui/material/styles"`)
        } else {
          newImports.push(`import ${cleanItem} from "${muiComponentMap[cleanItem]}"`)
        }
        hasChanges = true
      } else {
        // Item não mapeado, mantém como destructuring
        remainingDestructured.push(item)
      }
    }

    // Reconstrói o import
    let replacement = ""

    if (newImports.length > 0) {
      replacement += newImports.join("\n") + "\n"
    }

    if (remainingDestructured.length > 0) {
      replacement += `import { ${remainingDestructured.join(", ")} } from "@mui/material"`
    }

    // Remove linha vazia extra se não há destructuring restante
    if (remainingDestructured.length === 0) {
      replacement = replacement.trimEnd()
    }

    newContent = newContent.replace(match[0], replacement)
  }

  return { content: newContent, hasChanges }
}

async function processFile(filePath) {
  try {
    const content = await readFile(filePath, "utf-8")
    const { content: newContent, hasChanges } = fixMuiImports(content)

    if (hasChanges) {
      await writeFile(filePath, newContent, "utf-8")
      console.log(`✅ Fixed: ${filePath}`)
      return true
    }

    return false
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
    return false
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")

  if (dryRun) {
    console.log("🔍 DRY RUN MODE - No files will be modified\n")
  }

  // Encontra todos os arquivos TS/TSX
  const files = await glob("src/**/*.{ts,tsx}", {
    ignore: ["**/*.d.ts", "**/node_modules/**"],
  })

  console.log(`📁 Found ${files.length} files to process\n`)

  let processedCount = 0
  let changedCount = 0

  for (const file of files) {
    processedCount++

    if (dryRun) {
      const content = await readFile(file, "utf-8")
      const { hasChanges } = fixMuiImports(content)
      if (hasChanges) {
        console.log(`📝 Would fix: ${file}`)
        changedCount++
      }
    } else {
      const changed = await processFile(file)
      if (changed) {
        changedCount++
      }
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Processed: ${processedCount} files`)
  console.log(`   ${dryRun ? "Would change" : "Changed"}: ${changedCount} files`)

  if (changedCount > 0 && !dryRun) {
    console.log(`\n🚀 Run 'npm run lint' to fix any remaining issues`)
  }
}

main().catch(console.error)
