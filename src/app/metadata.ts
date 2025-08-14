import type { Metadata } from "next"

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
      name: "ANPD - Autoridade Nacional de Proteção de Dados",
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
