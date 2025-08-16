// Arquivo minimal para garantir que o Next.js detecte o plugin de ESLint.
// Mantemos a configuração principal em `eslint.config.mjs` (flat config),
// mas o Next.js atualmente detecta configs tradicionais (.eslintrc) mais
// facilmente — esse arquivo serve apenas para sinalizar ao Next que o
// plugin/config do Next está presente.

module.exports = {
  root: true,
  plugins: [
    // marca explicitamente o plugin do Next para detectores que checam a
    // presença do plugin em `plugins` (além de `extends`).
    "@next/next",
    "next",
  ],
  extends: [
    // Configurações oficiais do Next.js — garante detecção pelo Next
    "next",
    "next/core-web-vitals",
  ],
}
