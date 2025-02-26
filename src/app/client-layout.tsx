'use client'

import '@/styles/mui-overrides.css'
import '@govbr-ds/core/dist/core.css'
import { createTheme, ThemeProvider } from '@mui/material'
import GovBRAvatar from '@/components/GovBRAvatar'
import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'

export default function ClientRootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = createTheme()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/govbr-ds/core-init.js'
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh' // 🔥 Garante que a página ocupe a altura total da tela
        }}
      >
        {/* 🔹 Header fixo no topo */}
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: 2
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            color="white"
            letterSpacing={1}
          >
            Processamento Backlog DIM
          </Typography>

          <GovBRAvatar
            userName="Fulano"
            userImage="/govbr-ds/images/avatar.png"
            menuItems={[
              { label: 'Meu Perfil', href: '/perfil' },
              { label: 'Configurações do Perfil', href: '/configuracoes' },
              { label: 'Sair', href: '/logout' }
            ]}
          />
        </Box>

        {/* 🔹 Conteúdo principal ocupa o espaço disponível */}
        <Box
          component="main"
          sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {children}
        </Box>

        {/* 🔹 Footer fixado no final */}
        <Box
          component="footer"
          sx={{
            mt: 'auto',
            textAlign: 'center',
            py: 2,
            bgcolor: 'grey.200',
            borderTop: '1px solid #ccc'
          }}
        >
          <Typography variant="body2" color="textSecondary">
            (cc) {new Date().getFullYear()} Desenvolvido pela DDSS/CGTI -
            Autoridade Nacional de Proteção de Dados.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
