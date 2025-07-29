import type { Metadata } from "next"

export const globalMetadata: Metadata = {
  title: "Fila de Processamento - ANPD",
  description:
    "Sistema interno para gestão de denúncias e petições relacionadas à LGPD, seguindo o Padrão Digital de Governo.",
  keywords:
    "ANPD, LGPD, Denúncias, Petições, GovBR, Next.js, Prisma, Design System, Fila de Processamento",
  authors: [{ name: "Luciano Édipo", url: "https://github.com/lucianoedipo" }],
  openGraph: {
    title: "Fila de Processamento - ANPD",
    description:
      "Aplicação interna da ANPD para acompanhamento e gestão de requerimentos relacionados à LGPD.",
    url: "https://hml-dim.anpd.gov.br/",
    images: [
      {
        url: "https://gov.br/anpd/assets/img/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fila de Processamento - ANPD",
      },
    ],
    type: "website",
  },
}
