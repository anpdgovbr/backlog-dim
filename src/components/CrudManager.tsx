"use client"

import { useNotification } from "@/context/NotificationProvider"
import usePermissoes from "@/hooks/usePermissoes"
import { fetcher } from "@/lib/fetcher"
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
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid"
import { DataGrid, GridAddIcon } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useCallback, useMemo, useState } from "react"
import useSWR from "swr"

import { GovBRInputModal } from "./modal/GovBRModal"
import DialogAlert from "./ui/DialogAlert"

interface CrudManagerProps {
  entityName: string
  tableName: string
}

interface Item {
  id: number
  nome: string
  active?: boolean
}

export default function CrudManager({ entityName, tableName }: CrudManagerProps) {
  const { permissoes, loading: loadingPerms } = usePermissoes()
  const { notify } = useNotification()

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Partial<Item>>({ nome: "" })
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const { data, isLoading, mutate } = useSWR(
    `/api/meta/${tableName.toLowerCase()}?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}&orderBy=nome&ascending=true`,
    fetcher
  )

  const items: Item[] = useMemo(() => {
    if (!Array.isArray(data?.data)) return []
    return data.data.filter((item: Item) => item.active !== false)
  }, [data])

  const totalRows = data?.total ?? 0

  async function handleSave() {
    if (!selectedItem.nome?.trim()) {
      notify({ type: "warning", message: "Nome é obrigatório" })
      return
    }

    try {
      const method = selectedItem.id ? "PUT" : "POST"
      await fetch(`/api/meta/${tableName.toLowerCase()}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedItem),
      })

      mutate()
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

  const handleDeleteRequest = useCallback(
    (id: number) => {
      const item = items.find((i) => i.id === id)
      if (!item) {
        notify({ type: "error", message: "Item não encontrado" })
        return
      }
      setItemToDelete(item)
    },
    [items, notify]
  )

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

      mutate()
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

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 60,
        align: "center",
        headerAlign: "center",
      },
      { field: "nome", headerName: "Nome", flex: 1 },
      {
        field: "acoes",
        headerName: "Ações",
        width: 150,
        sortable: false,
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
    ],
    [permissoes, handleDeleteRequest]
  )

  if (loadingPerms) return <Typography>Carregando permissões...</Typography>

  return (
    <Container maxWidth="lg" sx={{ p: 0, m: 0 }}>
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
              startIcon={<GridAddIcon />}
              onClick={() => {
                setSelectedItem({ nome: "" })
                setOpenModal(true)
              }}
            >
              Adicionar
            </Button>
          </Box>

          <Box sx={{ ...dataGridStyles, width: "100%", m: 0, mb: 2, p: 0 }}>
            <DataGrid
              sx={{ minHeight: "45vh" }}
              disableColumnMenu
              rows={items}
              columns={columns}
              loading={isLoading}
              pageSizeOptions={[5, 10, 20]}
              paginationMode="server"
              rowCount={totalRows}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
          </Box>

          <GovBRInputModal
            key={`modal-${selectedItem.id || "new"}`} // Isso faz o modal recriar somente quando o item muda
            open={openModal}
            onClose={() => {
              setOpenModal(false)
              setSelectedItem({ nome: "" })
            }}
            title={selectedItem.id ? "Editar item" : "Adicionar item"}
            onSubmit={handleSave}
            confirmText="Salvar"
            cancelText="Cancelar"
            disabled={!selectedItem.nome?.trim()}
          >
            <TextField
              autoFocus // Adiciona foco automático
              fullWidth
              size="small"
              variant="outlined"
              label="Nome"
              value={selectedItem.nome}
              sx={{ my: 1 }}
              onChange={(e) =>
                setSelectedItem((prev) => ({ ...prev, nome: e.target.value }))
              }
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
