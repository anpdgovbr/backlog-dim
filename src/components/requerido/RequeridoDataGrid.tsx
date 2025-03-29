"use client"

import { useNotification } from "@/context/NotificationProvider"
import usePermissoes from "@/hooks/usePermissoes"
import { dataGridStyles } from "@/styles/dataGridStyles"
import { RequeridoOutput } from "@/types/Requerido"
import GridDeleteIcon from "@mui/icons-material/Delete"
import SettingsIcon from "@mui/icons-material/Settings"
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material"
import { DataGrid, GridAddIcon, GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useEffect, useState } from "react"

import RequeridoForm from "./RequeridoForm"

export default function RequeridoDataGrid() {
  const [requeridos, setRequeridos] = useState<RequeridoOutput[]>([])
  const [filteredData, setFilteredData] = useState<RequeridoOutput[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [totalRows, setTotalRows] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [selectedRequeridoId, setSelectedRequeridoId] = useState<number | null>(null)
  const { permissoes, loading: loadingPermissoes } = usePermissoes()
  const { notify } = useNotification()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/requeridos?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`
        )

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} - ${await response.text()}`)
        }

        const responseData = await response.json()

        if (!responseData.data || !Array.isArray(responseData.data)) {
          throw new Error("Estrutura de dados inválida na resposta da API")
        }

        setRequeridos(responseData.data)
        setFilteredData(responseData.data)
        setTotalRows(responseData.total || 0)
      } catch (error) {
        console.error("Erro ao buscar requeridos:", error)
        notify({
          message: "Erro ao carregar dados. Verifique o console para mais detalhes.",
          type: "error",
        })
        setRequeridos([])
        setFilteredData([])
        setTotalRows(0)
      }
      setLoading(false)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel])

  useEffect(() => {
    const lowercasedFilter = search.toLowerCase()
    const filtered = requeridos.filter(
      (item) =>
        item.nome.toLowerCase().includes(lowercasedFilter) ||
        item.cnpj?.includes(lowercasedFilter) ||
        item.site?.toLowerCase().includes(lowercasedFilter)
    )
    setFilteredData(filtered)
  }, [search, requeridos])

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este requerido?")) {
      try {
        const response = await fetch(`/api/requeridos/${id}`, {
          method: "DELETE",
        })
        const data = await response.json()

        if (response.ok) {
          setRequeridos((prev) => prev.filter((item) => item.id !== id))
          setTotalRows((prev) => prev - 1)
        } else {
          notify({ type: "error", message: `Erro ao excluir requerido: ${data.error}` })
          console.error("Erro ao excluir requerido:", data.error)
        }
      } catch (error) {
        notify({ type: "error", message: `Erro ao excluir requerido: ${error}` })
        console.error("Erro ao excluir requerido:", error)
      }
    }
  }

  const columns: GridColDef<RequeridoOutput>[] = [
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "cnpj", headerName: "CNPJ", width: 130 },
    {
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
    { field: "email", headerName: "E-mail", flex: 1 },
    {
      field: "setor",
      headerName: "Setor",
      flex: 1,
      renderCell: (params) => params.row.setor?.nome || "Não definido",
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 180,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            disabled={!permissoes["Editar_Responsavel"]} // 🔹 Bloqueia edição se não permitido. Requerido é o mesmo que Responsavel no quesito Permissão
            onClick={() => {
              setSelectedRequeridoId(params.row.id)
              setOpenModal(true)
            }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            color="error"
            disabled={!permissoes["Desabilitar_Responsavel"]} // 🔹 Bloqueia exclusão se não permitido. Requerido é o mesmo que Responsavel no quesito Permissão
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
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {!permissoes["Exibir_Responsavel"] && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Você não tem permissão para visualizar este conteúdo.
        </Alert>
      )}

      {permissoes["Exibir_Responsavel"] && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">
              Lista de Requeridos
            </Typography>

            <Button
              variant="contained"
              startIcon={<GridAddIcon />}
              disabled={!permissoes["Cadastrar_Responsavel"]}
              onClick={() => {
                setSelectedRequeridoId(null) // Garante que abrirá para adicionar novo
                setOpenModal(true)
              }}
            >
              Adicionar Requerido
            </Button>
          </Box>

          <TextField
            label="Buscar..."
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Box
            sx={{
              ...dataGridStyles,
              display: "flex",
              height: "100%",
              width: "100%",
              p: 0,
            }}
          >
            {" "}
            <DataGrid
              sx={{ minHeight: "45vh" }}
              rows={filteredData}
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

          <Modal open={openModal} onClose={() => {}}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                p: 3,
                borderRadius: 2,
                minWidth: 900,
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <Box display="flex" justifyContent="flex-end">
                <IconButton onClick={() => setOpenModal(false)} color="inherit">
                  ✖
                </IconButton>
              </Box>
              {selectedRequeridoId ? (
                <RequeridoForm requeridoId={selectedRequeridoId} />
              ) : (
                <RequeridoForm requeridoId={null} />
              )}
            </Box>
          </Modal>
        </>
      )}
    </Container>
  )
}
