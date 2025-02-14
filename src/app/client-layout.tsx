'use client'

import { useEffect } from 'react'
import '@/styles/mui-overrides.css'
import '../../public/govbr-ds/core.min.css'

export default function ClientRootLayout({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    import('../../public/govbr-ds/core.min.js')
  }, [])

  return (
    <html lang="pt-BR">
      <head>{/* Importando o CSS do GovBR DS */}</head>
      <body className="br-body">{children}</body>
    </html>
  )
}
