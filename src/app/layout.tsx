import "@govbr-ds/core/dist/core.min.css"
import "@govbr-ds/core/dist/core-tokens.min.css"
import "@anpdgovbr/shared-ui/styles"

import ClientRootLayout from "@/app/layout.client"
import { globalMetadata } from "@/app/metadata"

export const metadata = globalMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ marginBottom: 0 }}>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  )
}
