import eslint from "@eslint/js"
import nextPlugin from "@next/eslint-plugin-next"
import typescriptPlugin from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import reactHooksPlugin from "eslint-plugin-react-hooks"

const eslintConfig = [
  // Node.js globals para arquivos JS na raiz (ex: server.js)
  {
    files: ["*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "writable",
        module: "writable",
        require: "readonly",
      },
    },
  },
  eslint.configs.recommended,

  // Configuração principal para todos os arquivos
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": typescriptPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },

  {
    ignores: [
      "node_modules/",
      ".next/",
      "public/",
      "prisma/",
      "scripts/*.cjs",
      "docs/",
      "*.config.{js,ts,mjs}",
    ],
  },

  {
    files: ["scripts/**/*.{js,mjs}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "writable",
        module: "writable",
        require: "readonly",
      },
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: true,
      },
      globals: {
        // Browser globals
        console: "readonly",
        fetch: "readonly",
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        confirm: "readonly",

        // Node.js globals
        process: "readonly",
        global: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",

        // React globals
        React: "readonly",
        JSX: "readonly",
      },
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          // Configurações específicas para não detectar falsos positivos em interfaces
          args: "after-used",
          ignoreRestSiblings: true,
          caughtErrors: "none",
        },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      // Desabilitar no-unused-vars padrão do ESLint (conflita com @typescript-eslint)
      "no-unused-vars": "off",

      // General rules (relaxados temporariamente)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-undef": "warn",
      "no-useless-escape": "warn",

      // MUI optimization rules - Desabilitado temporariamente para permitir migração gradual
      // TODO: Reativar após migração completa para imports otimizados
      // "no-restricted-imports": [
      //   "warn",
      //   {
      //     paths: [
      //       {
      //         name: "@mui/material",
      //         importNames: ["Typography", "Button", "Box", "Link"],
      //         message: "⚠️ Para melhor tree shaking, prefira: import Button from '@mui/material/Button'"
      //       }
      //     ]
      //   }
      // ],
    },
  },
]

export default eslintConfig
