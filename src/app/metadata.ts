import { Metadata } from 'next'

export const globalMetadata: Metadata = {
  title: 'Sistema de Processamentos',
  description:
    'Gerenciamento de Processamentos usando o Padrão Digital de Governo',
  keywords: 'GovBR, Processamentos, Next.js, Design System',
  authors: [{ name: 'Seu Nome', url: 'https://seusite.com' }],
  openGraph: {
    title: 'Sistema de Processamentos',
    description: 'Gerenciamento de Processamentos',
    url: 'https://seusite.com',
    siteName: 'Sistema GovBR',
    images: [
      {
        url: 'https://seusite.com/imagem.jpg',
        width: 800,
        height: 600,
        alt: 'Imagem de Exemplo'
      }
    ],
    type: 'website'
  }
}
