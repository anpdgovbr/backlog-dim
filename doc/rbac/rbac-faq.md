# FAQ — RBAC Extraído

## Monorepo ou multi-repo?
Monorepo, com publicação por pacote. Facilita evolução coordenada. Se houver necessidade organizacional, pacotes podem ser destacados depois.

## Preciso mudar meu schema Prisma?
Não. O adapter aceita nomes configuráveis. O modelo atual (Perfil, Permissao, PerfilHeranca) é suportado.

## E se meu app não usar NextAuth?
Forneça um `IdentityResolver` próprio. O pacote `@org/rbac-next` aceita injeção.

## Posso usar sem Next.js?
Sim, ao usar `@org/rbac-core` + `@org/rbac-provider` + um adapter HTTP (ex.: futuro `@org/rbac-express`).

## Como lidar com cache?
Use o decorator TTL do provider. Para alterações administrativas, chame `invalidate()`.

## O cliente substitui a checagem no servidor?
Não. Hooks/HOC servem apenas à UX. Autorização forte deve ocorrer no servidor.

