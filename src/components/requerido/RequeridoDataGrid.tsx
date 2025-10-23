"use client"

import { useEffect, useMemo, useState } from "react"

import dynamic from "next/dynamic"

import Clear from "@mui/icons-material/Clear"
import GridDeleteIcon from "@mui/icons-material/Delete"
import SettingsIcon from "@mui/icons-material/Settings"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { DataGrid, GridAddIcon } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"

import { useNotification } from "@/context/NotificationProvider"
import { useControladores } from "@/hooks/useControladores"
import usePermissoes from "@/hooks/usePermissoes"
import { dataGridStyles } from "@/theme/dataGridStyles"
import type { RequeridoOutput } from "@/types/Requerido"
import { formatCpfCnpj } from "@/utils/formUtils"
import { pode } from "@anpdgovbr/rbac-core"
import { GovBRButton } from "@anpdgovbr/shared-ui"
import { Stack } from "@mui/material"
import { SetorEmpresarial } from "@anpdgovbr/shared-types"

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
  const [selectedRequeridoId, setSelectedRequeridoId] = useState<string | null>(null)

  const { permissoes, loading: loadingPermissoes } = usePermissoes()
  const { notify } = useNotification()

  const {
    data: controladores,
    totalElements,
    isLoading: loading,
    error,
    mutate: mutateRequeridos,
  } = useControladores({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    orderBy: "nomeEmpresarial",
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

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este requerido?")) {
      try {
        const response = await fetch(`/api/controladores/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          await mutateRequeridos()
          notify({ type: "success", message: "Requerido excluído com sucesso" })
        } else {
          const data = await response.json().catch(() => ({ error: "Erro desconhecido" }))
          notify({ type: "error", message: `Erro ao excluir requerido: ${data.error}` })
        }
      } catch (error) {
        notify({ type: "error", message: `Erro ao excluir requerido: ${error}` })
      }
    }
  }

  const rows = useMemo(() => controladores, [controladores])

  const columns: GridColDef<RequeridoOutput>[] = [
    { field: "nomeEmpresarial", headerName: "Nome Empresarial", flex: 2 },
    {
      field: "documento",
      headerName: "CPF/CNPJ",
      flex: 1,
      renderCell: ({ row }) => formatCpfCnpj(row.cnpj ?? row.cpf ?? ""),
    },
    {
      field: "setorEmpresarial",
      headerName: "Setor",
      flex: 1,
      renderCell: ({ row }) => {
        if (row.setorNome) return row.setorNome
        if (row.setorEmpresarial === SetorEmpresarial.PUBLICO) return "Público"
        if (row.setorEmpresarial === SetorEmpresarial.PRIVADO) return "Privado"
        return ""
      },
    },
    {
      field: "acoes",
      headerName: "Ações",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            disabled={!pode(permissoes, "Editar", "Responsavel") || !params.row.id}
            onClick={() => {
              if (!params.row.id) return
              setSelectedRequeridoId(params.row.id)
              setOpenModal(true)
            }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            color="error"
            disabled={!pode(permissoes, "Desabilitar", "Responsavel") || !params.row.id}
            onClick={() => {
              if (params.row.id) handleDelete(params.row.id)
            }}
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
              size="small"
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

          <Stack
            display="flex"
            gap={1}
            mb={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems="start"
          >
            <TextField
              label="Buscar por nome, CNPJ ou CPF"
              variant="outlined"
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput)
                }
              }}
              sx={{ flex: "1 1 auto", m: 0 }}
            />

            <GovBRButton
              variant="outlined"
              size="small"
              color="error"
              onClick={() => {
                setSearchInput("")
                setSearch("")
                setPaginationModel({ page: 0, pageSize: 10 })
              }}
              startIcon={<Clear />}
            >
              Limpar
            </GovBRButton>
          </Stack>

          <Box sx={dataGridStyles}>
            <DataGrid
              sx={{ minHeight: "45vh" }}
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              loading={loading}
              paginationMode="server"
              rowCount={totalElements}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              getRowId={(row) => row.id ?? ""}
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
