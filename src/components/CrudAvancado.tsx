"use client"

import { supabase } from "@/lib/supabase"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Box, Button, Container, IconButton, Modal, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useCallback, useEffect, useState } from "react"

import ProcessoForm from "./processo/ProcessoForm"

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
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [relatedData, setRelatedData] = useState<RelatedData>({})
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(0)
  const [relatedDataLoaded, setRelatedDataLoaded] = useState(false) // 🔹 Controla o carregamento

  /** 🔹 Busca dados da tabela (paginação) */
  const fetchData = useCallback(async () => {
    setLoading(true)

    const from = page * pageSize
    const to = from + pageSize - 1

    // 🔹 Buscar total de registros corretamente
    const { count, error: countError } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Erro ao contar registros:", countError)
    } else {
      setTotalCount(count || 0)
    }

    // 🔹 Buscar dados paginados corretamente
    const { data, error } = await supabase.from(tableName).select("*").range(from, to)

    if (error) {
      console.error(`Erro ao buscar ${entityName}:`, error)
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }, [page, pageSize, tableName, entityName])

  /** 🔹 Busca dados da tabela sempre que mudar a página ou o tamanho da página */
  useEffect(() => {
    fetchData()
  }, [fetchData, openModal]) //adicionado openModal para atualizar a tabela após fechar o modal

  /** 🔹 Busca apenas uma vez os dados relacionados */
  useEffect(() => {
    async function fetchRelatedData() {
      const newRelatedData: RelatedData = {}

      const promises = fields
        .filter((field) => field.type === "select" && field.referenceTable)
        .map(async (field) => {
          const { data } = await supabase.from(field.referenceTable!).select("id, nome")
          if (data) newRelatedData[field.key] = data
        })

      await Promise.all(promises) // 🔹 Aguarda todas as requisições terminarem
      setRelatedData(newRelatedData)
      setRelatedDataLoaded(true) // 🔹 Marca como carregado
    }

    if (!relatedDataLoaded) {
      fetchRelatedData()
    }
  }, [fields, relatedDataLoaded]) // 🔹 Só carrega uma vez

  /** 🔹 Função para deletar um item */
  async function handleDelete(id: number) {
    if (!confirm(`Tem certeza que deseja excluir este ${entityName}?`)) return

    const { error } = await supabase.from(tableName).delete().eq("id", id)
    if (error) {
      console.error(`Erro ao excluir ${entityName}:`, error)
    } else {
      fetchData() // 🔹 Atualiza a tabela após exclusão
    }
  }

  /** 🔹 Define as colunas do DataGrid */
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    ...fields.map((field) => ({
      field: field.key,
      headerName: field.label,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (field.type === "boolean") return params.value ? "Sim" : "Não"
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedItem(null) // 🔹 Resetando ao abrir o modal para Adicionar
            setOpenModal(true)
          }}
        >
          Adicionar
        </Button>
      </Box>

      <Box display={"flex"} width={"100%"} height={"100%"}>
        <DataGrid
          rows={items}
          columns={columns}
          loading={loading}
          rowCount={totalCount}
          paginationMode="server"
          pageSizeOptions={[5, 10, 20, 50, 100]}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
            setPage(newPage)
            setPageSize(newPageSize)
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        />
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
          <Typography variant="h6">
            {selectedItem ? "Editar" : "Adicionar"} {entityName}
          </Typography>
          <Box>
            {selectedItem?.id ? <ProcessoForm processoId={selectedItem.id} /> : "Add"}
          </Box>
        </Box>
      </Modal>
    </Container>
  )
}
