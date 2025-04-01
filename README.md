# 🏛 Backlog DIM - Gestão de Processamentos

Este projeto é uma **aplicação CRUD** para gerenciar **processamentos administrativos** relacionados à atuação da DIM na ANPD.  
Os dados são cadastrados manualmente via formulário ou importados por CSV, armazenados no **Supabase**, e organizados por perfis e permissões.

## 🚀 Funcionalidades

- 📌 **Cadastro e Edição de Processos**
- 📄 **Listagem com Filtros e Busca (MUI DataGrid)**
- 🧮 **Página de Edição Avançada com Permissões**
- 🗂 **Metadados Gerenciáveis: Situação, Forma de Entrada, Pedido de Manifestação, etc.**
- 👥 **Gerenciamento de Perfis, Permissões e Responsáveis**
- 🔐 **Autenticação via Entra ID (NextAuth)**

## 🏗 Tecnologias Utilizadas

- **Next.js 15.2.1**: Estrutura principal do projeto com suporte ao App Router, Middleware e Turbopack para desenvolvimento mais rápido.
- **React 19.0.0** e **React DOM**: Biblioteca base da aplicação com suporte às mais recentes funcionalidades do React.
- **Material UI 6.4.7 (MUI)**: Framework de componentes visuais com integração ao `@mui/x-data-grid` para listagens ricas em funcionalidades.
- **GovBR Design System 3.6.1**: Estilo visual padronizado segundo o Design System oficial do Governo Federal (via `@govbr-ds/core`).
- **Supabase 2.49.1**: Backend como serviço, com PostgreSQL, autenticação e storage – utilizado localmente com `npx supabase start`.
- **Prisma ORM 6.5.0**: ORM moderno e typesafe para acesso ao banco de dados PostgreSQL com suporte a seed, soft delete e relacionamentos.
- **NextAuth 4.24.7**: Autenticação com suporte a Entra ID (Microsoft Azure) via MSAL.
- **PapaParse 5.5.2**: Biblioteca utilizada para leitura e parsing de arquivos CSV.
- **Day.js 1.11.13**: Manipulação de datas leve e moderna.
- **SWR 2.3.3**: Hook de busca de dados com cache e revalidação automática.
- **React Hook Form 7.54.2**: Manipulação de formulários com performance e tipagem.
- **Emotion 11.14.0**: Solução de CSS-in-JS usada pelo MUI para estilização.
- **Sass 1.85.1**: Suporte à escrita de estilos em SCSS para estilos globais.
- **Multer 1.4.5-lts.1**: Middleware de upload utilizado para importação de arquivos.
- **Input Mask**: Suporte a máscaras nos campos (via `react-input-mask`, `text-mask-addons`).

## 📂 Estrutura do Projeto

```
📁 src/                       → Código-fonte principal do frontend
├── 📁 app/                  → App Router (Next.js 15)
│   ├── api/                → Endpoints REST com autenticação e permissões
│   ├── dashboard/          → Telas do sistema (Processos, Relatórios, Metadados)
│   ├── admin/              → Telas de administração (Perfis, Permissões)
│   ├── auth/               → Telas de login e logout
│   ├── perfil/             → Página de perfil do usuário logado
│   ├── acesso-negado/      → Página de acesso negado (sem permissão)
│   └── sobre/              → Página institucional "Sobre"
├── 📁 components/           → Componentes reutilizáveis agrupados por domínio
│   ├── processo/           → Componentes para CRUD de Processos
│   ├── requerido/          → Componentes para CRUD de Requeridos
│   ├── dashboard/          → Layout e widgets da dashboard
│   ├── notification/       → Sistema de notificações (TopNotification)
│   ├── menu/               → Menus laterais e flutuantes (Menu25Base, SideMenu)
│   └── ui/                 → Componentes genéricos de interface (Dialog, Loading...)
├── 📁 config/               → Arquivos de configuração do sistema (ex: NextAuth)
├── 📁 context/              → Context Providers globais (Sessão, Notificações, Auditoria)
├── 📁 hoc/                  → Higher-Order Components para controle de acesso (withPermissao)
├── 📁 hooks/                → Hooks customizados (ex: usePermissoes, usePode)
├── 📁 lib/                  → Utilitários e integrações (Prisma, Supabase, API wrappers)
│   ├── helpers/            → Funções auxiliares como auditoria e mapeamento de usuários
│   └── prisma/             → Helpers para queries específicas no Prisma
├── 📁 types/                → Tipagens TypeScript centralizadas (ex: Processo, Permissao, User)
├── 📁 styles/               → Estilos globais, temas e overrides (GovBR, MUI)
├── 📁 theme/                → Tema customizado do MUI + ThemeProvider
└── 📁 utils/                → Funções utilitárias isoladas (formUtils, parseId, colorUtils)

📁 prisma/                   → Migrations, schema e scripts de seed do Prisma
├── schema.prisma           → Definição do banco de dados (PostgreSQL)
├── seed.ts                 → Script de população inicial
└── migrations/             → Histórico das migrações geradas

📁 supabase/                → Configurações locais para rodar Supabase com Docker
├── config.toml            → Configuração do projeto
└── .branches/ & .temp/    → Dados internos do CLI

📁 scripts/                → Scripts auxiliares para build e CI
├── bump-version.cjs       → Incremento de versão
├── generateDevRoutes.ts   → Geração dinâmica de rotas em desenvolvimento
└── set-version-env.cjs    → Define variáveis de versão no ambiente

📁 public/                 → Arquivos públicos estáticos
└── dev-routes.json        → Arquivo gerado para debug de rotas dinâmicas

📁 .husky/                 → Hooks de Git para validações automáticas (lint, format)

📄 tsconfig.json           → Configuração do TypeScript
📄 eslint.config.mjs       → Configuração do ESLint
📄 .prettierrc             → Configuração do Prettier
📄 next.config.ts          → Configuração do Next.js
📄 package.json            → Dependências e scripts do projeto
📄 server.js               → Servidor customizado (usado em devs)
📄 README.md               → Documentação principal do projeto
```

## ⚙️ Instalação e Configuração

### 1️⃣ Clonando o Repositório

```sh
git clone https://github.com/anpdgovbr/backlog-dim.git
cd backlog-dim
```

### 2️⃣ Instalando Dependências

```sh
npm install
```

### 3️⃣ Configurando Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e preencha com os dados do Supabase:

```sh
cp .env.example .env
```

Exemplo de variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:54322/postgres"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
```

### 4️⃣ Iniciando o Supabase Local

Com Docker rodando e `.env` configurado, execute:

```sh
npx supabase start
```

### 5️⃣ Resetando e Populando o Banco

```sh
npx prisma migrate reset --force
npx prisma db seed
```

### 6️⃣ Rodando o Projeto

```sh
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

## 📦 Scripts – Desenvolvimento e Build

<details>
<summary>Mostrar scripts de build e desenvolvimento</summary>

| Script                 | Descrição                                             |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Inicia a aplicação com Turbopack e geração de rotas   |
| `npm run devs`         | Inicia o app via `server.js` (com https + cert)       |
| `npm run build`        | Compila a aplicação para produção                     |
| `npm run start`        | Inicia a aplicação em ambiente de produção            |
| `npm run build-routes` | Gera rotas para ambiente de desenvolvimento           |
| `npm run version:env`  | Define variáveis de versão da aplicação               |
| `npm run prebuild`     | Executa `version:env` e `build-routes` antes do build |

</details>

---

## 🔧 Prisma – Comandos Úteis

<details>
<summary>Mostrar comandos Prisma</summary>

| Comando                            | Descrição                                         |
| ---------------------------------- | ------------------------------------------------- |
| `npx prisma migrate reset --force` | Reseta e aplica as migrações do zero              |
| `npx prisma db push`               | Empurra modelo para o banco (sem criar migrações) |
| `npx prisma db seed`               | Executa o seed com dados iniciais                 |
| `npx prisma generate`              | Gera o cliente Prisma                             |
| `npx prisma studio`                | Abre o Prisma Studio (interface gráfica)          |

</details>

---

## 🧪 Scripts – Qualidade de Código

<details>
<summary>Mostrar scripts de lint e formatação</summary>

| Script                | Descrição                                  |
| --------------------- | ------------------------------------------ |
| `npm run lint`        | Executa o linter com base no Next.js       |
| `npm run lint-staged` | Aplica lint/prettier nos arquivos em stage |
| `npm run format`      | Formata todos os arquivos com Prettier     |
| `npm run pre-commit`  | Hook que roda lint-staged automaticamente  |

</details>

---

## 🗃 Scripts – Banco de Dados (Prisma)

<details>
<summary>Mostrar scripts relacionados ao Prisma</summary>

| Script                   | Descrição                                      |
| ------------------------ | ---------------------------------------------- |
| `npm run db:reset`       | Reseta e aplica migrações do banco             |
| `npm run db:seed`        | Executa seed do banco com dados iniciais       |
| `npm run prisma:migrate` | Aplica migração em ambiente de desenvolvimento |
| `npm run prisma:push`    | Aplica modelo Prisma direto para o banco       |
| `npm run prisma:reset`   | Reseta banco com migrações do zero             |
| `npm run prisma:seed`    | Executa o seed via Prisma                      |
| `npm run prisma:studio`  | Abre a interface Prisma Studio                 |

</details>

---

## 🧪 Scripts – Supabase Local

<details>
<summary>Mostrar scripts do Supabase</summary>

| Script                   | Descrição                                      |
| ------------------------ | ---------------------------------------------- |
| `npm run supabase:start` | Inicia containers do Supabase local via Docker |
| `npm run supabase:stop`  | Para containers do Supabase                    |
| `npm run supabase:reset` | Reinicia Supabase (stop + start)               |
| `npm run supabase:clean` | Remove containers e redes Docker do Supabase   |

</details>

## 📜 Licença

Este projeto é open-source e está licenciado sob **Creative Commons - Atribuição 4.0 Internacional (CC BY 4.0)**.

---

🚀 **Desenvolvido por e para a ANPD – Otimizando a gestão de requerimentos administrativos!**
