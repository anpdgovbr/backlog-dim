import { prisma } from "@/lib/prisma"

/**
 * Mapeamento das entidades permitidas para metadados.
 *
 * Cada chave representa o identificador lógico usado pela aplicação para
 * referenciar uma entidade de metadados (ex.: 'situacao', 'responsavel').
 * O valor associado é o delegate do Prisma correspondente, que permite
 * operações de leitura/escrita contra a respectiva tabela/modelo.
 *
 * Observações:
 * - Este objeto é usado para validar parâmetros (por exemplo, rotas ou APIs)
 *   que recebem o nome da entidade e precisam resolver o delegate do Prisma.
 * - O objeto é exportado como `const` e tipado com `as const` para preservar
 *   as chaves literais no tipo resultante.
 *
 * Exemplo de uso:
 * const delegate = allowedEntities['situacao']
 * await delegate.findMany()
 *
 * @see prisma
 */
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

/**
 * Tipo que representa as chaves válidas de `allowedEntities`.
 *
 * Use `MetaEntidade` quando precisar aceitar ou validar programaticamente
 * o nome de uma entidade de metadados dentro da aplicação. Como as chaves
 * vêm de `allowedEntities` com `as const`, esse tipo é uma união literal
 * das strings permitidas (ex.: "situacao" | "encaminhamento" | ...).
 *
 * Exemplo:
 * function handleMetaEntity(kind: MetaEntidade) { /* ... *\/ }
 */
export type MetaEntidade = keyof typeof allowedEntities
