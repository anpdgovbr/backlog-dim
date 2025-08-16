import type { SxProps } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"

import ANPDtheme from "@/theme/theme"

export const dataGridStyles: SxProps = {
  // Estilos do container do DataGrid
  border: `1px solid ${ANPDtheme.palette.divider}`,
  borderRadius: ANPDtheme.shape.borderRadius,
  boxShadow: ANPDtheme.shadows[1],
  backgroundColor: ANPDtheme.palette.background.paper,
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",

  // Estilos para o elemento raiz do DataGrid
  "& .MuiDataGrid-root": {
    border: "none",
    flexGrow: 1,
  },

  // Estilos do cabeçalho
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: ANPDtheme.palette.grey[100],
    borderBottom: `2px solid ${ANPDtheme.palette.primary.main}`,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    color: ANPDtheme.palette.text.primary,
  },

  // Estilos das linhas
  "& .MuiDataGrid-row": {
    "&:nth-of-type(even)": {
      backgroundColor: alpha(ANPDtheme.palette.grey[200], 0.5),
    },
    "&:hover": {
      backgroundColor: alpha(ANPDtheme.palette.primary.light, 0.2),
      cursor: "pointer",
    },
    transition: `background-color 0.2s ease-in-out`,
  },

  // Estilos das células
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${ANPDtheme.palette.divider}`,
  },

  // Estilos do rodapé
  "& .MuiDataGrid-footerContainer": {
    borderTop: `1px solid ${ANPDtheme.palette.divider}`,
    backgroundColor: ANPDtheme.palette.grey[50],
  },

  // Estilo para quando não há linhas
  "& .MuiDataGrid-overlay": {
    backgroundColor: alpha(ANPDtheme.palette.background.default, 0.7),
  },
}
