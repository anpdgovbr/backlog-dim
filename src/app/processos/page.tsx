'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridPaginationModel
} from '@mui/x-data-grid'
import SettingsIcon from '@mui/icons-material/Settings'
import GridDeleteIcon from '@mui/icons-material/Delete'
import { ProcessoOutput } from '@/types/Processo'

export default function ListaProcessos() {
  const [processos, setProcessos] = useState<ProcessoOutput[]>([])
  const [filteredData, setFilteredData] = useState<ProcessoOutput[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10
  })
  const [totalRows, setTotalRows] = useState(0) // 🔹 Total de registros no backend
  const router = useRouter()

  // Buscar dados da API
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
          setTotalRows(total) // 🔹 Atualiza o total de registros
        } else {
          console.error('Resposta inesperada da API:', data)
          setProcessos([])
          setFilteredData([])
        }
      } catch (error) {
        console.error('Erro ao buscar processos:', error)
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

  // Função para excluir um processo
  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este processo?')) {
      try {
        const response = await fetch(`/api/processos/${id}`, {
          method: 'DELETE'
        })
        const data = await response.json()

        if (response.ok) {
          setProcessos((prev) => prev.filter((item) => item.id !== id))
          setTotalRows((prev) => prev - 1) // 🔹 Atualiza total ao excluir
        } else {
          alert('Erro ao excluir: ' + data.error)
        }
      } catch (error) {
        alert('Erro ao excluir: ' + error)
      }
    }
  }

  // Definição das colunas da tabela
  const columns: GridColDef<ProcessoOutput>[] = [
    { field: 'numero', headerName: 'Número', width: 130 },
    {
      field: 'dataCriacao',
      headerName: 'Data Criação',
      width: 130,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) => {
        // Converter a string ISO para um objeto Date e formatar corretamente
        const data = params.row.dataCriacao
          ? new Date(params.row.dataCriacao)
          : null
        return data ? data.toLocaleDateString('pt-BR') : 'Indefinida'
      }
    },
    {
      field: 'requerente',
      headerName: 'Requerente',
      flex: 1,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) =>
        params.row.requerente || 'Anônimo'
    },
    {
      field: 'responsavel',
      headerName: 'Responsável',
      flex: 1,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) =>
        params.row.responsavel?.nome || 'Não atribuído'
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      flex: 1,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) =>
        params.row.situacao?.nome || 'Indefinida'
    },
    {
      field: 'encaminhamento',
      headerName: 'Encaminhamento',
      flex: 1,
      renderCell: (params: GridRenderCellParams<ProcessoOutput>) =>
        params.row.encaminhamento?.nome || 'Não definido'
    },
    {
      field: 'acoes',
      headerName: 'Ações',
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
      )
    }
  ]

  console.log('processos:', filteredData)

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
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

        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            loading={loading}
            paginationMode="server"
            rowCount={totalRows} // 🔹 Agora passamos `rowCount`
            paginationModel={paginationModel} // 🔹 Define modelo correto de paginação
            onPaginationModelChange={setPaginationModel} // 🔹 Atualiza o estado da paginação
          />
        </div>
      </Box>
    </Container>
  )
}
