# Testes (Vitest) — Mocks, Factories e Harness

Este documento descreve o padrão recomendado para criar testes unitários simples e estáveis no projeto.

## Aliases

O `vitest.config.ts` já resolve `@` para `src`. Use imports absolutos.

## Factories

Arquivo: `src/test/factories.ts`

- `createIdGenerator(start?)` — gerador incremental de IDs.
- `makePerfil`, `makePermissao`, `makeProcesso`, `makeUser` — entidades mínimas.
- `makeResponsavel`, `makeSituacao`, `makeFormaEntrada` — entidades auxiliares.
- `createModelMock(methods)` — cria objetos com métodos `vi.fn()`.

Exemplo:

```ts
import { makeProcesso } from "@/test/factories"

const p = makeProcesso({ numero: "P202501-0001" })
```

## Prisma Mock

Arquivo: `src/test/prisma-mock.ts`

- `createPrismaMock()` — cliente Prisma simulado com modelos comuns e `$transaction`.
- `mockTransactionOnce(prisma, tx)` — injeta um `tx` customizado para uma execução.

Exemplo de uso:

```ts
import { createPrismaMock, mockTransactionOnce } from "@/test/prisma-mock"
import { makeProcesso } from "@/test/factories"

const hoisted = vi.hoisted(() => ({ prisma: createPrismaMock() }))
vi.mock("@/lib/prisma", () => ({ prisma: hoisted.prisma }))

hoisted.prisma.processo.findMany.mockResolvedValueOnce([makeProcesso()])

const tx = { processo: { findFirst: vi.fn().mockResolvedValue(null), create: vi.fn() } }
mockTransactionOnce(
  hoisted.prisma as unknown as { $transaction: ReturnType<typeof vi.fn> },
  tx
)
```

## Harness de Rotas (withApi/withApiForId)

Arquivo: `src/test/route-harness.ts`

- `withApiMockModule()` — fabrica módulo para mockar `@/lib/withApi` com `vi.mock`.
- `withApiRbacNextMockModule()` — fabrica módulo para mockar `@anpdgovbr/rbac-next`.

Exemplo:

```ts
import { withApiMockModule } from "@/test/route-harness"

vi.mock("@/lib/withApi", () => withApiMockModule())
```

Esses harnesses injetam uma identidade de teste e convertem o retorno dos handlers em `Response`, simplificando asserts.

## Boas práticas

- Evite fixtures extensos; prefira factories com overrides pontuais.
- Não use `any`. Em mocks, prefira `unknown` + narrowing.
- Mantenha testes rápidos e determinísticos; sem chamadas a rede.
