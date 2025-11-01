/**
 * Arquivo de layout raiz do App Router.
 *
 * Este módulo aplica estilos globais de bibliotecas compartilhadas e exporta o
 * layout raiz utilizado pelo Next.js App Router. O layout envolve a árvore de
 * componentes com `ClientRootLayout` (implementação client-side) e define o
 * idioma HTML padrão.
 */
import "@govbr-ds/core/dist/core.min.css"
import "@govbr-ds/core/dist/core-tokens.min.css"
import "@anpdgovbr/shared-ui/styles"
import "@/styles/input-overrides.css"

import ClientRootLayout from "@/app/layout.client"
import { globalMetadata } from "@/app/metadata"
// MUI + Next App Router (Next 16):
// Usamos o AppRouterCacheProvider no layout server para evitar erros de hidratação
// e garantir a injeção de CSS no <head> durante streaming.
// Observação: o pacote ainda expõe o caminho 'v15-appRouter', que funciona no Next 16.
// Quando a MUI publicar um path 'v16-appRouter', atualizar este import.
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"

/**
 * Metadados da aplicação reutilizando `globalMetadata`.
 *
 * Este export é usado pelo App Router do Next.js para fornecer metadados globais
 * (título, descrição, Open Graph, etc.). Mantido como alias para `globalMetadata`
 * para facilitar importações futuras e clareza sem duplicar informação.
 */
export const metadata = globalMetadata

/**
 * RootLayout — layout raiz do aplicativo.
 *
 * Props:
 * - children: árvore de elementos React que serão renderizados dentro do layout.
 *
 * Comportamento:
 * - Define a tag <html lang="pt-BR"> para toda a aplicação.
 * - Envolve o conteúdo em `ClientRootLayout`, que provê a renderização e
 *   providers do lado do cliente (ex.: contexts, notificações).
 *
 * Observações:
 * - As props usam `Readonly<{ children: React.ReactNode }>` para evitar mutações,
 *   seguindo a convenção do projeto.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ marginBottom: 0 }}>
        {/*
          Importante:
          - Envolver todo o conteúdo do <body> com AppRouterCacheProvider é o padrão
            recomendado pela MUI no App Router para coletar/streamar CSS corretamente.
          - O restante dos providers (tema, sessão etc.) permanecem no layout client.
        */}
        <AppRouterCacheProvider>
          <ClientRootLayout>{children}</ClientRootLayout>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
