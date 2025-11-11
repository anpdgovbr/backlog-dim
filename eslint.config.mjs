// eslint.config.mjs
import eslint from "@eslint/js"
import next from "eslint-config-next"
import tsparser from "@typescript-eslint/parser"
import reactHooks from "eslint-plugin-react-hooks"

const TS_FILES_GLOB = ["**/*.{ts,tsx}"]
const JS_TS_FILES_GLOB = ["**/*.{ts,tsx,js,jsx}"]

export default [
  // 1️⃣ Bases recomendadas
  eslint.configs.recommended,
  ...next,
  {
    files: TS_FILES_GLOB,
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: JS_TS_FILES_GLOB,
    languageOptions: {
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-undef": "warn",
      "no-useless-escape": "warn",
    },
  },

  // 2️⃣ Node-only JS
  {
    files: ["*.js", "scripts/**/*.{js,mjs}"],
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

  // 3️⃣ Ignorados
  {
    ignores: ["node_modules/", ".next/", "public/", "prisma/", "docs/"],
  },
]
