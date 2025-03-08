"use client"

import { supabase } from "@/lib/supabase"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Box, Button, Container, IconButton, Modal, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { useCallback, useEffect, useState } from "react"

interface FieldConfig {
  key: string
  label: string
  type: "text" | "date" | "boolean" | "select"
  required?: boolean
  referenceTable?: string
}

interface CrudAvancadoProps {
  tableName: string
  entityName: string
  fields: FieldConfig[]
}

interface Item {
  id?: number
  [key: string]: string | number | boolean | null | undefined
}

interface RelatedData {
  [key: string]: { id: number; nome: string }[]
}

export default function CrudAvancado({
  tableName,
  entityName,
  fields,
}: CrudAvancadoProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item>({})
  const [relatedData, setRelatedData] = useState<RelatedData>({})

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from(tableName).select("*")

    if (error) {
      console.error(`Erro ao buscar ${entityName}:`, error)
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }, [tableName, entityName])

  const fetchRelatedData = useCallback(async () => {
    const newRelatedData: RelatedData = {}
    for (const field of fields) {
      if (field.type === "select" && field.referenceTable) {
        const { data } = await supabase.from(field.referenceTable).select("id, nome")
        if (data) {
          newRelatedData[field.key] = data
        }
      }
    }
    setRelatedData(newRelatedData)
  }, [fields])

  useEffect(() => {
    fetchData()
    fetchRelatedData()
  }, [fetchData, fetchRelatedData])

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
        .eq("id", selectedItem.id)
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

    const { error } = await supabase.from(tableName).delete().eq("id", id)
    if (error) {
      console.error(`Erro ao excluir ${entityName}:`, error)
    } else {
      fetchData()
    }
  }

  const columns: GridColDef[] = [
    //{ field: 'id', headerName: 'ID', width: 80 },
    ...fields.map((field) => ({
      field: field.key,
      headerName: field.label,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (field.type === "boolean") {
          return params.value ? "Sim" : "Não"
        }
        if (field.type === "select" && relatedData[field.key]) {
          return (
            relatedData[field.key].find((item) => item.id === params.value)?.nome ||
            "Não definido"
          )
        }
        return params.value
      },
    })),
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
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
      ),
    },
  ]

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{entityName}</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">
            {selectedItem.id ? "Editar" : "Adicionar"} {entityName}
          </Typography>
          {/* Implementação do formulário */}
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
