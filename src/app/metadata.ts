import type { Metadata } from "next"

/**
 * Metadados globais da aplicação usados pelo App Router do Next.js.
 *
 * Este objeto segue a interface `Metadata` do Next.js e centraliza informações
 * de SEO e compartilhamento (título padrão e template, descrição, palavras-chave,
 * autores, publisher, instruções para robôs, Open Graph e ícones).
 *
 * É exportado como `globalMetadata` e pode ser utilizado nos layouts/rotas para
 * definir metadados padrão da aplicação.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */
export const globalMetadata: Metadata = {
  title: {
    default: "Backlog DIM - ANPD",
    template: "%s | Backlog DIM - ANPD",
  },
  description:
    "Sistema de gestão de processos administrativos relacionados à atuação da DIM na ANPD. Aplicação CRUD moderna, segura e escalável.",
  keywords: [
    "ANPD",
    "LGPD",
    "DIM",
    "processos administrativos",
    "gestão",
    "CRUD",
    "Next.js",
    "TypeScript",
    "Gov.br",
  ],
  authors: [
    {
      name: "ANPD - Agência Nacional de Proteção de Dados",
      url: "https://www.gov.br/anpd",
    },
  ],
  creator: "ANPD/CGTI/DDSS",
  publisher: "ANPD",
  robots: {
    index: false, // Sistema interno
    follow: false,
  },
  openGraph: {
    title: "Backlog DIM - ANPD",
    description:
      "Sistema de gestão de processos administrativos relacionados à atuação da DIM na ANPD.",
    type: "website",
    locale: "pt_BR",
    siteName: "Backlog DIM - ANPD",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
}
