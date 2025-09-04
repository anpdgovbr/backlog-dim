"use client"

import { useEffect, useState } from "react"

import dynamic from "next/dynamic"

import Clear from "@mui/icons-material/Clear"
import GridDeleteIcon from "@mui/icons-material/Delete"
import SettingsIcon from "@mui/icons-material/Settings"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { DataGrid, GridAddIcon } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"

import { useNotification } from "@/context/NotificationProvider"
import { useControladores } from "@/hooks/useControladores"
import usePermissoes from "@/hooks/usePermissoes"
import { pode } from "@anpdgovbr/rbac-core"
import { dataGridStyles } from "@/theme/dataGridStyles"
import type { RequeridoOutput } from "@/types/Requerido"
import { formatCpfCnpj } from "@/utils/formUtils"

const RequeridoModalForm = dynamic(() => import("./RequeridoModalForm"), {
  ssr: false,
})

export default function RequeridoDataGrid() {
  const [search, setSearch] = useState("")
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [openModal, setOpenModal] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [selectedRequeridoId, setSelectedRequeridoId] = useState<number | null>(null)

  const { permissoes, loading: loadingPermissoes } = usePermissoes()
  const { notify } = useNotification()

  const {
    data: requeridos,
    total: totalRows,
    isLoading: loading,
    error,
    mutate: mutateRequeridos,
  } = useControladores({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    orderBy: "nome",
    ascending: true,
    search,
  })

  useEffect(() => {
    if (error) {
      console.error("Erro ao buscar requeridos:", error)
      notify({
        message: "Erro ao carregar dados. Verifique o console para mais detalhes.",
        type: "error",
      })
    }
  }, [error, notify])

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este requerido?")) {
      try {
        const response = await fetch(`/api/controladores/${id}`, {
          method: "DELETE",
        })
        const data = await response.json()

        if (response.ok) {
          mutateRequeridos()
          notify({ type: "success", message: "Requerido excluído com sucesso" })
        } else {
          notify({ type: "error", message: `Erro ao excluir requerido: ${data.error}` })
        }
      } catch (error) {
        notify({ type: "error", message: `Erro ao excluir requerido: ${error}` })
      }
    }
  }

  const columns: GridColDef<RequeridoOutput>[] = [
    { field: "nome", headerName: "Nome/Razão Social", flex: 2 },
    {
      field: "cnpj",
      headerName: "CNPJ/CPF",
      flex: 1,
      renderCell: (params) => formatCpfCnpj(params.value || ""),
    },
    /*{
      field: "site",
      headerName: "Site",
      flex: 1,
      renderCell: (params) =>
        params.row.site ? (
          <a href={params.row.site} target="_blank" rel="noopener noreferrer">
            {params.row.site}
          </a>
        ) : (
          "N/A"
        ),
    },
    { field: "email", headerName: "E-mail", flex: 1 },*/
    {
      field: "setor",
      headerName: "Setor",
      flex: 1,
      renderCell: (params) => params.row.setor?.nome || "Não definido",
    },
    {
      field: "acoes",
      headerName: "Ações",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            disabled={!pode(permissoes, "Editar", "Responsavel")}
            onClick={() => {
              setSelectedRequeridoId(params.row.id)
              setOpenModal(true)
            }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            color="error"
            disabled={!pode(permissoes, "Desabilitar", "Responsavel")}
            onClick={() => handleDelete(params.row.id)}
          >
            <GridDeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  if (loadingPermissoes) return <Typography>Carregando permissões...</Typography>

  return (
    <Box>
      {!pode(permissoes, "Exibir", "Responsavel") ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Você não tem permissão para visualizar este conteúdo.
        </Alert>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h4">
              Lista de Requeridos
            </Typography>

            <GovBRButton
              variant="contained"
              startIcon={<GridAddIcon />}
              disabled={!pode(permissoes, "Cadastrar", "Responsavel")}
              onClick={() => {
                setSelectedRequeridoId(null)
                setOpenModal(true)
              }}
            >
              Adicionar Requerido
            </GovBRButton>
          </Box>

          <Box display="flex" gap={1} mb={2}>
            <TextField
              label="Buscar por nome, CNPJ ou CPF"
              variant="outlined"
              fullWidth
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput)
                }
              }}
            />
            <GovBRButton
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchInput("")
                setSearch("")
                setPaginationModel({ page: 0, pageSize: 10 })
              }}
              sx={{ minWidth: "auto", px: 2 }}
              startIcon={<Clear />}
            >
              Limpar
            </GovBRButton>
          </Box>

          <Box sx={dataGridStyles}>
            <DataGrid
              sx={{ minHeight: "45vh" }}
              rows={requeridos}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              loading={loading}
              paginationMode="server"
              rowCount={totalRows}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
          </Box>

          {openModal && (
            <RequeridoModalForm
              open
              onClose={() => {
                setOpenModal(false)
                setSelectedRequeridoId(null)
              }}
              requeridoId={selectedRequeridoId}
              mutate={mutateRequeridos}
            />
          )}
        </>
      )}
    </Box>
  )
}
