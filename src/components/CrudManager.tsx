"use client"

import { useNotification } from "@/context/NotificationProvider"
import usePermissoes from "@/hooks/usePermissoes"
import { dataGridStyles } from "@/styles/dataGridStyles"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useEffect, useState } from "react"

import { GovBRInputModal } from "./modal/GovBRModal"
import DialogAlert from "./ui/DialogAlert"

interface CrudManagerProps {
  entityName: string
  tableName: string
}

export default function CrudManager({ entityName, tableName }: CrudManagerProps) {
  const { permissoes, loading } = usePermissoes()
  const [items, setItems] = useState<{ id: number; nome: string }[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ id?: number; nome: string }>({
    nome: "",
  })
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [totalRows, setTotalRows] = useState(0)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nome: string } | null>(
    null
  )
  const [loadingDelete, setLoadingDelete] = useState(false)
  const { notify } = useNotification()

  async function fetchData() {
    setLoadingData(true)
    try {
      const res = await fetch(
        `/api/meta/${tableName.toLowerCase()}?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}&orderBy=nome&ascending=true`
      )
      const { data, total } = await res.json()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setItems(data.filter((item: any) => item.active !== false))
      setTotalRows(total)
    } catch (error) {
      console.error(`Erro ao buscar ${tableName}:`, error)
    }
    setLoadingData(false)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName, paginationModel])

  async function handleSave() {
    if (!selectedItem.nome.trim())
      return notify({ type: "warning", message: "Nome é obrigatório" })

    try {
      const method = selectedItem.id ? "PUT" : "POST"
      await fetch(`/api/meta/${tableName.toLowerCase()}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedItem),
      })

      fetchData()
      notify({
        type: "success",
        message: `Item "${selectedItem.nome}" salvo com sucesso`,
      })
      setOpenModal(false)
      setSelectedItem({ nome: "" })
    } catch (error) {
      notify({ type: "error", message: "Erro ao salvar item" })
      console.error(`Erro ao salvar ${tableName}:`, error)
    }
  }

  function handleDeleteRequest(id: number) {
    const item = items.find((item) => item.id === id)
    if (!item) {
      notify({ type: "error", message: "Item não encontrado" })
      return
    }
    setItemToDelete({ id: item.id, nome: item.nome })
  }

  async function confirmDelete() {
    if (!itemToDelete) return
    setLoadingDelete(true)

    try {
      const response = await fetch(`/api/meta/${tableName.toLowerCase()}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemToDelete.id }),
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        throw new Error(errorMessage.error || "Erro desconhecido ao excluir.")
      }

      fetchData()
      notify({
        type: "success",
        message: `Item "${itemToDelete.nome}" excluído com sucesso`,
      })

      setItemToDelete(null)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Erro ao excluir "${itemToDelete.nome}":`, error)
        notify({
          type: "error",
          message: `Erro ao excluir "${itemToDelete.nome}": ${error.message}`,
        })
      }
    } finally {
      setLoadingDelete(false)
    }
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 60,
      align: "center",
      headerAlign: "center",
      sortable: false,
    },
    { field: "nome", headerName: "Nome", flex: 1, sortable: false },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            disabled={!permissoes["Editar_Metadados"]}
            onClick={() => {
              setSelectedItem({ id: params.row.id, nome: params.row.nome })
              setOpenModal(true)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            disabled={!permissoes["Desabilitar_Metadados"]}
            onClick={() => handleDeleteRequest(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  if (loading) return <Typography>Carregando permissões...</Typography>

  return (
    <Container maxWidth="lg">
      {!permissoes["Exibir_Metadados"] ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Você não tem permissão para visualizar este conteúdo.
        </Alert>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4">{entityName}</Typography>
            <Button
              variant="contained"
              color="primary"
              disabled={!permissoes["Cadastrar_Metadados"]}
              onClick={() => {
                setSelectedItem({ nome: "" })
                setOpenModal(true)
              }}
            >
              Adicionar
            </Button>
          </Box>
          <Box
            sx={{
              ...dataGridStyles,
              display: "flex",
              width: "100%",
              mb: 2,
            }}
          >
            <DataGrid
              disableColumnMenu
              rows={items}
              columns={columns}
              loading={loadingData}
              pageSizeOptions={[5, 10, 20]}
              paginationMode="server"
              rowCount={totalRows}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
          </Box>
          <GovBRInputModal
            open={openModal}
            onClose={() => {
              setOpenModal(false)
              setSelectedItem({ nome: "" })
            }}
            title="Adicionar item"
            onSubmit={handleSave}
            confirmText="Salvar"
            cancelText="Cancelar"
            disabled={!selectedItem.nome.trim()}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Nome"
              value={selectedItem.nome}
              sx={{ my: 1 }}
              onChange={(e) => setSelectedItem({ ...selectedItem, nome: e.target.value })}
            />
          </GovBRInputModal>
        </>
      )}
      <DialogAlert
        open={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        loading={loadingDelete}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir "${itemToDelete?.nome}" da tabela ${tableName}?`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        severity="danger"
      />
    </Container>
  )
}
