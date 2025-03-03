'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Modal,
  TextField
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface CrudManagerProps {
  tableName: string
  entityName: string
}

export default function CrudManager({
  tableName,
  entityName
}: CrudManagerProps) {
  const [items, setItems] = useState<{ id: number; nome: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{
    id?: number
    nome: string
  }>({
    nome: ''
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from(tableName).select('*')

    if (error) {
      console.error(`Erro ao buscar ${entityName}:`, error)
    } else {
      setItems(data)
    }
    setLoading(false)
  }, [tableName, entityName])

  // 🟢 Buscar dados ao carregar
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 🟢 Criar ou Atualizar Registro
  async function handleSave() {
    if (!selectedItem.nome.trim()) return alert('Nome não pode estar vazio.')

    const { id, nome } = selectedItem
    let response

    if (id) {
      response = await supabase.from(tableName).update({ nome }).eq('id', id)
    } else {
      response = await supabase.from(tableName).insert({ nome })
    }

    if (response.error) {
      console.error(`Erro ao salvar ${entityName}:`, response.error)
    } else {
      fetchData()
      setOpenModal(false)
      setSelectedItem({ nome: '' })
    }
  }

  // 🟢 Excluir Registro
  async function handleDelete(id: number) {
    if (!confirm(`Tem certeza que deseja excluir este ${entityName}?`)) return

    const { error } = await supabase.from(tableName).delete().eq('id', id)

    if (error) {
      console.error(`Erro ao excluir ${entityName}:`, error)
    } else {
      fetchData()
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nome', headerName: 'Nome', flex: 1 },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedItem({ id: params.row.id, nome: params.row.nome })
              setOpenModal(true)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">{entityName}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Adicionar
        </Button>
      </Box>

      <Box display={'flex'} height={'100%'}>
        <DataGrid
          rows={items}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 20]}
        />
      </Box>

      {/* 🔹 Modal de Adição/Edição */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2
          }}
        >
          <Typography variant="h6">
            {selectedItem.id ? 'Editar' : 'Adicionar'} {entityName}
          </Typography>
          <TextField
            fullWidth
            label="Nome"
            value={selectedItem.nome}
            onChange={(e) =>
              setSelectedItem({ ...selectedItem, nome: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setOpenModal(false)} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Salvar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  )
}
