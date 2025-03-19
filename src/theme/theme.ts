import { createTheme } from "@mui/material/styles"

// Cores institucionais da ANPD, baseadas no Padrão Digital de Governo
const anpdColors = {
  primary: {
    main: "#005A3C", // Verde ANPD
    light: "#007A4D", // Tom mais claro para hover
    dark: "#00432D", // Tom mais escuro para contraste
    contrastText: "#FFFFFF", // Texto branco para botões
  },
  secondary: {
    main: "#FFB100", // Amarelo GOV.BR
    light: "#FFEE66",
    dark: "#FF9800",
    contrastText: "#000000",
  },
  background: {
    default: "#F5F5F5", // Fundo claro, padrão do GOV.BR DS
    paper: "#FFFFFF", // Fundo de cartões e diálogos
  },
  text: {
    primary: "#212121", // Preto suave para textos principais
    secondary: "#4F4F4F", // Cinza escuro para textos secundários
  },
  error: {
    main: "#C21807", // Vermelho GOV.BR para erros
  },
  warning: {
    main: "#FF9800", // Laranja GOV.BR para alertas
  },
  info: {
    main: "#007BC2", // Azul GOV.BR para informações
  },
  success: {
    main: "#2E7D32", // Verde GOV.BR para sucessos
  },
}

// Configuração do tema MUI
const ANPDtheme = createTheme({
  palette: {
    primary: anpdColors.primary,
    secondary: anpdColors.secondary,
    background: anpdColors.background,
    text: anpdColors.text,
    error: anpdColors.error,
    warning: anpdColors.warning,
    info: anpdColors.info,
    success: anpdColors.success,
  },
  typography: {
    fontFamily: ["Rubik", "Arial", "sans-serif"].join(","),
    fontSize: 14,
    h1: { fontSize: "2.25rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 600 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 500 },
    h5: { fontSize: "1rem", fontWeight: 500 },
    h6: { fontSize: "0.875rem", fontWeight: 500 },
    body1: { fontSize: "1rem" },
    body2: { fontSize: "0.875rem" },
    button: { fontSize: "0.875rem", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8, // Bordas arredondadas padrão do GOV.BR DS
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Evita letras maiúsculas automáticas
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          //boxShadow: "none", // Removendo sombras para manter o visual clean
          borderRadius: 8,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
  },
})

export default ANPDtheme
