import type { SxProps, Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"

export const dataGridStyles: SxProps<Theme> = (theme: Theme) => ({
  // Estilos do container do DataGrid
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.paper,
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden", // garante que o conteúdo interno siga o borderRadius do container

  // Estilos para o elemento raiz do DataGrid
  "& .MuiDataGrid-root": {
    border: "none",
    flexGrow: 1,
    // aplicar borda arredondada também no elemento raiz para que as células/cabeçalho
    // respeitem os cantos do container pai
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
  },

  // Alguns elementos internos também precisam ter borderRadius/overflow em versões
  // diferentes do DataGrid
  "& .MuiDataGrid-main": {
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
  },

  // Estilos do cabeçalho
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.grey[100],
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },

  // Estilos das linhas
  "& .MuiDataGrid-row": {
    "&:nth-of-type(even)": {
      backgroundColor: alpha(theme.palette.grey[200], 0.5),
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.2),
      cursor: "pointer",
    },
    transition: `background-color 0.2s ease-in-out`,
  },

  // Estilos das células
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  // Remover outline visual quando a célula for focada por clique (preservando
  // indicação de foco para navegação por teclado via :focus-visible)
  "& .MuiDataGrid-cell:focus:not(:focus-visible), & .MuiDataGrid-columnHeader:focus:not(:focus-visible), & .MuiDataGrid-row:focus:not(:focus-visible)":
    {
      outline: "none",
      boxShadow: "none",
    },

  // Também garantir que seleções de linha não exibam outline indesejado ao clicar
  "& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:focus": {
    outline: "none",
    boxShadow: "none",
  },

  // Estilos do rodapé
  "& .MuiDataGrid-footerContainer": {
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.grey[50],
  },

  // Estilo para quando não há linhas
  "& .MuiDataGrid-overlay": {
    backgroundColor: alpha(theme.palette.background.default, 0.7),
  },
})
