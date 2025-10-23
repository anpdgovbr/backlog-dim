"use client"

import useSWR from "swr"

import { useSession } from "next-auth/react"

import LinkOff from "@mui/icons-material/LinkOff"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Typography from "@mui/material/Typography"
import type { GridColDef } from "@mui/x-data-grid"
import { DataGrid } from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"

import { useNotification } from "@/context/NotificationProvider"
import { withPermissao } from "@anpdgovbr/rbac-react"
import { usePerfis } from "@/hooks/usePerfis"
import { useResponsaveis } from "@/hooks/useResponsaveis"
import { fetcher } from "@/lib/fetcher"
import { dataGridStyles } from "@/theme/dataGridStyles"
import type { UsuarioComResponsavel } from "@/types/User"

function GerenciarPerfisContent() {
  const { status } = useSession()
  const { notify } = useNotification()

  const { data: usuarios = [], mutate: mutateUsuarios } = useSWR<UsuarioComResponsavel[]>(
    "/api/usuarios",
    fetcher
  )

  const { perfis } = usePerfis()
  const { responsaveis, mutate: mutateResponsaveis } = useResponsaveis()

  const handlePerfilChange = async (userId: string, perfilId: string | number) => {
    try {
      const perfilIdToPersist = typeof perfilId === "string" ? Number(perfilId) : perfilId
      const res = await fetch(`/api/usuarios/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfilId: perfilIdToPersist }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar perfil")

      notify({ type: "success", message: "Perfil atualizado com sucesso" })
      mutateUsuarios()
    } catch (err) {
      console.error(err)
      notify({ type: "error", message: "Erro ao atualizar perfil" })
    }
  }

  const handleResponsavelChange = async (
    userId: string | null,
    responsavelId: string | number
  ) => {
    try {
      const responsavelIdToPersist =
        typeof responsavelId === "string" ? Number(responsavelId) : responsavelId
      const res = await fetch("/api/responsaveis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, responsavelId: responsavelIdToPersist }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar responsável")

      notify({ type: "success", message: "Responsável atualizado com sucesso" })
      mutateUsuarios()
      mutateResponsaveis()
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
            value={params.row.perfilId != null ? String(params.row.perfilId) : ""}
            onChange={(e) => handlePerfilChange(params.row.id, e.target.value)}
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
            value={
              params.row.responsavelId !== null && params.row.responsavelId !== undefined
                ? String(params.row.responsavelId)
                : ""
            }
            onChange={(e) => handleResponsavelChange(params.row.id, e.target.value)}
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
    <Box mx={2}>
      <Typography
        className="header-title"
        variant="h4"
        fontWeight="medium"
        sx={{ my: 2 }}
      >
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
          loading={false}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </Box>
  )
}

/**
 * Protege a tela de gestão de perfis/usuários exigindo permissão adequada.
 *
 * @remarks
 * Atualizado para `{acao: "Alterar", recurso: "Usuario"}`, refletindo o
 * domínio desta tela (atribuição de perfis e responsáveis a usuários).
 */
const GerenciarPerfis = withPermissao(GerenciarPerfisContent, "Alterar", "Usuario", {
  redirect: false,
})

export default GerenciarPerfis
