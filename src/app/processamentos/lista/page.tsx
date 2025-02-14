'use client'

import { supabase } from '@/lib/supabase'
import { ProcessamentosOutput } from '@/types/Requerimentos'

import SettingsIcon from '@mui/icons-material/Settings'
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
  GridDeleteIcon,
  GridRenderCellParams
} from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ListaProcessamentos() {
  const [processamentos, setProcessamentos] = useState<ProcessamentosOutput[]>(
    []
  )
  const [filteredData, setFilteredData] = useState<ProcessamentosOutput[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data, error } = await supabase.from('processamentos').select('*')

      if (error) {
        console.error('Erro ao buscar dados:', error.message)
      } else {
        setProcessamentos(data || [])
        setFilteredData(data || [])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const lowercasedFilter = search.toLowerCase()
    const filtered = processamentos.filter(
      (item) =>
        item.responsavel.toLowerCase().includes(lowercasedFilter) ||
        item.numero_protocolo.toString().includes(lowercasedFilter) ||
        item.status.toLowerCase().includes(lowercasedFilter)
    )
    setFilteredData(filtered)
  }, [search, processamentos])

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este processamento?')) {
      const { error } = await supabase
        .from('processamentos')
        .delete()
        .eq('id', id)
      if (error) {
        alert('Erro ao excluir: ' + error.message)
      } else {
        setProcessamentos((prev) => prev.filter((item) => item.id !== id))
      }
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'responsavel',
      headerName: 'Responsável',
      flex: 1,
      editable: true
    },
    { field: 'numero_protocolo', headerName: 'Protocolo', width: 130 },
    {
      field: 'data_criacao',
      headerName: 'Data Criação',
      width: 130,
      editable: true
    },
    { field: 'status', headerName: 'Status', width: 150, editable: true },
    { field: 'tipo_solicitacao', headerName: 'Tipo', width: 130 },
    {
      field: 'denuncia_anonima',
      headerName: 'Anônimo?',
      width: 120,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? 'Sim' : 'Não'
    },
    {
      field: 'ticket_solicitante',
      headerName: 'Solicitante',
      flex: 1,
      editable: true
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            onClick={() => router.push(`/processamentos/${params.row.id}`)}
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lista de Processamentos
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
            pagination
            checkboxSelection
            disableRowSelectionOnClick
            processRowUpdate={async (updatedRow) => {
              const { error } = await supabase
                .from('processamentos')
                .update(updatedRow)
                .eq('id', updatedRow.id)
              if (error) {
                alert('Erro ao atualizar: ' + error.message)
                return updatedRow
              }
              return updatedRow
            }}
          />
        </div>
      </Box>
    </Container>
  )
}
