# Atualização do `@anpdgovbr/shared-types` para a API Quarkus de Controladores

## Contexto

- A nova API (`controladores-api-quarkus`) torna-se fonte única de verdade para Controladores (Requeridos), Setores, CNAEs e Encarregados.
- O pacote `@anpdgovbr/shared-types` deve refletir exatamente os contratos expostos pelo OpenAPI `controladores-openapi.json`.
- O pacote é compartilhado entre múltiplos repositórios (`backlog-dim`, portais públicos, ferramentas de auditoria). As mudanças precisam ser versionadas como release **minor** (ex.: `0.2.x`) e acompanhar notas de migração.

## 1. Ajustes em tipos base

- `BaseEntity.id`: trocar de `number` para `string` (UUID v4). Documentar que o formato segue regex `[a-f0-9-]{36}`.
- Introduzir alias `type UUID = string` exportado em `base/uuid.type.ts` para reforçar o contrato.
- `SoftDelete.exclusionDate`: aceitar `string | null` (ISO 8601) além de `Date`, pois a API retorna strings.
- Atualizar factories/mocks exportados (se houver) para gerar UUIDs (`crypto.randomUUID`).

## 2. Novos tipos auxiliares

- `EmailContatoDto` (`email: string`) – corresponde ao schema `EmailDTO`.
- `TelefoneContatoDto` (`codigoPais: string`, `telefone: string`) – corresponde ao schema `TelefoneDTO`.
- `PageResponseDto<T>` genérico (`data`, `page`, `pageSize`, `totalElements`, `totalPages`) alinhado ao schema `PageResponseDTO`.

## 3. DTOs de domínio

### 3.1 Controlador

- Renomear `ControladorDto` para refletir o contrato Quarkus:
  - **Campos obrigatórios**: `nomeEmpresarial`, `tipo`, `cpf`, `site`, `emails`, `telefones`, `politicaPrivacidadeUrl`, `setorEmpresarial`, `setorId`, `cnaeId`.
  - **Campos opcionais**: `id`, `nomeFantasia`, `cnpj`, `esfera`, `poder`, `setorNome`, `cnaeNome`, `active`, `exclusionDate`.
  - **Tipos**:
    - `id: UUID`
    - `setorId: UUID`
    - `cnaeId: UUID`
    - `emails: EmailContatoDto[]`
    - `telefones: TelefoneContatoDto[]`
    - `esfera?: Esfera`
    - `poder?: Poder`
    - `setorEmpresarial: SetorEmpresarial`
  - Remover campos antigos não presentes na API (`email`, `telefone`, `grupoEconomicoId`).
- Criar `ControladorResumoDto` (lista) e `ControladorDetalhadoDto` (inclui `encarregados` futuramente) apenas se necessário. Por ora, o DTO único já cobre retorno/entrada.

### 3.2 CNAE

- Atualizar `CnaeDto`:
  - `id: UUID`
  - `codigo: string`
  - `nome: string`
  - `active: boolean`
  - `exclusionDate?: string | null`
  - **Deprecar** alias `code`/`name` com comentário de migração e remoção na próxima major.

### 3.3 Setor

- Atualizar `SetorDto`:
  - `id: UUID`
  - `nome: string`
  - `active: boolean`
  - `exclusionDate?: string | null`
  - Garantir compatibilidade com o schema Quarkus (`required: ["nome"]`).

### 3.4 Encarregado

- Redefinir `EncarregadoDto`:
  - Campos obrigatórios: `nome`, `tipo`, `cpf`, `externo`, `emails`, `telefones`.
  - Opcionais: `id`, `cnpj`, `active`, `exclusionDate`.
  - Tipos: `id: UUID`, `tipo: TipoPessoaEnum`, `emails: EmailContatoDto[]`, `telefones: TelefoneContatoDto[]`.
  - Remover `controladorId`/`controladorEmpresaExternaId` (não existem no novo contrato). Alinhar relacionamento via endpoints específicos conforme decisão de integração.

## 4. Enums e constantes

- Introduzir novos enums exportados:
  - `SetorEmpresarial` → `PUBLICO`, `PRIVADO`.
  - `Esfera` → `MUNICIPAL`, `ESTADUAL`, `FEDERAL`.
  - `Poder` → `EXECUTIVO`, `LEGISLATIVO`, `JUDICIARIO`.
- Revisar `TipoControlador`:
  - Manter nome atual, mas alinhar literal string com o schema (`PESSOA_JURIDICA`, `PESSOA_NATURAL`). Avaliar renomeação para `TipoPessoa` nas próximas majors.

## 5. Interfaces utilitárias

- Atualizar `BaseQueryParams`:
  - Permitir `orderBy` com os novos campos (`nomeEmpresarial`, `codigo`, `nome`).
  - Garantir `page`, `pageSize` como `number`.
  - Adicionar `ascending?: boolean` padrão `true`.
- Criar `ControladoresFiltroDto` com campos opcionais aceitos pela API (`nome`, `cnpj`, `tipo`, `setorEmpresarial`, `esfera`, `poder`).

## 6. Impacto nos consumidores

- **backlog-dim**:
  - Ajustar hooks (`useControladores`, `useCnae`, `useSetor`, novo `useEncarregado`) para usar UUID string.
  - Formularios devem enviar/receber arrays (usar `EmailContatoDto`/`TelefoneContatoDto`).
  - Grids precisam considerar novos campos (`nomeEmpresarial`, `nomeFantasia`).
- **Portais públicos / dashboards**:
  - Revisar componentes que assumem `id: number`.
  - Atualizar formatações de telefone/e-mail para arrays.
- **Serviços de auditoria**:
  - Atualizar schemas de armazenamento/log que persistem `ControladorDto`/`EncarregadoDto`.

## 7. Estratégia de versionamento

1. Criar branch `feat/controladores-quarkus` no `shared-types`.
2. Implementar alterações acima + testes unitários.
3. Publicar release `0.2.0-beta.0` para validação integrada.
4. Após validação em `backlog-dim`, promover para `0.2.0`.
5. Atualizar changelog com seção de breaking changes (IDs agora são UUID, campos renomeados, arrays obrigatórios).

## 8. Tarefas complementares

- Atualizar `README.md` do pacote com tabela de compatibilidade (NestJS vs Quarkus).
- Gerar documentação TS/Typedoc refletindo novos tipos.
- Fornecer scripts de migração para transformar dados mockados (`number` → `UUID`) nos testes dos consumidores.
- Alinhar com o time backend contratos sobre campos obrigatórios (`cpf` para pessoa jurídica) para evitar divergências futuras.

---

> Esta documentação deve acompanhar o PR no `shared-types` e orientar os times consumidores na migração coordenada para a nova API Quarkus.
