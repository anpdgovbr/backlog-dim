RBAC no Backlog-DIM — Integração Atual

- Pacotes: app usa `@anpdgovbr/rbac-*` publicados no npm (beta).
- Endpoints expostos:
  - `GET /api/perfis` — lista de perfis (já existente).
  - `GET /api/permissoes` — permissões efetivas do usuário atual.
  - `GET /api/permissoes?perfil=<id|nome>` — permissões de um perfil (admin view).
  - `POST /api/perfis` — cria um novo perfil `{ nome }`.
  - `POST /api/permissoes` — cria/atualiza explicitamente uma permissão `{ perfilId|perfilNome, acao, recurso, permitido }`.
  - `POST /api/permissoes/toggle` — alterna permitido de uma permissão de um perfil.
- Auditoria: alterações de permissões registradas em `AuditLog`.

RBAC Admin
- Página: `/rbac-admin` (protegida por permissão `Exibir/Permissoes`).
- Client configurável consumindo os endpoints acima; pode apontar para outra base via `baseUrl`.
- Composição: lista perfis e edita permissões com toggle.

Observações
- Prisma é opcional no RBAC; aqui usamos o adapter por conveniência do projeto.
- O admin consome HTTP, então outros projetos podem reaproveitar apontando endpoints equivalentes.
