import ANPDtheme from "@/theme/theme"
import { SxProps } from "@mui/material"

export const dataGridStyles = {
  minHeight: 400,
  width: "100%",
  backgroundColor: ANPDtheme.palette.background.default, // Usa a cor do theme
  borderRadius: 2,
  "& .MuiDataGrid-row": { alignItems: "center" },
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .MuiDataGrid-root": {
    backgroundColor: ANPDtheme.palette.background.paper, // Fundo branco do DataGrid
    borderRadius: 2,
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: `${ANPDtheme.palette.primary.light} !important`, // Fundo escuro
    color: ANPDtheme.palette.primary.contrastText,
    fontWeight: "bold",
    borderBottom: `2px solid ${ANPDtheme.palette.primary.main}`,
    fontSize: "0.9rem",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: ANPDtheme.palette.primary.contrastText, // Força o contraste nos títulos
    fontWeight: 700,
  },
  "& .MuiDataGrid-row:nth-of-type(even)": {
    backgroundColor: "#F0F0F0",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: ANPDtheme.palette.secondary.light,
  },
  "& .MuiTablePagination-root": {
    alignItems: "center", // Alinha verticalmente o footer
    display: "flex",
    minHeight: "56px",
    justifyContent: "flex-end", // Espaço entre os elementos
  },
  "& .MuiTablePagination-toolbar": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 0, // Remove padding extra
    minHeight: "48px",
  },
  "& .MuiTablePagination-selectLabel": {
    margin: 0, // Remove margens padrão para alinhar corretamente
  },
  "& .MuiTablePagination-displayedRows": {
    margin: 0, // Remove espaçamentos desnecessários
  },
  "& .MuiTablePagination-actions": {
    display: "flex",
    alignItems: "center", // Alinha os botões de navegação
    justifyContent: "center",
  },
  "& .MuiInputBase-root": {
    display: "flex",
    alignItems: "center",
    padding: 0, // Remove paddings extras do dropdown
  },
} as SxProps
