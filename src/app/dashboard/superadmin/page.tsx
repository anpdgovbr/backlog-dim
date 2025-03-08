"use client"

import { Perfil } from "@/types/Perfil"
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

export default function DashboardSuperAdmin() {
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [novoPerfil, setNovoPerfil] = useState("")

  useEffect(() => {
    fetch("/api/perfis")
      .then((res) => res.json())
      .then(setPerfis)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!novoPerfil.trim()) return

    await fetch("/api/admin/permissoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoPerfil }),
    })

    setNovoPerfil("") // Limpa o campo
    fetch("/api/perfis") // Recarrega a lista
      .then((res) => res.json())
      .then(setPerfis)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard SuperAdmin
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h6">Gerenciar Perfis</Typography>
          <List>
            {perfis.map((perfil) => (
              <ListItem key={perfil.id} divider>
                <ListItemText primary={perfil.nome} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2 }}>
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
      </Paper>
    </Container>
  )
}
