import type { SxProps } from "@mui/material/styles"

import ANPDtheme from "@/theme/theme"

export const dataGridStyles = {
  width: "100%",
  backgroundColor: ANPDtheme.palette.background.default,
  borderRadius: 2,

  "& .MuiDataGrid-main": {
    minWidth: "100% !important",
  },
  "& .MuiDataGrid-virtualScrollerContent": {
    width: "100% !important",
    minWidth: "100% !important",
    flexGrow: 1,
  },
  "& .MuiDataGrid-virtualScroller": {
    overflowX: "hidden",
  },
  "& .MuiDataGrid-columnHeaders": {
    minWidth: "100% !important",
  },

  "& .MuiDataGrid-row": { alignItems: "center" },
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .MuiDataGrid-root": {
    backgroundColor: ANPDtheme.palette.background.paper,
    borderRadius: 2,
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: `${ANPDtheme.palette.primary.light} !important`,
    color: ANPDtheme.palette.primary.contrastText,
    fontWeight: "bold",
    borderBottom: `2px solid ${ANPDtheme.palette.primary.main}`,
    fontSize: "0.9rem",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: ANPDtheme.palette.primary.contrastText,
    fontWeight: 700,
  },
  "& .MuiDataGrid-row:nth-of-type(even)": {
    backgroundColor: "#F0F0F0",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: ANPDtheme.palette.secondary.light,
  },
  "& .MuiTablePagination-root": {
    alignItems: "center",
    display: "flex",
    minHeight: "56px",
    justifyContent: "flex-end",
  },
  "& .MuiTablePagination-toolbar": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 0,
    minHeight: "48px",
  },
  "& .MuiTablePagination-selectLabel": {
    margin: 0,
  },
  "& .MuiTablePagination-displayedRows": {
    margin: 0,
  },
  "& .MuiTablePagination-actions": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiInputBase-root": {
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
} as SxProps
