import { FlatCompat } from "@eslint/eslintrc"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      "node_modules/",
      ".next/",
      "public/",
      "prisma/",
      "supabase/",
      "scripts/*.cjs",
      "docs/",
      "*.config.{js,ts,mjs}",
    ],
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "warn",

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",

      // MUI optimization rules - Evita imports de primeiro nível para reduzir bundle size
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@mui/material"],
              message:
                "⚠️ Ajude o Lulu - Importação de primeiro nível do '@mui/material' não é permitida. Use o caminho direto, por exemplo: import Button from '@mui/material/Button';",
            },
            {
              group: ["@mui/icons-material"],
              message:
                "⚠️ Ajude o Lulu - Importação de primeiro nível do '@mui/icons-material' não é permitida. Use o caminho direto, por exemplo: import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';",
            },
            {
              group: ["@mui/lab"],
              message:
                "⚠️ Ajude o Lulu - Importação de primeiro nível do '@mui/lab' não é permitida. Use o caminho direto, por exemplo: import LoadingButton from '@mui/lab/LoadingButton';",
            },
            {
              group: ["@mui/x-data-grid", "@mui/x-data-grid/*"],
              message:
                "⚠️ Ajude o Lulu - Importação de primeiro nível do '@mui/x-data-grid' não é permitida. Use o caminho direto, por exemplo: import { DataGrid } from '@mui/x-data-grid/DataGrid';",
            },
            {
              group: ["@mui/x-date-pickers"],
              message:
                "⚠️ Ajude o Lulu - Importação de primeiro nível do '@mui/x-date-pickers' não é permitida. Use o caminho direto, por exemplo: import { DatePicker } from '@mui/x-date-pickers/DatePicker';",
            },
          ],
        },
      ],
    },
  },
]

export default eslintConfig
