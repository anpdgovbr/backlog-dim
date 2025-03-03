'use client'

import { useSession } from 'next-auth/react'
import { Container, Typography, Box, Paper, Avatar } from '@mui/material'

export default function PerfilPage() {
  const { data: session } = useSession()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Meu Perfil
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
          <Avatar
            src={session?.user?.image || ''}
            sx={{ width: 100, height: 100 }}
          >
            {session?.user?.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="h6">{session?.user?.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              {session?.user?.email}
            </Typography>
          </Box>
        </Box>

        <Box component="form" sx={{ mt: 3 }}>
          {/* Adicione aqui os campos do formulário de perfil */}
          <Typography variant="body1">
            Formulário de edição de perfil...
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
