"use client"

import { useNotification } from "@/context/NotificationProvider"
import withPermissao from "@/hoc/withPermissao"
import { ProcessoOutput } from "@/types/Processo"
import GridDeleteIcon from "@mui/icons-material/Delete"
import SettingsIcon from "@mui/icons-material/Settings"
import { Box, Container, IconButton, TextField, Typography } from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function ListarProcessosContent() {
  const [processos, setProcessos] = useState<ProcessoOutput[]>([])
  const [filteredData, setFilteredData] = useState<ProcessoOutput[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [totalRows, setTotalRows] = useState(0)
  const router = useRouter()
  const { notify } = useNotification()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/processos?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}&orderBy=dataCriacao&ascending=false`
        )
        const { data, total } = await response.json()

        if (Array.isArray(data)) {
          setProcessos(data)
          setFilteredData(data)
          setTotalRows(total)
        } else {
          console.error("Resposta inesperada da API:", data)
          setProcessos([])
          setFilteredData([])
        }
      } catch (error) {
        console.error("Erro ao buscar processos:", error)
        setProcessos([])
        setFilteredData([])
      }
      setLoading(false)
    }
    fetchData()
  }, [paginationModel])

  // Filtro de busca
  useEffect(() => {
    const lowercasedFilter = search.toLowerCase()
    const filtered = processos.filter(
      (item) =>
        item.responsavel?.nome.toLowerCase().includes(lowercasedFilter) ||
        item.numero.toString().includes(lowercasedFilter) ||
        item.situacao?.nome.toLowerCase().includes(lowercasedFilter)
    )
    setFilteredData(filtered)
  }, [search, processos])

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este processo?")) {
      try {
        const response = await fetch(`/api/processos/${id}`, {
          method: "DELETE",
        })
        const data = await response.json()

        if (response.ok) {
          setProcessos((prev) => prev.filter((item) => item.id !== id))
          setTotalRows((prev) => prev - 1)
          notify({ type: "success", message: "Processo excluído com sucesso" })
        } else {
          console.error("Erro ao excluir processo:", data)
          notify({ type: "error", message: "Erro ao excluir processo" })
        }
      } catch (error) {
        console.error("Erro ao excluir processo:", error)
        notify({ type: "error", message: "Erro ao excluir processo" })
      }
    }
  }

  const columns: GridColDef<ProcessoOutput>[] = [
    { field: "numero", headerName: "Número", width: 130 },
    {
      field: "dataCriacao",
      headerName: "Data Criação",
      width: 130,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) => {
        const data = params.row.dataCriacao ? new Date(params.row.dataCriacao) : null
        return data ? data.toLocaleDateString("pt-BR") : "Indefinida"
      },
    },
    {
      field: "requerente",
      headerName: "Requerente",
      flex: 1,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) =>
        params.row.requerente || "Anônimo",
    },
    {
      field: "responsavel",
      headerName: "Responsável",
      flex: 1,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) =>
        params.row.responsavel?.nome || "Não atribuído",
    },
    {
      field: "situacao",
      headerName: "Situação",
      flex: 1,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) =>
        params.row.situacao?.nome || "Indefinida",
    },
    {
      field: "encaminhamento",
      headerName: "Encaminhamento",
      flex: 1,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) =>
        params.row.encaminhamento?.nome || "Não definido",
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 180,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            onClick={() => router.push(`/processos/edit/${params.row.id}`)}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <GridDeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Lista de Processos
        </Typography>

        <TextField
          label="Buscar..."
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ display: "flex", height: "100%", width: "100%" }}>
          <DataGrid
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
        </div>
      </Box>
    </Container>
  )
}

const ListarProcessos = withPermissao(ListarProcessosContent, "Exibir", "Processo", {
  redirecionar: false,
})

export default ListarProcessos
