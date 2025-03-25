import { createTheme } from "@mui/material/styles"
import { ptBR } from "@mui/x-data-grid/locales"

// Cores institucionais da ANPD
const anpdColors = {
  primary: {
    main: "#307244", // Verde ANPD (cor principal)
    light: "#4C9A61", // Versão mais clara para hover e destaque
    dark: "#20502E", // Versão mais escura para contraste
    contrastText: "#FFFFFF", // Texto branco para legibilidade
  },
  secondary: {
    main: "#00AEEF", // Azul ANPD
    light: "#5FCCFF",
    dark: "#0079B0",
    contrastText: "#FFFFFF",
  },
  accent: {
    main: "#FAA61A", // Laranja ANPD para destaques e alertas
    light: "#FFC260",
    dark: "#C77900",
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
    main: "rgba(194, 24, 7, 0.85)", // Vermelho GOV.BR para erros
  },
  warning: {
    main: "#FAA61A", // Usando o Laranja ANPD para alertas
  },
  info: {
    main: "#00AEEF", // Azul ANPD para informações
  },
  success: {
    main: "#2E7D32", // Verde GOV.BR para sucessos
  },
}

// Configuração do tema MUI
let ANPDtheme = createTheme({
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
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
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

ANPDtheme = createTheme(ANPDtheme, ptBR)

export default ANPDtheme
