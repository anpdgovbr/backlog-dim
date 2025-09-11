import { vi } from "vitest"
import { createModelMock } from "./factories"

/**
 * Cria um mock de cliente Prisma com modelos comuns usados nos testes.
 * Inclui um stub de `$transaction` que delega para a função fornecida.
 */
export function createPrismaMock() {
  const prisma = {
    processo: createModelMock([
      "count",
      "create",
      "findMany",
      "findFirst",
      "findUnique",
      "update",
      "groupBy",
    ]),
    user: createModelMock(["findUnique", "update"]),
    perfil: createModelMock(["findUnique"]),
    permissao: createModelMock(["findUnique", "upsert"]),
    auditLog: createModelMock(["create", "findMany", "count"]),
    // Meta delegates comuns
    situacao: createModelMock(["findMany", "create", "update", "findUnique", "count"]),
    encaminhamento: createModelMock([
      "findMany",
      "create",
      "update",
      "findUnique",
      "count",
    ]),
    pedidoManifestacao: createModelMock([
      "findMany",
      "create",
      "update",
      "findUnique",
      "count",
    ]),
    contatoPrevio: createModelMock([
      "findMany",
      "create",
      "update",
      "findUnique",
      "count",
    ]),
    evidencia: createModelMock(["findMany", "create", "update", "findUnique", "count"]),
    formaEntrada: createModelMock([
      "findMany",
      "create",
      "update",
      "findUnique",
      "count",
    ]),
    responsavel: createModelMock(["findMany", "create", "update", "findUnique", "count"]),
    tipoReclamacao: createModelMock([
      "findMany",
      "create",
      "update",
      "findUnique",
      "count",
    ]),
    $transaction: vi.fn(),
  }
  return prisma
}

/**
 * Auxiliar para configurar uma única execução de `$transaction`, passando `tx` customizado.
 */
export function mockTransactionOnce(
  prisma: { $transaction: ReturnType<typeof vi.fn> },
  tx: unknown
) {
  prisma.$transaction.mockImplementationOnce(async (fn: unknown) => {
    const run = fn as (t: unknown) => Promise<unknown>
    return run(tx)
  })
}
