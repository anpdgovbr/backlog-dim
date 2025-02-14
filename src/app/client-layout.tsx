'use client'

import { useEffect } from 'react'
import '@/styles/mui-overrides.css'

export default function ClientRootLayout({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Aguarda o carregamento do JavaScript do GovBR DS para evitar conflitos na hidratação
    import('../../public/govbr-ds/core.min.js')
  }, [])

  return (
    <html lang="pt-BR">
      <head>
        {/* Importando o CSS do GovBR DS */}
        <link rel="stylesheet" href="/govbr-ds/core.min.css" />
      </head>
      <body className="br-body">{children}</body>
    </html>
  )
}
