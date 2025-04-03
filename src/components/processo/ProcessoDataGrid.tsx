"use client"

import { useNotification } from "@/context/NotificationProvider"
import usePode from "@/hooks/usePode"
import { useProcessos } from "@/hooks/useProcessos"
import { useUsuarioIdLogado } from "@/hooks/useUsuarioIdLogado"
import { dataGridStyles } from "@/styles/dataGridStyles"
import { ProcessoOutput } from "@/types/Processo"
import AddIcon from "@mui/icons-material/Add"
import GridDeleteIcon from "@mui/icons-material/Delete"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import SettingsIcon from "@mui/icons-material/Settings"
import {
  Alert,
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProcessoDataGrid() {
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
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            disabled={!podeEditar(params.row.responsavel?.userId)}
            onClick={() => router.push(`/dashboard/processos/editar/${params.row.id}`)}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
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
    <Container maxWidth="lg" sx={{ m: 0, p: 0 }}>
      {!pode("Exibir", "Processo") ? (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Você não tem permissão para visualizar os processos.
        </Alert>
      ) : (
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Lista de Processos
          </Typography>

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

              <Tooltip title="Limpar filtros">
                <Button
                  startIcon={<RestartAltIcon />}
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearFilters}
                >
                  Limpar
                </Button>
              </Tooltip>

              <Tooltip title="Adicionar novo processo">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  color="primary"
                  onClick={() => router.push("/dashboard/processos/novo")}
                >
                  Novo
                </Button>
              </Tooltip>
            </Stack>
          </Stack>

          <Box sx={{ ...dataGridStyles, display: "flex", height: "100%", width: "100%" }}>
            <DataGrid
              sx={{ minHeight: "45vh" }}
              disableColumnMenu
              disableColumnSorting
              rows={processos}
              columns={columns}
              loading={isLoading}
              pageSizeOptions={[5, 10, 20]}
              paginationMode="server"
              rowCount={total}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
          </Box>
        </Box>
      )}
    </Container>
  )
}
