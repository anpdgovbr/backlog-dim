"use client"

import { useEffect, useState } from "react"

import { useSession } from "next-auth/react"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

interface Perfil {
  id: number
  nome: string
}

export default function PerfilPage() {
  const { data: session, status } = useSession()
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

  if (status === "loading") {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 2, boxShadow: 2 }}>
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
