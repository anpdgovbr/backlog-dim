'use client'

import { Container } from '@mui/material'
import DashboardAdmin from '@/components/DashboardAdmin'

export default function HomePage() {
  return (
    <Container component="main" sx={{ py: 2 }}>
      <DashboardAdmin />
    </Container>
  )
}
