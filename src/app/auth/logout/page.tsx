'use client'

import GovBrLoading from '@/components/GovBrLoading'
import { Box, Button, Typography } from '@mui/material'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LogoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handleLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Forçar limpeza completa da sessão
      await fetch('/api/auth/session', {
        method: 'DELETE'
      })

      // Redirecionamento imediato
      router.push('/')

      // Efetuar logout após redirecionamento
      await signOut({
        redirect: false,
        callbackUrl: '/'
      })
    } catch (err) {
      console.error(err)
      setError('Falha ao sair do sistema. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <GovBrLoading message="Saindo do sistema..." />
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '75vh',
          textAlign: 'center',
          p: 3
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>

        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => router.push('/')}
        >
          Ir para página inicial
        </Button>
      </Box>
    )
  }

  return null
}
