'use client' // 🔥 Agora, esse é o único "use client" necessário

import '@/styles/mui-overrides.css'
import '@govbr-ds/core/dist/core.css'
import { useEffect, useState } from 'react'
import ThemeRegistry from '@/context/ThemeRegistry' // 🔹 Importamos o ThemeProvider corrigido
import AuthProvider from '@/context/SessionProvider'
import GovBRAvatar from '@/components/GovBRAvatar'
import { Box, Typography } from '@mui/material'

export default function ClientRootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const script = document.createElement('script')
    script.src = '/govbr-ds/core-init.js'
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (!isClient) {
    return <p>Carregando...</p> // 🔥 Evita erro de Hydration Failed
  }

  return (
    <AuthProvider>
      <ThemeRegistry>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
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

          {/* 🔹 Conteúdo principal */}
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
      </ThemeRegistry>
    </AuthProvider>
  )
}
