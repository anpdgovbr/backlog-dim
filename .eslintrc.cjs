// ESLint compat (legacy) para ajudar o Next.js a detectar o plugin e
// aplicar regras de naming que a equipe deseja impor.

module.exports = {
  root: true,
  plugins: [
    "@next/next",
    "next",
    "@typescript-eslint",
    "filenames",
  ],
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase"]
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        leadingUnderscore: "allow"
      },
      {
        selector: "function",
        format: ["camelCase"]
      },
      {
        selector: "parameter",
        format: ["camelCase"],
        leadingUnderscore: "allow"
      },
      {
        selector: "typeLike",
        format: ["PascalCase"]
      },
      {
        selector: "enum",
        format: ["PascalCase"]
      },
      {
        selector: "enumMember",
        format: ["PascalCase", "UPPER_CASE"]
      }
    ],

    "filenames/match-regex": [
      "error",
      "^[A-Z][a-zA-Z0-9]*$",
      {
        message: "TSX component filenames should be PascalCase (Ex: MyComponent.tsx)"
      }
    ]
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      rules: {
        "filenames/match-regex": [
          "error",
          "^[A-Z][a-zA-Z0-9]*$",
          { message: "TSX component filenames should be PascalCase" }
        ]
      }
    }
  ]
}
