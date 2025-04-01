import "@/styles/global.css"
import "@/styles/style.css"

import ClientRootLayout from "./client-layout"
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="br-body">
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  )
}
