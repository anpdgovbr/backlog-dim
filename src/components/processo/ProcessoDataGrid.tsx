"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import AddIcon from "@mui/icons-material/Add"
import GridDeleteIcon from "@mui/icons-material/Delete"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import SettingsIcon from "@mui/icons-material/Settings"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import FormControlLabel from "@mui/material/FormControlLabel"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { DataGrid } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"

import type { ProcessoOutput } from "@anpdgovbr/shared-types"

import { useNotification } from "@/context/NotificationProvider"
import usePode from "@/hooks/usePode"
import { useProcessos } from "@/hooks/useProcessos"
import { useUsuarioIdLogado } from "@/hooks/useUsuarioIdLogado"
import { dataGridStyles } from "@/styles/dataGridStyles"

interface ProcessoDataGridProps {
  showTitle?: boolean
}

export default function ProcessoDataGrid({
  showTitle = true,
}: Readonly<ProcessoDataGridProps>) {
  const [search, setSearch] = useState("")
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [somenteMeus, setSomenteMeus] = useState(true)

  const router = useRouter()
  const { notify } = useNotification()
  const { pode, loading: loadingPermissoes } = usePode()
  const { userId, loading: loadingUserId } = useUsuarioIdLogado()

  const {
    data: processos,
    total,
    isLoading,
  } = useProcessos({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    search,
    orderBy: "dataCriacao",
    ascending: false,
    ...(somenteMeus && userId ? { responsavelUserId: userId } : {}),
  })

  const podeEditar = (responsavelUserId?: string | null): boolean =>
    !!userId &&
    (pode("EditarGeral", "Processo") ||
      (pode("EditarProprio", "Processo") && responsavelUserId === userId))

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este processo?")) {
      try {
        const response = await fetch(`/api/processos/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          notify({ type: "success", message: "Processo excluído com sucesso" })
        } else {
          const data = await response.json()
          console.error("Erro ao excluir processo:", data)
          notify({ type: "error", message: "Erro ao excluir processo" })
        }
      } catch (error) {
        console.error("Erro ao excluir processo:", error)
        notify({ type: "error", message: "Erro ao excluir processo" })
      }
    }
  }

  const handleClearFilters = () => {
    setSearch("")
    setSomenteMeus(true)
    setPaginationModel({ page: 0, pageSize: 10 })
  }

  const columns: GridColDef<ProcessoOutput>[] = [
    { field: "numero", headerName: "Número", width: 130 },
    {
      field: "dataCriacao",
      headerName: "Criado em",
      width: 100,
      renderCell: (params) =>
        params.row.dataCriacao
          ? new Date(params.row.dataCriacao).toLocaleDateString("pt-BR")
          : "-",
    },
    {
      field: "requerente",
      headerName: "Requerente",
      flex: 1.5,
      renderCell: (params) => (
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
            width: "100%",
          }}
        >
          {params.row.requerente || "Anônimo"}
        </span>
      ),
    },
    {
      field: "responsavel",
      headerName: "Responsável",
      flex: 1,
      renderCell: (params) => params.row.responsavel?.nome || "Não atribuído",
    },
    {
      field: "situacao",
      headerName: "Situação",
      flex: 0.8,
      renderCell: (params) => params.row.situacao?.nome || "Indefinida",
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <IconButton
            size="small"
            color="primary"
            disabled={!podeEditar(params.row.responsavel?.userId)}
            onClick={() => router.push(`/dashboard/processos/editar/${params.row.id}`)}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            disabled={!pode("Desabilitar", "Processo")}
            onClick={() => handleDelete(params.row.id)}
          >
            <GridDeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  if (loadingPermissoes || loadingUserId) {
    return <Typography>Carregando permissões...</Typography>
  }

  return (
    <>
      {!pode("Exibir", "Processo") ? (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Você não tem permissão para visualizar os processos.
        </Alert>
      ) : (
        <Box>
          {showTitle && (
            <Typography variant="h4" component="h1" gutterBottom>
              Lista de Processos
            </Typography>
          )}

          <Stack direction={{ xs: "column", sm: "column" }} spacing={1} mb={1}>
            <TextField
              label="Buscar..."
              variant="outlined"
              fullWidth
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={somenteMeus}
                    onChange={(e) => setSomenteMeus(e.target.checked)}
                  />
                }
                label="Somente atribuídos a mim"
                sx={{ ml: 1, mr: 1 }}
              />
              <Box gap={2} display="flex" alignItems="center">
                <Tooltip title="Limpar filtros">
                  <GovBRButton inverted={true} onClick={handleClearFilters}>
                    <RestartAltIcon sx={{ mr: 1 }} />
                    Limpar
                  </GovBRButton>
                </Tooltip>

                <Tooltip title="Adicionar novo processo">
                  <GovBRButton
                    color="primary"
                    onClick={() => router.push("/dashboard/processos/novo")}
                  >
                    <AddIcon sx={{ mr: 1 }} />
                    Novo
                  </GovBRButton>
                </Tooltip>
              </Box>
            </Stack>
          </Stack>

          <Box sx={dataGridStyles}>
            <DataGrid
              //sx={{ minHeight: "45vh" }}
              disableColumnMenu
              disableColumnSorting
              rows={processos}
              columns={columns}
              loading={isLoading}
              pageSizeOptions={[10, 20, 50]}
              paginationMode="server"
              rowCount={total}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              disableRowSelectionOnClick
              density="comfortable"
            />
          </Box>
        </Box>
      )}
    </>
  )
}
