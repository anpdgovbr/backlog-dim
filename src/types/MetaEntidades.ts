import { prisma } from "@/lib/prisma"

export const allowedEntities = {
  situacao: prisma.situacao,
  encaminhamento: prisma.encaminhamento,
  pedidomanifestacao: prisma.pedidoManifestacao,
  contatoprevio: prisma.contatoPrevio,
  evidencia: prisma.evidencia,
  formaentrada: prisma.formaEntrada,
  responsavel: prisma.responsavel,
  tiporeclamacao: prisma.tipoReclamacao,
} as const

export type MetaEntidade = keyof typeof allowedEntities
