'use client'

import DashboardAdmin from '@/components/DashboardAdmin'
import { Container, CssBaseline, ThemeProvider, useTheme } from '@mui/material'

export default function HomePage() {
  const theme = useTheme()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" sx={{ py: 2 }}>
        <DashboardAdmin />
      </Container>
    </ThemeProvider>
  )
}
