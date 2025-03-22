"use client"

import { dataGridStyles } from "@/styles/dataGridStyles"
import { ProcessoOutput } from "@/types/Processo"
import GridDeleteIcon from "@mui/icons-material/Delete"
import SettingsIcon from "@mui/icons-material/Settings"
import { Box, Container, IconButton, TextField, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useEffect, useState } from "react"

import ModalEditarProcesso from "./ModalEditarProcesso"

export default function ProcessoDataGrid() {
  const [processos, setProcessos] = useState<ProcessoOutput[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [totalRows, setTotalRows] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [selectedProcessoId, setSelectedProcessoId] = useState<number | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/processos?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}&orderBy=dataCriacao&ascending=false&search=${encodeURIComponent(
          search
        )}`
      )
      const { data, total } = await response.json()

      if (Array.isArray(data)) {
        setProcessos(data)
        setTotalRows(total)
      } else {
        console.error("Resposta inesperada da API:", data)
        setProcessos([])
      }
    } catch (error) {
      console.error("Erro ao buscar processos:", error)
      setProcessos([])
    }
    setLoading(false)
  }

  // 🔄 Buscar dados sempre que paginação ou busca mudarem
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, search])

  // Excluir processo e atualizar corretamente o DataGrid
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este processo?")) {
      try {
        const response = await fetch(`/api/processos/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setTotalRows((prev) => prev - 1)

          if (processos.length === 1 && paginationModel.page > 0) {
            setPaginationModel((prev) => ({ ...prev, page: prev.page - 1 }))
          } else {
            fetchData()
          }
        } else {
          const data = await response.json()
          alert("Erro ao excluir: " + data.error)
        }
      } catch (error) {
        alert("Erro ao excluir: " + error)
      }
    }
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
      flex: 1,
      renderCell: (params) => params.row.requerente || "Anônimo",
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
      flex: 1,
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
            onClick={() => {
              setSelectedProcessoId(params.row.id)
              setOpenModal(true)
            }}
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
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Lista de Processos
        </Typography>

        <TextField
          label="Buscar..."
          variant="outlined"
          fullWidth
          sx={{ mb: 1 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Box sx={{ ...dataGridStyles, display: "flex", height: "100%", width: "100%" }}>
          <DataGrid
            disableColumnMenu
            disableColumnSorting
            rows={processos}
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
      </Box>

      <ModalEditarProcesso
        open={openModal}
        onClose={() => setOpenModal(false)}
        processoId={selectedProcessoId}
      />
    </Container>
  )
}
