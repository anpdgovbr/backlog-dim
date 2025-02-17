import ClientRootLayout from './client-layout'
import { globalMetadata } from './metadata'
import '@/styles/style.css'
import '@/styles/global.css'

export const metadata = globalMetadata

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha384-o5b8ui/mW5SzMPDU/a8Jz3D4NyhC9A4gAB84vlM7Gq9C4Iy1b3uX6OymN4l5sZ4B"
          crossOrigin="anonymous"
        />
      </head>
      <body className="br-body">
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  )
}
