# 🏛️ Backlog DIM - Sistema de Gestão de Processos

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://next-auth.js.org/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
[![Husky](https://img.shields.io/badge/Husky-black?style=for-the-badge&logo=husky&logoColor=white)](https://typicode.github.io/husky/)
[![Versão](https://img.shields.io/badge/versão-0.2.89-brightgreen?style=for-the-badge)](package.json)
[![Licença](https://img.shields.io/badge/licença-MIT-blue.svg?style=for-the-badge)](LICENSE)

O **Backlog DIM** é um sistema de gerenciamento de processos internos, desenvolvido para a ANPD (Autoridade Nacional de Proteção de Dados). A aplicação permite o controle, acompanhamento e gestão de processos, requerimentos, e entidades relacionadas, como requeridos e responsáveis.

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Tecnologias](#-tecnologias)
- [Guia de Instalação](#-guia-de-instalação)
  - [Pré-requisitos](#pré-requisitos)
  - [Passo a Passo](#passo-a-passo)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Gestão do Banco de Dados com Prisma](#-gestão-do-banco-de-dados-com-prisma)
- [Fluxo de CI/CD](#-fluxo-de-cicd)
- [Padrões de Código](#-padrões-de-código)
- [Como Contribuir](#-como-contribuir)
- [Licença](#-licença)

## 🔭 Visão Geral

Este sistema foi projetado para otimizar a gestão de processos administrativos na ANPD. Ele centraliza o registro de informações, permite o upload de dados via arquivos CSV e oferece uma interface rica para visualização, filtragem e edição de dados. A autenticação é integrada com o Azure Active Directory (Entra ID), garantindo o acesso seguro para os membros da organização.

## 🏗️ Arquitetura

A aplicação é um monorepo que utiliza o framework **Next.js**, aproveitando o **App Router** para renderização no servidor (SSR) e componentização.

- **Frontend:** Construído com **React**, **TypeScript** e **Material-UI (MUI)**, seguindo as diretrizes do **Design System do Gov.br**.
- **Backend:** As rotas da API são servidas pelo próprio Next.js na pasta `src/app/api`.
- **Banco de Dados:** Um banco de dados **PostgreSQL**, gerenciado pelo ORM **Prisma**.
- **Infraestrutura:** O **Supabase** é utilizado para provisionar o ambiente de desenvolvimento local (banco de dados, etc.) através do Docker.
- **Autenticação:** O **NextAuth.js** gerencia o fluxo de autenticação, utilizando o provedor do Azure AD.

## ✨ Funcionalidades Principais

- **Gestão de Processos:** CRUD completo para processos administrativos.
- **Visualização Avançada:** Tabela de dados com filtros, ordenação e busca em tempo real (MUI X DataGrid).
- **Importação em Massa:** Funcionalidade para importar processos a partir de arquivos CSV.
- **Controle de Acesso:** Sistema de perfis e permissões para granular o acesso às funcionalidades.
- **Auditoria:** Logs detalhados de criação, alteração e exclusão de registros importantes.
- **Dashboard:** Painéis com visões gerais e estatísticas (em desenvolvimento).
- **Gestão de Entidades:** CRUDs para entidades de apoio como Requeridos, Responsáveis, Situações, etc.

## 📂 Estrutura do Projeto

A estrutura de pastas segue as convenções do Next.js e foi organizada para separar claramente as responsabilidades.

```
/
├── .github/          # Workflows de CI/CD (GitHub Actions)
├── .husky/           # Git hooks para automatização de qualidade
├── docs/             # Documentação técnica e guias
│   ├── DESENVOLVIMENTO.md       # Guia completo de desenvolvimento
│   ├── ESLINT.md               # Configuração e uso do ESLint
│   ├── MODERNIZACAO_CONFIGURACOES.md # Processo de modernização
│   ├── RESOLUCAO_WARNINGS.md  # Documentação de warnings resolvidos
│   ├── VERSIONING.md           # Sistema de versionamento
│   └── ...                     # Outros documentos técnicos
├── prisma/           # Schema, migrações e seeds do Prisma
│   ├── migrations/   # Histórico de migrações do banco de dados
│   └── schema.prisma # Definição do esquema do banco de dados
├── public/           # Arquivos estáticos servidos diretamente
│   └── version.json  # Informações de versão e build
├── scripts/          # Scripts de automação e desenvolvimento
│   ├── bump-version-advanced.cjs  # Bump de versão com tipos
│   ├── fix-mui-imports-advanced.mjs # Correção avançada de imports MUI
│   ├── dev-server.mjs             # Servidor de desenvolvimento HTTPS
│   └── ...                        # Outros scripts utilitários
├── src/              # Código fonte da aplicação
│   ├── app/          # Coração da aplicação (App Router do Next.js)
│   │   ├── (admin)/  # Rotas e layouts específicos para a área administrativa
│   │   ├── (auth)/   # Rotas e lógica para autenticação de usuários
│   │   ├── api/      # Endpoints da API RESTful do backend
│   │   ├── dashboard/ # Páginas e componentes do dashboard principal
│   │   ├── perfil/   # Páginas e componentes para gestão de perfil do usuário
│   │   └── ...       # Outras rotas e páginas da aplicação
│   ├── components/   # Componentes React reutilizáveis (UI, formulários, modais, etc.)
│   │   ├── form/     # Componentes genéricos para construção de formulários
│   │   ├── ui/       # Componentes de UI básicos (botões, inputs, etc.)
│   │   └── ...       # Componentes específicos de domínio (processo, requerido)
│   ├── context/      # Provedores de contexto React para gerenciar estado global
│   ├── hooks/        # Hooks customizados para lógica de negócio e acesso a dados
│   ├── lib/          # Funções utilitárias, clientes de API, configurações e integrações
│   │   ├── api.ts    # Funções para interação com a API interna
│   │   ├── prisma/   # Configuração e instância do cliente Prisma
│   │   └── helpers/  # Funções auxiliares diversas
│   ├── schemas/      # Schemas de validação (Yup/Zod) para formulários e dados
│   ├── styles/       # Estilos globais, configurações de tema e overrides de CSS
│   └── utils/        # Funções utilitárias diversas (formatação, datas, validação)
├── .env.local.example # Template de variáveis de ambiente
├── eslint.config.mjs  # Configuração moderna do ESLint (flat config)
├── next.config.ts     # Configuração do Next.js otimizada
├── package.json       # Dependências e scripts do projeto
└── README.md          # Este arquivo
```

## 🌐 Endpoints da API

As rotas da API estão localizadas em `src/app/api` e seguem o padrão de roteamento do Next.js.

- `GET /api/processos`: Lista todos os processos.
- `POST /api/processos`: Cria um novo processo.
- `GET /api/processos/{id}`: Obtém um processo específico.
- `PUT /api/processos/{id}`: Atualiza um processo específico.
- `DELETE /api/processos/{id}`: Remove um processo.
- `POST /api/importar-processos`: Rota para o upload de arquivos CSV.
- `GET /api/usuarios`: Lista os usuários do sistema.
- `GET /api/perfis`: Lista os perfis de acesso.
- `GET /api/permissoes`: Lista as permissões.
- `GET /api/responsaveis`: Lista os responsáveis.
- `GET /api/cnaes`, `GET /api/controladores`: Endpoints para consumir microsserviços.
- `GET /api/auditoria`: Retorna os logs de auditoria.
- `GET /api/meta`: Fornece metadados para os formulários (situações, tipos, etc.).

## 💻 Tecnologias

| Categoria                | Tecnologia                                                                                                                | Versão  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------- | --------- |
| **Framework Fullstack**  | [Next.js](https://nextjs.org/)                                                                                            | 15.4.4  |
| **Linguagem**            | [TypeScript](https://www.typescriptlang.org/)                                                                             | 5.8.3   |
| **ORM**                  | [Prisma](https://www.prisma.io/)                                                                                          | 6.9.0   |
| **Banco de Dados**       | [PostgreSQL](https://www.postgresql.org/)                                                                                 | 15+     |
| **UI Framework**         | [React](https://react.dev/)                                                                                               | 18+     |
| **Componentes UI**       | [Material-UI (MUI)](https://mui.com/)                                                                                     | 6.x     |
| **Design System**        | [Gov.br Design System](https://www.gov.br/ds/) (`@govbr-ds/core`)                                                         | Latest  |
| **Autenticação**         | [NextAuth.js](https://next-auth.js.org/)                                                                                  | 4.24.11 |
| **Infraestrutura Local** | [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) + [Docker](https://www.docker.com/)                  | Latest  | //remover |
| **Validação de Dados**   | [Yup](https://github.com/jquense/yup) / [Zod](https://zod.dev/) (via Form Resolvers)                                      | Latest  |
| **Qualidade de Código**  | [ESLint](https://eslint.org/) (flat config), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/) | 9.31.0  |
| **Build Tool**           | [Turbopack](https://turbo.build/) (desenvolvimento)                                                                       | Next.js |

## 🚀 Guia de Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v20 ou superior)
- [NPM](https://www.npmjs.com/) (v9 ou superior)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started): `npm install -g supabase` //remover

### Passo a Passo

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/anpd/backlog-dim.git
    cd backlog-dim
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Copie o arquivo de exemplo e preencha com suas credenciais.

    ```bash
    cp .env.example .env
    ```

    _Consulte a seção [Variáveis de Ambiente](#-variáveis-de-ambiente) para mais detalhes._

4.  **Inicie o ambiente Supabase:** //remover
    Este comando irá subir os contêineres Docker com o PostgreSQL e outros serviços.

    ```bash
    npx supabase start
    ```

    Ao final, o CLI exibirá as credenciais do banco e da API. **Use-as para preencher o arquivo `.env`**.

5.  **Aplique as migrações do banco:**
    Este comando cria todas as tabelas definidas no `schema.prisma`.

    ```bash
    npx prisma migrate dev
    ```

6.  **Popule o banco com dados iniciais (opcional):**

    ```bash
    npm run db:seed
    ```

7.  **Execute a aplicação:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## 🔑 Variáveis de Ambiente

O arquivo `.env` é crucial para a configuração da aplicação. Use o `.env.example` como template.

| Variável                       | Descrição                                      | Exemplo (Local)                                           |
| ------------------------------ | ---------------------------------------------- | --------------------------------------------------------- |
| `DATABASE_URL`                 | String de conexão do PostgreSQL para o Prisma. | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| `NEXTAUTH_URL`                 | URL base da aplicação para o NextAuth.         | `http://localhost:3000`                                   |
| `NEXTAUTH_SECRET`              | Chave para assinar os tokens JWT.              | (Gerar com `openssl rand -base64 32`)                     |
| `AZURE_AD_CLIENT_ID`           | ID do Cliente da aplicação no Azure AD.        | (Obtido no portal do Azure)                               |
| `AZURE_AD_CLIENT_SECRET`       | Segredo do Cliente da aplicação no Azure AD.   | (Obtido no portal do Azure)                               |
| `AZURE_AD_TENANT_ID`           | ID do Tenant (diretório) do Azure AD.          | (Obtido no portal do Azure)                               |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Controle de verificação de certificados TLS.   | `0` (desenvolvimento) / `1` (produção)                    |

### 📋 Configuração Rápida

1. **Copie o template:**

   ```bash
   cp .env.example .env
   ```

2. **Configure o Supabase:** //remover

   ```bash
   npx supabase start
   # Use as credenciais exibidas para preencher o .env
   ```

3. **Configure o Azure AD:**
   - Acesse o [Portal do Azure](https://portal.azure.com)
   - Registre uma nova aplicação
   - Configure as URLs de redirect: `http://localhost:3000/api/auth/callback/azure-ad`
   - Copie as credenciais para o `.env.local`

## ⚙️ Scripts Disponíveis

| Comando                            | Descrição                                                  |
| ---------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                      | Inicia o servidor de desenvolvimento com Turbopack.        |
| `npm run dev:https`                | Inicia o servidor com HTTPS (certificados auto-assinados). |
| `npm run build`                    | Compila a aplicação para produção.                         |
| `npm run start`                    | Inicia o servidor de produção.                             |
| `npm run lint`                     | Executa o ESLint para análise de código.                   |
| `npm run format`                   | Formata o código com Prettier.                             |
| `npm run db:seed`                  | Popula o banco com dados do `prisma/seed.ts`.              |
| `npm run bump`                     | Incrementa a versão patch automaticamente.                 |
| `npm run bump:patch`               | Incrementa a versão patch (1.0.0 → 1.0.1).                 |
| `npm run bump:minor`               | Incrementa a versão minor (1.0.0 → 1.1.0).                 |
| `npm run bump:major`               | Incrementa a versão major (1.0.0 → 2.0.0).                 |
| `npm run fix:mui-imports`          | Corrige imports do Material-UI automaticamente.            |
| `npm run fix:mui-imports:advanced` | Correção avançada de imports MUI com otimizações.          |

## 🗄️ Gestão do Banco de Dados com Prisma

| Comando                    | Descrição                                                                      |
| -------------------------- | ------------------------------------------------------------------------------ |
| `npx prisma migrate dev`   | Cria e aplica uma nova migração a partir do `schema.prisma`.                   |
| `npx prisma generate`      | (Re)gera o Prisma Client após alterações no schema.                            |
| `npx prisma studio`        | Abre uma GUI web para visualizar e editar os dados do banco.                   |
| `npx prisma db push`       | Sincroniza o schema com o banco (não cria migrações, ideal para prototipagem). |
| `npx prisma migrate reset` | **CUIDADO:** Apaga o banco e aplica todas as migrações novamente.              |

## 🔄 Fluxo de CI/CD

O projeto utiliza **GitHub Actions** para Integração Contínua. O workflow em `.github/workflows/ci.yml` é acionado em cada `pull request` para a branch `stable` e executa:

1.  Instalação de dependências.
2.  Verificação de lint (`npm run lint`).
3.  Verificação de formatação (`npm run format`).
4.  Build do projeto (`npm run build`).

Isso garante que o código integrado à base principal esteja sempre funcional e padronizado.

## 🚀 Melhorias Recentes

### ✅ Correções de Build Implementadas

- **TypeScript:** Todos os erros de compilação resolvidos
- **ESLint:** Migração para flat config (v9.31.0) completa
- **NextAuth:** Compatibilidade com v4.24.11 garantida
- **Material-UI:** Imports otimizados automaticamente

### 🛠️ Scripts de Versionamento

Sistema robusto de bump de versão implementado:

```bash
# Incremento automático de patch
npm run bump

# Incrementos específicos
npm run bump:patch  # 1.0.0 → 1.0.1
npm run bump:minor  # 1.0.0 → 1.1.0
npm run bump:major  # 1.0.0 → 2.0.0
```

### 📚 Documentação Técnica

Documentação completa disponível em `/docs`:

- `DESENVOLVIMENTO.md` - Guia de desenvolvimento
- `ESLINT.md` - Configuração do ESLint
- `RESOLUCAO_WARNINGS.md` - Warnings resolvidos
- `VERSIONING.md` - Sistema de versionamento

### 🔒 Ambiente Seguro

- **HTTPS local:** Scripts dev:https com certificados auto-assinados
- **Variáveis TLS:** Configuração cross-platform para certificados
- **Git hooks:** Prevenção de commits com código problemático

## 🎨 Padrões de Código

### 🔧 Ferramentas de Qualidade

- **ESLint 9.31.0** com flat config para análise estática de código
- **Prettier** para formatação automática e consistente
- **Husky** para git hooks automatizados
- **lint-staged** para análise incremental nos commits

### 🏗️ Configurações Modernas

- **TypeScript 5.8.3** com strict mode ativado
- **Next.js 15.4.4** com App Router e Turbopack
- **Material-UI imports** otimizados automaticamente
- **Git hooks** previnem commits com código fora do padrão

### 📋 Comandos de Qualidade

```bash
# Análise e correção automática de código
npm run lint

# Formatação de todos os arquivos
npm run format

# Correção de imports Material-UI
npm run fix:mui-imports
npm run fix:mui-imports:advanced

# Verificação manual (dry-run)
npm run fix:mui-imports:dry
npm run fix:mui-imports:advanced:dry
```

### ⚙️ Integração Automática

Os hooks do git executam automaticamente:

- **Pre-commit:** ESLint + Prettier nos arquivos modificados
- **Pre-push:** Validação completa do build
- **Bump de versão:** Atualização automática da versão no commit

## 🤝 Como Contribuir

1.  **Faça um Fork** do repositório.
2.  **Crie uma branch** para a sua feature (`git checkout -b feature/nova-funcionalidade`).
3.  **Implemente** suas alterações.
4.  **Faça o commit** das suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade'`).
5.  **Envie para a sua branch** (`git push origin feature/nova-funcionalidade`).
6.  **Abra um Pull Request** para a branch `develop` do repositório original.

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
