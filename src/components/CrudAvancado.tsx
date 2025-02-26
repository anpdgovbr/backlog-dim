'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  CircularProgress
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'date' | 'boolean' | 'select'
  required?: boolean
  referenceTable?: string // Se for um select, de onde buscar os dados
}

interface CrudAvancadoProps {
  tableName: string
  entityName: string
  fields: FieldConfig[] // Configuração dos campos da entidade
}

export default function CrudAvancado({
  tableName,
  entityName,
  fields
}: CrudAvancadoProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>({})
  const [relatedData, setRelatedData] = useState<{ [key: string]: any[] }>({}) // Para selects dinâmicos

  useEffect(() => {
    fetchData()
    fetchRelatedData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data, error } = await supabase.from(tableName).select('*')

    if (error) {
      console.error(`Erro ao buscar ${entityName}:`, error)
    } else {
      setItems(data)
    }
    setLoading(false)
  }

  async function fetchRelatedData() {
    // Buscar dados das tabelas referenciadas
    const newRelatedData: { [key: string]: any[] } = {}
    for (const field of fields) {
      if (field.type === 'select' && field.referenceTable) {
        const { data } = await supabase
          .from(field.referenceTable)
          .select('id, nome')
        if (data) {
          newRelatedData[field.key] = data
        }
      }
    }
    setRelatedData(newRelatedData)
  }

  async function handleSave() {
    for (const field of fields) {
      if (field.required && !selectedItem[field.key]) {
        return alert(`O campo "${field.label}" é obrigatório.`)
      }
    }

    let response
    if (selectedItem.id) {
      response = await supabase
        .from(tableName)
        .update(selectedItem)
        .eq('id', selectedItem.id)
    } else {
      response = await supabase.from(tableName).insert(selectedItem)
    }

    if (response.error) {
      console.error(`Erro ao salvar ${entityName}:`, response.error)
    } else {
      fetchData()
      setOpenModal(false)
      setSelectedItem({})
    }
  }

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
    ...fields.map((field) => ({
      field: field.key,
      headerName: field.label,
      flex: 1,
      renderCell: (params: any) => {
        if (field.type === 'boolean') {
          return params.value ? 'Sim' : 'Não'
        }
        if (field.type === 'select' && relatedData[field.key]) {
          return (
            relatedData[field.key].find((item) => item.id === params.value)
              ?.nome || 'Não definido'
          )
        }
        return params.value
      }
    })),
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedItem(params.row)
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
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{entityName}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Adicionar
        </Button>
      </Box>

      <DataGrid
        rows={items}
        columns={columns}
        loading={loading}
        autoHeight
        pageSizeOptions={[5, 10, 20]}
      />

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2
          }}
        >
          <Typography variant="h6">
            {selectedItem.id ? 'Editar' : 'Adicionar'} {entityName}
          </Typography>

          {fields.map((field) => (
            <FormControl fullWidth key={field.key} sx={{ mt: 2 }}>
              <InputLabel>{field.label}</InputLabel>

              {field.type === 'text' || field.type === 'date' ? (
                <TextField
                  fullWidth
                  type={field.type}
                  value={selectedItem[field.key] || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      [field.key]: e.target.value
                    })
                  }
                />
              ) : field.type === 'boolean' ? (
                <Switch
                  checked={selectedItem[field.key] || false}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      [field.key]: e.target.checked
                    })
                  }
                />
              ) : field.type === 'select' && relatedData[field.key] ? (
                <Select
                  value={selectedItem[field.key] || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      [field.key]: e.target.value
                    })
                  }
                >
                  {relatedData[field.key].map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome}
                    </MenuItem>
                  ))}
                </Select>
              ) : null}
            </FormControl>
          ))}

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
