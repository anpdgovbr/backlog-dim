"use client"

import { useEffect, useState } from "react"

import { useSession } from "next-auth/react"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { PageLayout } from "@/components/layouts"

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

  return (
    <PageLayout
      maxWidth="md"
      loading={status === "loading"}
      header={{
        title: "Meu Perfil",
        subtitle: "ANPD",
        description: "Gerencie suas informações pessoais e configurações de conta",
        variant: "default",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 4 }}>
          <Avatar src={session?.user?.image || ""} sx={{ width: 100, height: 100 }}>
            {session?.user?.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {session?.user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {session?.user?.email}
            </Typography>
            {loading ? (
              <Typography variant="body2" color="text.secondary">
                Carregando informações do perfil...
              </Typography>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  px: 2,
                  py: 0.5,
                  bgcolor: "primary.light",
                  borderRadius: 1,
                  display: "inline-block",
                }}
              >
                Perfil: {perfil ? perfil.nome : "Não definido"}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Configurações do Perfil
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Funcionalidade de edição de perfil em desenvolvimento...
          </Typography>
        </Box>
      </Box>
    </PageLayout>
  )
}
