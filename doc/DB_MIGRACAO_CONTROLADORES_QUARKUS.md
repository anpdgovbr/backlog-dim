# Migração do Backlog-DIM para controlar UUIDs de Requeridos

## Objetivo

Alinhar o banco do backlog-dim ao novo contrato da API Quarkus, que passa a expor
identificadores UUID (string) para Controladores/Requeridos, Requeridos Finais e
para os registros de auditoria vinculados a ações na API.

## Alterações no schema Prisma

- `Processo.requeridoId` → `String?`
- `Processo.requeridoFinalId` → `String?`
- `AuditLog.registroId` → `String?`

A migration `20250923120000_processos_requerido_uuid` altera os tipos no banco
(PostgreSQL) convertendo as colunas de `INTEGER` para `TEXT` com cast explícito.

```sql
ALTER TABLE "Processo"
  ALTER COLUMN "requeridoId" TYPE TEXT USING "requeridoId"::text,
  ALTER COLUMN "requeridoFinalId" TYPE TEXT USING "requeridoFinalId"::text;

ALTER TABLE "AuditLog"
  ALTER COLUMN "registroId" TYPE TEXT USING "registroId"::text;
```

## Passos para aplicar em ambientes existentes

1. **Atualizar dependências**

   ```bash
   pnpm install
   pnpm prisma generate
   ```

2. **Executar a migration**

   ```bash
   pnpm prisma migrate deploy
   ```

3. **Normalizar dados legados**
   - Para registros antigos com `requeridoId` numérico:
     - Decida se devem ser migrados para o respectivo UUID (quando conhecido) ou
       mantidos como string, ex.: `"123"`.
     - Caso opte por limpar valores inválidos, rodar:
       ```sql
       UPDATE "Processo" SET "requeridoId" = NULL WHERE "requeridoId" !~ '^[0-9a-f-]{36}$';
       UPDATE "Processo" SET "requeridoFinalId" = NULL WHERE "requeridoFinalId" !~ '^[0-9a-f-]{36}$';
       ```
   - Ajustar auditoria, se necessário, para refletir o novo identificador textual.

4. **Reprocessar caches/relatórios**
   - `npm run build`
   - `npm run lint && npm run type-check`

5. **Validar manualmente**
   - Criar/editar processo apontando para um requerido proveniente da nova API.
   - Confirmar que os registros de auditoria foram criados com `registroId`
     preenchido com o UUID retornado pelo Quarkus.

## Ajustes no código

- Formulários e hooks (`ProcessoForm`, `useProcessos`, `RequeridoDropdownSection`)
  agora tratam os IDs como strings.
- Proxy `/api/relatorios/top-requeridos` e testes usam UUIDs.
- Providers de auditoria aceitam `registroId` string ou número, convertendo para
  texto antes de gravar.

## Observações

- O banco continua aceitando strings arbitrárias; a validação de UUID é feita na
  camada de aplicação (via Zod) e no lado do Quarkus.
- Ambientes com dados legados baseados na API antiga podem manter os valores
  numéricos como texto durante o período de transição, mas recomenda-se
  preenchê-los com o UUID oficial antes de consolidar relatórios.
