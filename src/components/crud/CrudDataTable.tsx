"use client"

import { useMemo } from "react"
import { useTheme } from "@mui/material/styles"

import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { DataGrid } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"

interface Item {
  id: number
  nome: string
  active?: boolean
}

interface CrudDataTableProps {
  items: Item[]
  totalRows: number
  isLoading: boolean
  paginationModel: GridPaginationModel
  onPaginationChange: (model: GridPaginationModel) => void
  onEdit: (item: Item) => void
  onDelete: (id: number) => void
  canEdit: boolean
  canDelete: boolean
}

export default function CrudDataTable({
  items,
  totalRows,
  isLoading,
  paginationModel,
  onPaginationChange,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: CrudDataTableProps) {
  const theme = useTheme()

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        align: "center",
        headerAlign: "center",
        flex: 0.4,
      },
      {
        field: "nome",
        headerName: "Nome",
        flex: 1,
      },
      {
        field: "acoes",
        headerName: "Ações",
        sortable: false,
        flex: 0.6,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              size="small"
              color="primary"
              disabled={!canEdit}
              onClick={() => onEdit(params.row)}
              sx={{
                "&:hover": {
                  bgcolor: "primary.50",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              disabled={!canDelete}
              onClick={() => onDelete(params.row.id)}
              sx={{
                "&:hover": {
                  bgcolor: "error.50",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [canEdit, canDelete, onEdit, onDelete]
  )

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        boxShadow: theme.shadows[2],
      }}
    >
      <DataGrid
        sx={{
          flexGrow: 1,
          minHeight: "45vh",
          border: "none",

          // Header customization
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "grey.50",
            borderBottom: "2px solid",
            borderColor: "primary.main",

            "& .MuiDataGrid-columnHeader": {
              fontWeight: theme.typography.fontWeightBold,
            },
          },

          // Row customization
          "& .MuiDataGrid-row": {
            "&:nth-of-type(even)": {
              bgcolor: "grey.25",
            },
            "&:hover": {
              bgcolor: "primary.50",
              transform: "scale(1.001)",
              transition: "all 0.2s ease",
            },
          },

          // Cell customization
          "& .MuiDataGrid-cell": {
            borderColor: "divider",
          },

          // Footer customization
          "& .MuiDataGrid-footerContainer": {
            borderTop: "2px solid",
            borderColor: "divider",
            bgcolor: "grey.25",
          },

          // Loading overlay
          "& .MuiDataGrid-overlay": {
            bgcolor: "rgba(255, 255, 255, 0.8)",
          },
        }}
        disableColumnMenu
        rows={items}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[10, 20, 50]}
        paginationMode="server"
        rowCount={totalRows}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        disableRowSelectionOnClick
        density="comfortable"
      />
    </Box>
  )
}
