import type { Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"

/**
 * Chaves permitidas (shades) em SimplePaletteColorOptions do Material-UI.
 *
 * Use esse tipo quando precisar referenciar explicitamente uma das variações
 * de cor presentes em uma cor do tema (ex.: "main", "light", "dark", "contrastText").
 */
type AllowedShades = "main" | "light" | "dark" | "contrastText"

/**
 * Verifica se uma string corresponde a uma das chaves permitidas (AllowedShades).
 *
 * Essa função é um type guard que permite ao TypeScript refinar o tipo quando
 * a verificação retornar true.
 *
 * @param value - Valor a ser verificado como shade permitida.
 * @returns true se value for uma AllowedShades; caso contrário false.
 */
function isAllowedShade(value: string): value is AllowedShades {
  return ["main", "light", "dark", "contrastText"].includes(value)
}

/**
 * Converte uma especificação de cor baseada no tema em uma cor concreta.
 *
 * Aceita strings no formato "paletteKey.shade" (ex.: "primary.light", "secondary.main").
 * Se a especificação corresponder a uma cor definida em theme.palette e a shade for
 * reconhecida, retorna a string da cor correspondente (ex.: "#1976d2"). Em caso contrário,
 * retorna a string original passada em colorSpec.
 *
 * Observações:
 * - Não lança exceções; falhas de resolução simplesmente retornam colorSpec.
 * - Não faz suposições sobre a presença de todas as chaves em theme.palette (uso de as unknown).
 *
 * @param theme - Instância do Theme (MUI) usada para resolver cores do palette.
 * @param colorSpec - Especificação de cor (por ex.: "primary.main") ou uma cor literal.
 * @returns A cor resolvida (ex.: "#1976d2") ou a string original se não resolvida.
 *
 * @example
 * parseThemeColor(theme, "primary.main") // => "#1976d2"
 * parseThemeColor(theme, "#ff0000") // => "#ff0000"
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
        const maybeOpts = colorObj as Partial<Record<AllowedShades, string>>
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
 * Calcula a cor de fundo de um círculo para ícones a partir de uma cor base.
 *
 * A função resolve a cor base (pode ser uma especificação do tema como "primary.main"
 * ou uma cor literal) e aplica 50% de opacidade utilizando `alpha` do MUI.
 *
 * Uso comum: gerar um background suave para um ícone onde o ícone em si ficará branco.
 *
 * @param theme - Theme do MUI para resolução de cores.
 * @param baseColor - Cor base ou especificação baseada no tema (ex.: "primary.main").
 * @returns Cor de fundo com 50% de opacidade (ex.: "rgba(25, 118, 210, 0.5)").
 */
export function calcIconCircleBg(theme: Theme, baseColor: string): string {
  const realColor = parseThemeColor(theme, baseColor)
  // 50% de opacidade de acordo com o que está no Figma
  return alpha(realColor, 0.5)
}
