"use client"

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
  Modal,
  TextField,
  Typography,
} from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useEffect, useState } from "react"

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

  async function fetchData() {
    setLoadingData(true)
    try {
      const res = await fetch(`/api/meta/${tableName.toLowerCase()}`)
      const data = await res.json()
      setItems(data.filter((item: any) => item.active !== false)) // 🔹 Só exibe itens ativos
    } catch (error) {
      console.error(`Erro ao buscar ${tableName}:`, error)
    }
    setLoadingData(false)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName])

  async function handleSave() {
    if (!selectedItem.nome.trim()) return alert("Nome não pode estar vazio.")

    try {
      const method = selectedItem.id ? "PUT" : "POST"
      await fetch(`/api/meta/${tableName.toLowerCase()}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedItem),
      })

      fetchData()
      setOpenModal(false)
      setSelectedItem({ nome: "" })
    } catch (error) {
      console.error(`Erro ao salvar ${tableName}:`, error)
    }
  }

  async function handleDelete(id: number) {
    const item = items.find((item) => item.id === id)
    if (!item) {
      alert("Item não encontrado.")
      return
    }

    if (
      !confirm(`Tem certeza que deseja excluir \"${item.nome}\" da tabela ${tableName}?`)
    )
      return

    try {
      const response = await fetch(`/api/meta/${tableName.toLowerCase()}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        throw new Error(errorMessage.error || "Erro desconhecido ao excluir.")
      }

      fetchData()
    } catch (error) {
      console.error(`Erro ao excluir \"${item.nome}\" de ${tableName}:`, error)
      alert(`Erro ao excluir \"${item.nome}\": ${(error as Error).message}`)
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "nome", headerName: "Nome", flex: 1 },
    {
      field: "acoes",
      headerName: "Ações",
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
            onClick={() => handleDelete(params.row.id)}
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
      {!permissoes["Exibir_Metadados"] && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Você não tem permissão para visualizar este conteúdo.
        </Alert>
      )}

      {permissoes["Exibir_Metadados"] && (
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
              height: "100%",
              width: "100%",
              mb: 2,
            }}
          >
            <DataGrid
              rows={items}
              columns={columns}
              loading={loadingData}
              pageSizeOptions={[5, 10, 20]}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
          </Box>
          <Modal
            open={openModal}
            onClose={() => {
              setOpenModal(false)
              setSelectedItem({ nome: "" })
            }}
          >
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
              <TextField
                fullWidth
                label="Nome"
                value={selectedItem.nome}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, nome: e.target.value })
                }
              />
              <Button onClick={handleSave}>Salvar</Button>
            </Box>
          </Modal>
        </>
      )}
    </Container>
  )
}
