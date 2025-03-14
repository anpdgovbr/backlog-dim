"use client"

import { ProcessoOutput } from "@/types/Processo"
import GridDeleteIcon from "@mui/icons-material/Delete"
import SettingsIcon from "@mui/icons-material/Settings"
import { Box, Container, IconButton, Modal, TextField, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useEffect, useState } from "react"

import ProcessoForm from "./ProcessoForm"

export default function ProcessoDataGrid() {
  const [processos, setProcessos] = useState<ProcessoOutput[]>([])
  const [filteredData, setFilteredData] = useState<ProcessoOutput[]>([])
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
  // Buscar dados da API
  useEffect(() => {
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

  // Excluir processo e atualizar corretamente o DataGrid
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este processo?")) {
      try {
        const response = await fetch(`/api/processos/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          // Atualiza a quantidade total de registros
          setTotalRows((prev) => prev - 1)

          // Se a página atual ficou vazia após a exclusão, ajusta para a anterior
          if (processos.length === 1 && paginationModel.page > 0) {
            setPaginationModel((prev) => ({ ...prev, page: prev.page - 1 }))
          } else {
            // 🔄 Recarrega os processos para manter a quantidade correta na página
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

  // Definir colunas do DataGrid
  const columns: GridColDef<ProcessoOutput>[] = [
    { field: "numero", headerName: "Número", width: 130 },
    {
      field: "dataCriacao",
      headerName: "Data Criação",
      width: 130,
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
      width: 180,
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

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
          {selectedProcessoId && <ProcessoForm processoId={selectedProcessoId} />}
        </Box>
      </Modal>
    </Container>
  )
}
