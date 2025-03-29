"use client"

import { useNotification } from "@/context/NotificationProvider"
import withPermissao from "@/hoc/withPermissao"
import { fetcher } from "@/lib/fetcher"
import { dataGridStyles } from "@/styles/dataGridStyles"
import { Perfil } from "@/types/Perfil"
import { Responsavel } from "@/types/Responsavel"
import { UsuarioComResponsavel } from "@/types/User"
import { LinkOff } from "@mui/icons-material"
import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import useSWR from "swr"

function GerenciarPerfisContent() {
  const { status } = useSession()
  const { notify } = useNotification()

  const {
    data: usuarios = [],
    mutate,
    error,
    isLoading,
  } = useSWR<UsuarioComResponsavel[]>("/api/usuarios", fetcher)

  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfisRes, responsaveisRes] = await Promise.all([
          fetch("/api/perfis").then((res) => res.json()),
          fetch("/api/responsaveis").then((res) => res.json()),
        ])
        setPerfis(perfisRes)
        setResponsaveis(responsaveisRes)
      } catch (err) {
        console.error("Erro ao buscar dados:", err)
        notify({ type: "error", message: "Erro ao carregar perfis ou responsáveis" })
      }
    }
    fetchData()
  }, [notify])

  useEffect(() => {
    if (error) {
      notify({ type: "error", message: "Erro ao carregar usuários" })
    }
  }, [error, notify])

  const handlePerfilChange = async (userId: string, perfilId: number) => {
    try {
      const res = await fetch(`/api/usuarios/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfilId }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar perfil")

      notify({ type: "success", message: "Perfil atualizado com sucesso" })
      mutate()
    } catch (err) {
      console.error(err)
      notify({ type: "error", message: "Erro ao atualizar perfil" })
    }
  }

  const handleResponsavelChange = async (
    userId: string | null,
    responsavelId: number
  ) => {
    try {
      const res = await fetch("/api/responsaveis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, responsavelId }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar responsável")

      notify({ type: "success", message: "Responsável atualizado com sucesso" })
      mutate()
    } catch (err) {
      console.error(err)
      notify({ type: "error", message: "Erro ao atualizar responsável" })
    }
  }

  const columns: GridColDef<UsuarioComResponsavel>[] = [
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    {
      field: "perfilId",
      headerName: "Perfil",
      flex: 1,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <InputLabel>Perfil</InputLabel>
          <Select
            label="Perfil"
            value={params.row.perfilId || ""}
            onChange={(e) => handlePerfilChange(params.row.id, Number(e.target.value))}
          >
            <MenuItem value="">Selecione</MenuItem>
            {perfis.map((perfil) => (
              <MenuItem key={perfil.id} value={perfil.id}>
                {perfil.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "responsavelId",
      headerName: "Responsável",
      flex: 1,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <InputLabel>Responsável</InputLabel>
          <Select
            label="Responsável"
            value={params.row.responsavelId ?? ""}
            onChange={(e) =>
              handleResponsavelChange(params.row.id, Number(e.target.value))
            }
          >
            {responsaveis.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 100,
      renderCell: (params) => {
        const responsavel = responsaveis.find((r) => r.userId === params.row.id)
        return (
          responsavel && (
            <IconButton
              size="small"
              color="error"
              title="Desvincular responsável"
              onClick={() => handleResponsavelChange(null, responsavel.id)}
            >
              <LinkOff />
            </IconButton>
          )
        )
      },
    },
  ]

  if (status === "loading") {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ m: 0, p: 0 }}>
      <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
        Gerenciar Perfis
      </Typography>

      <Box
        sx={{
          ...dataGridStyles,
          height: 540,
          width: "100%",
        }}
      >
        <DataGrid
          rowHeight={60}
          disableColumnMenu
          disableColumnSorting
          getRowId={(row) => row.id}
          rows={usuarios}
          columns={columns}
          loading={isLoading}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </Container>
  )
}

const GerenciarPerfis = withPermissao(
  GerenciarPerfisContent,
  "Desabilitar",
  "Relatorios",
  { redirecionar: false }
)

export default GerenciarPerfis
