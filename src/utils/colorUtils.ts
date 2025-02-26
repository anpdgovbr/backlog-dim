import { Theme, alpha } from "@mui/material/styles"

/**
 * Lista de possíveis chaves (shades) que podem existir em SimplePaletteColorOptions.
 * Ajuste se precisar de mais (ex.: "contrastText").
 */
type AllowedShades = "main" | "light" | "dark" | "contrastText"

/** Verifica se um valor string é uma das chaves permitidas. */
function isAllowedShade(value: string): value is AllowedShades {
  return ["main", "light", "dark", "contrastText"].includes(value)
}

/**
 * Converte algo como "primary.light" ou "secondary.main" na cor real do tema.
 * Se não encontrar, retorna a string original (p. ex. "#1978cf").
 */
export function parseThemeColor(theme: Theme, colorSpec: string): string {
  if (colorSpec.includes(".")) {
    const [colorKey, shade] = colorSpec.split(".")

    // Tenta acessar theme.palette[colorKey]
    const palette = theme.palette as unknown as Record<string, unknown>
    const colorObj = palette[colorKey]

    if (colorObj && typeof colorObj === "object") {
      // Verifica se shade é uma das chaves válidas
      if (isAllowedShade(shade)) {
        const maybeOpts = colorObj as { [k in AllowedShades]?: string }
        const c = maybeOpts[shade]
        if (typeof c === "string") {
          return c
        }
      }
    }
  }
  return colorSpec // Se não achou, use a string como está
}

/**
 * Calcula a cor de fundo do círculo do ícone com 50% de transparência,
 * e define o ícone como branco (color: "#fff").
 */
export function calcIconCircleBg(theme: Theme, baseColor: string): string {
  const realColor = parseThemeColor(theme, baseColor)
  // 50% de opacidade de acordo com o que está no Figma
  return alpha(realColor, 0.5)
}
