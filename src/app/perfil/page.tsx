"use client"

import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface Perfil {
  id: number
  nome: string
}

export default function PerfilPage() {
  const { data: session } = useSession()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/perfil?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setPerfil(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [session?.user?.email])

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Meu Perfil
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 4 }}>
          <Avatar src={session?.user?.image || ""} sx={{ width: 100, height: 100 }}>
            {session?.user?.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="h6">{session?.user?.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              {session?.user?.email}
            </Typography>
            {loading ? (
              <CircularProgress size={20} sx={{ mt: 1 }} />
            ) : (
              <Typography variant="body1" color="primary" sx={{ mt: 1 }}>
                Perfil: {perfil ? perfil.nome : "Não definido"}
              </Typography>
            )}
          </Box>
        </Box>

        <Box component="form" sx={{ mt: 3 }}>
          <Typography variant="body1">Formulário de edição de perfil...</Typography>
        </Box>
      </Paper>
    </Container>
  )
}
