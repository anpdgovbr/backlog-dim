"use client"

import { Perfil } from "@/types/Perfil"
import { Permissao } from "@/types/Permissao"
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
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

export default function DashboardSuperAdmin() {
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [permissoes, setPermissoes] = useState<Permissao[]>([])
  const [perfilSelecionado, setPerfilSelecionado] = useState<number | null>(null)
  const [novoPerfil, setNovoPerfil] = useState("")
  const [novaPermissao, setNovaPermissao] = useState({
    perfilId: "",
    acao: "",
    recurso: "",
    permitido: true,
  })

  // 🔹 Buscar Perfis
  useEffect(() => {
    fetch("/api/perfis")
      .then((res) => res.json())
      .then(setPerfis)
  }, [])

  // 🔹 Buscar Permissões quando um perfil for selecionado
  useEffect(() => {
    if (perfilSelecionado !== null) {
      fetch(`/api/permissoes?perfilId=${perfilSelecionado}`)
        .then((res) => res.json())
        .then(setPermissoes)
    }
  }, [perfilSelecionado])

  // 🔹 Criar Novo Perfil
  const handleCriarPerfil = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!novoPerfil.trim()) return

    await fetch("/api/perfis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoPerfil }),
    })

    setNovoPerfil("")
    fetch("/api/perfis")
      .then((res) => res.json())
      .then(setPerfis)
  }

  // 🔹 Atualizar Permissão (Ativar/Desativar)
  const handleTogglePermissao = async (permissao?: Permissao) => {
    if (!permissao || permissao.id === undefined) {
      console.error("Erro: Permissão inválida", permissao)
      return
    }

    const novaPermissao = { ...permissao, permitido: !permissao.permitido }

    // Atualiza no frontend imediatamente
    setPermissoes((prev) => prev.map((p) => (p.id === permissao.id ? novaPermissao : p)))

    // Enviar atualização para a API
    try {
      const res = await fetch(`/api/permissoes/${permissao.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permitido: novaPermissao.permitido }),
      })

      if (!res.ok) {
        console.error("Erro ao atualizar permissão", await res.json())
      }
    } catch (err) {
      console.error("Erro ao chamar API de permissões:", err)
    }
  }

  // 🔹 Criar Nova Permissão
  const handleCriarPermissao = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!novaPermissao.perfilId || !novaPermissao.acao || !novaPermissao.recurso) return

    await fetch("/api/permissoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        perfilId: Number(novaPermissao.perfilId),
        acao: novaPermissao.acao.trim(),
        recurso: novaPermissao.recurso.trim(),
        permitido: novaPermissao.permitido,
      }),
    })

    setNovaPermissao({ perfilId: "", acao: "", recurso: "", permitido: true })
    fetch(`/api/permissoes?perfilId=${novaPermissao.perfilId}`)
      .then((res) => res.json())
      .then(setPermissoes)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard SuperAdmin
      </Typography>

      {/* 🔹 Seção de Gerenciar Perfis */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Gerenciar Perfis</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {perfis.map((perfil) => (
              <ListItem key={`perfil-${perfil.id}`} divider>
                <ListItemText primary={perfil.nome} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 🔹 Criar Novo Perfil */}
      <Accordion>
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
              variant="outlined"
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

      {/* 🔹 Gerenciar Permissões */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Gerenciar Permissões</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Select
            value={perfilSelecionado ?? ""}
            onChange={(e) => setPerfilSelecionado(Number(e.target.value))}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">Selecione um perfil</MenuItem>
            {perfis.map((perfil) => (
              <MenuItem key={perfil.id} value={perfil.id}>
                {perfil.nome}
              </MenuItem>
            ))}
          </Select>

          {perfilSelecionado !== null && permissoes.length > 0 ? (
            <List>
              {Object.entries(
                permissoes.reduce(
                  (acc, p) => {
                    if (!acc[p.recurso]) acc[p.recurso] = []
                    acc[p.recurso].push(p)
                    return acc
                  },
                  {} as Record<string, Permissao[]>
                )
              ).map(([recurso, permissoesRecurso]) => (
                <Accordion key={`recurso-${recurso}`}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{recurso}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {permissoesRecurso.map((p) => (
                        <ListItem key={`${p.id || p.acao}-${p.recurso}`}>
                          <ListItemText primary={p.acao} />
                          <Button
                            variant={p?.permitido ? "contained" : "outlined"}
                            color={p?.permitido ? "primary" : "secondary"}
                            onClick={() => p?.id && handleTogglePermissao(p)}
                          >
                            {p?.permitido ? "Desativar" : "Ativar"}
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          ) : (
            <Typography variant="body2">Nenhuma permissão disponível.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* 🔹 Criar Nova Permissão */}
      <Accordion>
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
              {perfis.map((perfil) => (
                <MenuItem key={perfil.id} value={perfil.id}>
                  {perfil.nome}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label="Ação"
              required
              onChange={(e) =>
                setNovaPermissao({ ...novaPermissao, acao: e.target.value })
              }
            />
            <TextField
              label="Recurso"
              required
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
