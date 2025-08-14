import useSWR from "swr"

import { useCallback, useMemo, useState } from "react"

import type { GridPaginationModel } from "@mui/x-data-grid"

import { useNotification } from "@/context/NotificationProvider"
import { fetcher } from "@/lib/fetcher"

interface Item {
  id: number
  nome: string
  active?: boolean
}

interface CrudState {
  selectedItem: Partial<Item>
  itemToDelete: Item | null
  openModal: boolean
  loadingDelete: boolean
  paginationModel: GridPaginationModel
}

export function useCrudManager(tableName: string) {
  const { notify } = useNotification()

  const [state, setState] = useState<CrudState>({
    selectedItem: { nome: "" },
    itemToDelete: null,
    openModal: false,
    loadingDelete: false,
    paginationModel: { page: 0, pageSize: 10 },
  })

  const { data, isLoading, mutate } = useSWR(
    `/api/meta/${tableName.toLowerCase()}?page=${state.paginationModel.page + 1}&pageSize=${state.paginationModel.pageSize}&orderBy=nome&ascending=true`,
    fetcher
  )

  const items: Item[] = useMemo(() => {
    if (!Array.isArray(data?.data)) return []
    return data.data.filter((item: Item) => item.active !== false)
  }, [data])

  const totalRows = data?.total ?? 0

  // Actions
  const openEditModal = useCallback((item: Item) => {
    setState((prev) => ({
      ...prev,
      selectedItem: { id: item.id, nome: item.nome },
      openModal: true,
    }))
  }, [])

  const openAddModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedItem: { nome: "" },
      openModal: true,
    }))
  }, [])

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      openModal: false,
      selectedItem: { nome: "" },
    }))
  }, [])

  const updateSelectedItem = useCallback((updates: Partial<Item>) => {
    setState((prev) => ({
      ...prev,
      selectedItem: { ...prev.selectedItem, ...updates },
    }))
  }, [])

  const requestDelete = useCallback(
    (id: number) => {
      const item = items.find((i) => i.id === id)
      if (!item) {
        notify({ type: "error", message: "Item não encontrado" })
        return
      }
      setState((prev) => ({ ...prev, itemToDelete: item }))
    },
    [items, notify]
  )

  const cancelDelete = useCallback(() => {
    setState((prev) => ({ ...prev, itemToDelete: null }))
  }, [])

  const setPaginationModel = useCallback((model: GridPaginationModel) => {
    setState((prev) => ({ ...prev, paginationModel: model }))
  }, [])

  const handleSave = useCallback(async () => {
    if (!state.selectedItem.nome?.trim()) {
      notify({ type: "warning", message: "Nome é obrigatório" })
      return
    }

    try {
      const method = state.selectedItem.id ? "PUT" : "POST"
      await fetch(`/api/meta/${tableName.toLowerCase()}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.selectedItem),
      })

      await mutate()
      notify({
        type: "success",
        message: `Item "${state.selectedItem.nome}" salvo com sucesso`,
      })
      closeModal()
    } catch (error) {
      notify({ type: "error", message: "Erro ao salvar item" })
      console.error(`Erro ao salvar ${tableName}:`, error)
    }
  }, [state.selectedItem, tableName, notify, mutate, closeModal])

  const confirmDelete = useCallback(async () => {
    if (!state.itemToDelete) return

    setState((prev) => ({ ...prev, loadingDelete: true }))

    try {
      const response = await fetch(`/api/meta/${tableName.toLowerCase()}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: state.itemToDelete.id }),
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        throw new Error(errorMessage.error || "Erro desconhecido ao excluir.")
      }

      await mutate()
      notify({
        type: "success",
        message: `Item "${state.itemToDelete.nome}" excluído com sucesso`,
      })
      cancelDelete()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Erro ao excluir "${state.itemToDelete?.nome}":`, error)
        notify({
          type: "error",
          message: `Erro ao excluir "${state.itemToDelete?.nome}": ${error.message}`,
        })
      }
    } finally {
      setState((prev) => ({ ...prev, loadingDelete: false }))
    }
  }, [state.itemToDelete, tableName, notify, mutate, cancelDelete])

  return {
    // Data
    items,
    totalRows,
    isLoading,

    // State
    selectedItem: state.selectedItem,
    itemToDelete: state.itemToDelete,
    openModal: state.openModal,
    loadingDelete: state.loadingDelete,
    paginationModel: state.paginationModel,

    // Actions
    openEditModal,
    openAddModal,
    closeModal,
    updateSelectedItem,
    requestDelete,
    cancelDelete,
    setPaginationModel,
    handleSave,
    confirmDelete,
  }
}
