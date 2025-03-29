"use client"

import { useNotification } from "@/context/NotificationProvider"
import withPermissao from "@/hoc/withPermissao"
import { fetcher } from "@/lib/fetcher"
import { dataGridStyles } from "@/styles/dataGridStyles"
import { Perfil } from "@/types/Perfil"
import { Permissao } from "@/types/Permissao"
import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useState } from "react"
import useSWR from "swr"
import useSWRImmutable from "swr/immutable"

function GerenciarPermissoesContent() {
  const { notify } = useNotification()
  const [perfilSelecionado, setPerfilSelecionado] = useState<number | "">("")
  const {
    data: perfis,
    isLoading: loadingPerfis,
    error: erroPerfis,
  } = useSWRImmutable<Perfil[]>("/api/perfis", fetcher)

  const {
    data: permissoes,
    isLoading: loadingPermissoes,
    mutate,
  } = useSWR<Permissao[]>(
    perfilSelecionado ? `/api/permissoes?perfilId=${perfilSelecionado}` : null,
    fetcher
  )

  const handleTogglePermissao = async (permissao: Permissao) => {
    const novaPermissao = { ...permissao, permitido: !permissao.permitido }

    try {
      await fetch(`/api/permissoes/${permissao.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permitido: novaPermissao.permitido }),
      })

      mutate()
      notify({
        type: "success",
        message: `Permissão ${novaPermissao.permitido ? "concedida" : "revogada"}`,
      })
    } catch (error) {
      console.error("Erro ao atualizar permissão", error)
      notify({ type: "error", message: "Erro ao atualizar permissão" })
    }
  }

  const columns: GridColDef<Permissao>[] = [
    { field: "acao", headerName: "Ação", flex: 1 },
    { field: "recurso", headerName: "Recurso", flex: 1 },
    {
      field: "permitido",
      headerName: "Permitido",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.row.permitido}
          onChange={() => handleTogglePermissao(params.row)}
        />
      ),
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
        Gerenciar Permissões
      </Typography>

      {loadingPerfis ? (
        <CircularProgress />
      ) : erroPerfis ? (
        <Typography color="error">Erro ao carregar perfis</Typography>
      ) : (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="perfil-select-label">Perfil</InputLabel>
          <Select
            labelId="perfil-select-label"
            value={perfilSelecionado}
            label="Perfil"
            onChange={(e) => setPerfilSelecionado(Number(e.target.value) || "")}
          >
            <MenuItem value="">Selecione um perfil</MenuItem>
            {perfis?.map((perfil) => (
              <MenuItem key={perfil.id} value={perfil.id}>
                {perfil.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {perfilSelecionado === "" ? (
        <Typography variant="body2">Selecione um perfil para ver permissões</Typography>
      ) : loadingPermissoes ? (
        <CircularProgress />
      ) : permissoes?.length ? (
        <Box sx={dataGridStyles}>
          <DataGrid
            rows={permissoes}
            columns={columns}
            getRowId={(row) => row.id}
            disableColumnMenu
            disableColumnSorting
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            autoHeight
          />
        </Box>
      ) : (
        <Typography variant="body2">
          Nenhuma permissão cadastrada para este perfil.
        </Typography>
      )}
    </Container>
  )
}

const GerenciarPermissoes = withPermissao(
  GerenciarPermissoesContent,
  "Desabilitar",
  "Relatorios",
  { redirecionar: false }
)

export default GerenciarPermissoes
