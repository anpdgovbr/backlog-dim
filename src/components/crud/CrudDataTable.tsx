"use client"

import { useMemo } from "react"

import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import Box from "@mui/material/Box"
import type {
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from "@mui/x-data-grid"
import { DataGrid } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"

import { dataGridStyles } from "@/theme/dataGridStyles"
import type { SxProps, Theme } from "@mui/material"
import { GovBRButton } from "@anpdgovbr/shared-ui"

export interface Item {
  id: number
  nome: string
  active?: boolean
}

export interface CrudDataTableProps {
  items: Item[]
  totalRows: number
  isLoading: boolean
  paginationModel: GridPaginationModel
  onPaginationChange: (model: GridPaginationModel) => void
  onEdit: (item: Item) => void
  onDelete: (id: number) => void
  canEdit: boolean
  canDelete: boolean
  showId?: boolean
  showActions?: boolean
  sx?: SxProps<Theme>
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
  showId = true,
  showActions = true,
  sx,
}: Readonly<CrudDataTableProps>) {
  const columns = useMemo(() => {
    const cols = [
      // Coluna ID (opcional)
      ...(showId
        ? [
            {
              field: "id",
              headerName: "ID",
              align: "center",
              headerAlign: "center",
              flex: 0.4,
            },
          ]
        : []),
      // Coluna Nome
      {
        field: "nome",
        headerName: "Nome",
        flex: 1,
      },
      // Coluna Ações (opcional)
      ...(showActions
        ? [
            {
              field: "acoes",
              headerName: "Ações",
              sortable: false,
              flex: 0.6,
              align: "center",
              headerAlign: "center",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderCell: (params: GridRenderCellParams<any, Item>) => (
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    // garantir que o conteúdo fique centralizado mesmo que a célula tenha
                    // padding ou comportamento de flex do DataGrid
                  }}
                >
                  <GovBRButton
                    variant="circle"
                    color="primary"
                    disabled={!canEdit}
                    onClick={() => onEdit(params.row)}
                    sx={{
                      border: "none",
                    }}
                  >
                    <EditIcon color="primary" fontSize="small" />
                  </GovBRButton>
                  <GovBRButton
                    variant="circle"
                    color="error"
                    disabled={!canDelete}
                    onClick={() => onDelete(params.row.id)}
                    sx={{
                      border: "none",
                    }}
                  >
                    <DeleteIcon color="error" fontSize="small" />
                  </GovBRButton>
                </Box>
              ),
            },
          ]
        : []),
    ]

    return cols as unknown as GridColDef<Item>[]
  }, [canEdit, canDelete, onEdit, onDelete, showId, showActions])

  return (
    <Box sx={[dataGridStyles, sx] as unknown as SxProps<Theme>}>
      <DataGrid
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
