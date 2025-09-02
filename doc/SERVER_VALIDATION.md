# Validação Server-side (Zod v4)

Este documento descreve a padronização da validação de entrada no servidor com Zod
e o formato de erros aplicado nos endpoints críticos.

## Objetivos

- Rejeitar payloads inválidos com HTTP 400 e corpo padronizado.
- Reduzir coerções manuais e erros de runtime.
- Garantir logging consistente das falhas de validação no servidor.

## Pacote e Helpers

- Pacote: `zod` (v4)
- Helper: `src/lib/validation.ts`
  - `readJson(req)`: faz o parse seguro do corpo JSON.
  - `validateOrBadRequest(schema, input, logContext)`: valida com Zod e retorna
    `Response` 400 padronizado quando inválido (com log server-side usando `console.warn`).
  - Erro padronizado:
    ```json
    {
      "error": "Invalid input",
      "details": [
        { "path": "campo.subcampo", "message": "mensagem de erro" }
      ]
    }
    ```

## Endpoints Atualizados

- `POST /api/processos`
  - Schema: `src/schemas/server/Processo.zod.ts` (`processoCreateSchema`).
  - Gera `numero` no servidor; valida inteiros, datas ISO e enums.

- `PUT /api/processos/[id]`
  - Schema: `processoUpdateSchema` (atualização parcial, com validações por campo).

- `POST /api/meta/[entidade]`, `PUT /api/meta/[entidade]`, `DELETE /api/meta/[entidade]`
  - Schemas: `metaCreateSchema`, `metaUpdateSchema`, `metaDeleteSchema`.
  - Valida `nome` e/ou `id` conforme operação.

- `POST /api/permissoes`
  - Schema: `permissaoCreateSchema`.
  - Exige `perfilId` ou `perfilNome`, `acao`, `recurso` e `permitido`.

- `PATCH /api/permissoes/[id]`
  - Schema: `permissaoPatchSchema`.
  - Valida `permitido: boolean`.

## Observações

- O logging de validação usa `console.warn` com o contexto do endpoint.
- Erros não relacionados à validação permanecem como 500 com `{ error: "Erro interno no servidor" }`.
- Em `PUT /api/processos/[id]`, quando um campo opcional for enviado explicitamente como `null`,
  ele é limpo no banco (setado para `null`). Quando o campo é omitido do payload, ele não é alterado.
- Em `PUT /api/processos/[id]`, a atualização de `numero` e `dataCriacao` permanece habilitada,
  mas poderá ser restringida futuramente por perfil (RBAC). Essa regra está documentada nos comentários do handler.
