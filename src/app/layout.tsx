// Removendo imports CSS legados para migração shared-ui
// import "@/styles/global.css"
// import "@/styles/style.css"

import ClientRootLayout from "./layout.client"
import { globalMetadata } from "./metadata"

export const metadata = globalMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Font Awesome ainda necessário para alguns ícones */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ minWidth: "300px", margin: 0 }}>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  )
}
