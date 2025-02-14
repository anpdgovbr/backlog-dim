import ClientRootLayout from './client-layout'
import { globalMetadata } from './metadata'

const metadata = globalMetadata
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}
