'use client' // 🔥 Garante que o ThemeProvider só rode no CLIENTE

import { ThemeProvider, createTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { useEffect, useState } from 'react'

const theme = createTheme() // 🔹 Criamos o tema no cliente

export default function ThemeRegistry({
  children
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div> // 🔥 Evita erro de Hydration Failed
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
