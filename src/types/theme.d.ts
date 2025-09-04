import "@mui/material/styles"

/**
 * Extensões de tipos do Material-UI para suportar a cor "accent" no tema.
 *
 * Este arquivo faz a declaração de module augmentation para os tipos do MUI,
 * adicionando uma chave "accent" ao Palette e PaletteOptions, permitindo que
 * o tema do projeto inclua uma cor de destaque adicional além das cores padrão.
 *
 * Também expõe a sobrecarga de props do Button para aceitar `color="accent"`.
 */

/**
 * Augmenta os tipos do módulo "@mui/material/styles".
 *
 * - Palette.accent: alias que utiliza a mesma forma de Palette["primary"],
 *   para facilitar a definição de uma cor de destaque no tema.
 * - PaletteOptions.accent?: permite configurar a cor "accent" ao construir o tema.
 */
declare module "@mui/material/styles" {
  /**
   * Representa a paleta do tema com suporte à cor "accent".
   *
   * Uso: ao criar o tema, incluir `accent: { main: '#...' }` em palette.
   */
  interface Palette {
    accent: Palette["primary"]
  }
  /**
   * Opções de configuração da paleta permitindo a chave "accent".
   *
   * Essa interface é usada ao chamar createTheme({ palette: { accent: ... } }).
   */
  interface PaletteOptions {
    accent?: PaletteOptions["primary"]
  }
}

/**
 * Extende as props do Button do MUI para aceitar a opção de cor "accent".
 *
 * Com isso, components Button podem usar <GovBRButton color="accent"> sem erro de tipos.
 */
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    accent: true
  }
}
