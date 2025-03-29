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
  Switch,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"
import useSWR from "swr"
import useSWRImmutable from "swr/immutable"

function GerenciarPermissoesContent() {
  const { notify } = useNotification()
  const [perfilSelecionado, setPerfilSelecionado] = useState<number | "">("")

  const { data: perfis, isLoading: loadingPerfis } = useSWRImmutable<Perfil[]>(
    "/api/perfis",
    fetcher
  )

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
      console.error("Erro ao atualizar permissão:", error)
      notify({ type: "error", message: "Erro ao atualizar permissão" })
    }
  }

  const permissoesAgrupadas = useMemo(() => {
    if (!permissoes) return {}

    const agrupado: Record<string, Permissao[]> = {}
    permissoes.forEach((p) => {
      if (!agrupado[p.recurso]) agrupado[p.recurso] = []
      agrupado[p.recurso].push(p)
    })

    Object.keys(agrupado).forEach((recurso) => {
      agrupado[recurso].sort((a, b) => a.acao.localeCompare(b.acao))
    })

    return agrupado
  }, [permissoes])

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
        Gerenciar Permissões
      </Typography>

      {loadingPerfis ? (
        <CircularProgress />
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
        <Box sx={{ ...dataGridStyles, px: 2, py: 1 }}>
          {Object.entries(permissoesAgrupadas).map(([recurso, permissoesDoRecurso]) => (
            <Box key={recurso} sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                {recurso}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {permissoesDoRecurso.map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography>{p.acao}</Typography>
                    <Switch
                      checked={p.permitido}
                      onChange={() => handleTogglePermissao(p)}
                      inputProps={{ "aria-label": `Permissão ${p.acao}` }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
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
