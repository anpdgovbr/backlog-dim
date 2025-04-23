"use client"

import { useNotification } from "@/context/NotificationProvider"
import withPermissao from "@/hoc/withPermissao"
import { fetcher } from "@/lib/fetcher"
import type { PermissaoDto } from "@anpd/shared-types"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"
import useSWR from "swr"

interface Perfil {
  id: number
  nome: string
}

const SuperAdminPage = () => {
  const { notify } = useNotification()
  const [perfilSelecionado, setPerfilSelecionado] = useState<number | null>(null)
  const [novoPerfil, setNovoPerfil] = useState<string>("")
  const [novaPermissao, setNovaPermissao] = useState({
    perfilId: "",
    acao: "",
    recurso: "",
    permitido: true,
  })

  // 🧩 Estados de expansão
  const [expandedMain, setExpandedMain] = useState<string | false>(false)
  const [expandedRecurso, setExpandedRecurso] = useState<string | false>(false)

  const { data: perfis, mutate: mutatePerfis } = useSWR<Perfil[]>("/api/perfis", fetcher)

  const { data: permissoes, mutate: mutatePermissoes } = useSWR<PermissaoDto[]>(
    perfilSelecionado !== null ? `/api/permissoes?perfilId=${perfilSelecionado}` : null,
    fetcher
  )

  const handleCriarPerfil = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!novoPerfil.trim()) return

    try {
      await fetch("/api/perfis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoPerfil }),
      })
      setNovoPerfil("")
      mutatePerfis()
    } catch (error) {
      console.error("Erro ao criar perfil:", error)
    }
  }

  const handleTogglePermissao = async (permissao: PermissaoDto) => {
    const novaPermissao = { ...permissao, permitido: !permissao.permitido }

    try {
      await fetch(`/api/permissoes/${permissao.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permitido: novaPermissao.permitido }),
      })
      mutatePermissoes()
      notify({ type: "success", message: "Permissão atualizada com sucesso" })
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error)
      notify({ type: "error", message: "Erro ao atualizar permissão" })
    }
  }

  const handleCriarPermissao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!novaPermissao.perfilId || !novaPermissao.acao || !novaPermissao.recurso) return

    try {
      await fetch("/api/permissoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          perfilId: Number(novaPermissao.perfilId),
          acao: novaPermissao.acao,
          recurso: novaPermissao.recurso,
          permitido: novaPermissao.permitido,
        }),
      })
      setNovaPermissao({ perfilId: "", acao: "", recurso: "", permitido: true })
      mutatePermissoes()
    } catch (error) {
      console.error("Erro ao criar permissão:", error)
    }
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
        Dashboard SuperAdmin
      </Typography>

      {/* Criar Novo Perfil */}
      <Accordion
        expanded={expandedMain === "perfil"}
        onChange={(_, isExpanded) => setExpandedMain(isExpanded ? "perfil" : false)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Criar Novo Perfil</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="form"
            onSubmit={handleCriarPerfil}
            sx={{ display: "flex", gap: 2 }}
          >
            <TextField
              label="Nome do Perfil"
              value={novoPerfil}
              onChange={(e) => setNovoPerfil(e.target.value)}
              required
            />
            <Button type="submit" variant="contained">
              Criar
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Gerenciar Permissões */}
      <Accordion
        expanded={expandedMain === "permissoes"}
        onChange={(_, isExpanded) => setExpandedMain(isExpanded ? "permissoes" : false)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Gerenciar Permissões</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Select
            value={perfilSelecionado ?? ""}
            onChange={(e) => setPerfilSelecionado(Number(e.target.value))}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Selecione um perfil</MenuItem>
            {perfis?.map((perfil) => (
              <MenuItem key={perfil.id} value={perfil.id}>
                {perfil.nome}
              </MenuItem>
            ))}
          </Select>

          {permissoes && permissoes.length > 0 ? (
            Object.entries(
              permissoes
                .sort((a, b) => a.acao.localeCompare(b.acao))
                .reduce(
                  (acc, p) => {
                    if (!acc[p.recurso]) acc[p.recurso] = []
                    acc[p.recurso].push(p)
                    return acc
                  },
                  {} as Record<string, PermissaoDto[]>
                )
            ).map(([recurso, permissoesRecurso]) => (
              <Accordion
                key={`recurso-${recurso}`}
                expanded={expandedRecurso === recurso}
                onChange={(_, isExpanded) =>
                  setExpandedRecurso(isExpanded ? recurso : false)
                }
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{recurso}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {permissoesRecurso.map((p) => (
                      <ListItem
                        key={p.id}
                        divider
                        secondaryAction={
                          <Switch
                            color="primary"
                            checked={p.permitido}
                            onChange={() => handleTogglePermissao(p)}
                          />
                        }
                      >
                        <ListItemText primary={p.acao} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body2">
              Nenhuma permissão disponível para o perfil selecionado.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Criar Nova Permissão */}
      <Accordion
        expanded={expandedMain === "nova"}
        onChange={(_, isExpanded) => setExpandedMain(isExpanded ? "nova" : false)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Criar Nova Permissão</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="form"
            onSubmit={handleCriarPermissao}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Select
              value={novaPermissao.perfilId}
              onChange={(e) =>
                setNovaPermissao({ ...novaPermissao, perfilId: e.target.value })
              }
              displayEmpty
              required
            >
              <MenuItem value="">Selecione um perfil</MenuItem>
              {perfis?.map((perfil) => (
                <MenuItem key={perfil.id} value={perfil.id}>
                  {perfil.nome}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label="Ação"
              required
              value={novaPermissao.acao}
              onChange={(e) =>
                setNovaPermissao({ ...novaPermissao, acao: e.target.value })
              }
            />
            <TextField
              label="Recurso"
              required
              value={novaPermissao.recurso}
              onChange={(e) =>
                setNovaPermissao({ ...novaPermissao, recurso: e.target.value })
              }
            />

            <Button type="submit" variant="contained">
              Criar Permissão
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Container>
  )
}

export default withPermissao(SuperAdminPage, "Desabilitar", "Relatorios", {
  redirecionar: false,
})
