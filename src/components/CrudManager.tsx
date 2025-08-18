"use client"

import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import CrudDataTable from "@/components/crud/CrudDataTable"
import CrudHeader from "@/components/crud/CrudHeader"
import CrudModal from "@/components/crud/CrudModal"
import DialogAlert from "@/components/ui/DialogAlert"
import usePermissoes from "@/hooks/usePermissoes"
import { useCrudManager } from "@/hooks/useCrudManager"

interface CrudManagerProps {
  entityName: string
  tableName: string
}

export default function CrudManager(props: Readonly<CrudManagerProps>) {
  const { entityName, tableName } = props

  const { permissoes, loading: loadingPerms } = usePermissoes()

  const {
    // Data
    items,
    totalRows,
    isLoading,

    // State
    selectedItem,
    itemToDelete,
    openModal,
    loadingDelete,
    paginationModel,

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
  } = useCrudManager(tableName)

  // Permissions
  const canView = !!permissoes["Exibir_Metadados"]
  const canAdd = !!permissoes["Cadastrar_Metadados"]
  const canEdit = !!permissoes["Editar_Metadados"]
  const canDelete = !!permissoes["Desabilitar_Metadados"]

  if (loadingPerms) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <Typography color="text.secondary">Carregando permissões...</Typography>
      </Box>
    )
  }

  if (!canView) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Você não tem permissão para visualizar este conteúdo.
        </Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "60vh",
        gap: 2,
        p: 2,
        bgcolor: "grey.25",
        borderRadius: 2,
      }}
    >
      <CrudHeader title={entityName} onAdd={openAddModal} canAdd={canAdd} />

      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <CrudDataTable
          items={items}
          totalRows={totalRows}
          isLoading={isLoading}
          paginationModel={paginationModel}
          onPaginationChange={setPaginationModel}
          onEdit={openEditModal}
          onDelete={requestDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </Box>

      <CrudModal
        open={openModal}
        onClose={closeModal}
        onSave={handleSave}
        item={selectedItem}
        onItemChange={updateSelectedItem}
        title={selectedItem.id ? `Editar ${entityName}` : `Adicionar ${entityName}`}
      />

      <DialogAlert
        open={!!itemToDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        loading={loadingDelete}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir "${itemToDelete?.nome}"?`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        severity="danger"
      />
    </Box>
  )
}
