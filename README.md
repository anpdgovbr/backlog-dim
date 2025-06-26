# 🏛️ Backlog DIM - Sistema de Gestão de Processos

![CI - Validação do Código](https://github.com/anpd/backlog-dim/actions/workflows/ci.yml/badge.svg)
[![Versão](https://img.shields.io/npm/v/backlog-dim?label=versão)](package.json)
[![Licença](https://img.shields.io/badge/licença-MIT-blue.svg)](LICENSE)

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
├── prisma/           # Schema, migrações e seeds do Prisma
│   ├── migrations/
│   └── schema.prisma
├── public/           # Arquivos estáticos
├── src/
│   ├── app/          # Coração da aplicação (App Router)
│   │   ├── (admin)/  # Rotas de administração (layout próprio)
│   │   ├── (auth)/   # Rotas de autenticação
│   │   ├── api/      # Endpoints do backend
│   │   └── ...
│   ├── components/   # Componentes React reutilizáveis
│   ├── context/      # Provedores de contexto React
│   ├── hooks/        # Hooks customizados
│   ├── lib/          # Funções utilitárias, clientes de API, etc.
│   ├── schemas/      # Schemas de validação (Yup)
│   └── styles/       # Estilos globais e configurações de tema
├── .env.example      # Arquivo de exemplo para variáveis de ambiente
├── package.json      # Dependências e scripts
└── README.md         # Este arquivo
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

| Categoria                | Tecnologia                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Framework Fullstack**  | [Next.js](https://nextjs.org/) (^15.3.4)                                                                    |
| **Linguagem**            | [TypeScript](https://www.typescriptlang.org/) (^5.8.3)                                                      |
| **ORM**                  | [Prisma](https://www.prisma.io/) (^6.10.1)                                                                  |
| **Banco de Dados**       | [PostgreSQL](https://www.postgresql.org/)                                                                   |
| **UI Framework**         | [React](https://react.dev/) (^19.1.0)                                                                       |
| **Componentes UI**       | [Material-UI (MUI)](https://mui.com/) (^7.1.2)                                                              |
| **Design System**        | [Gov.br Design System](https://www.gov.br/ds/) (`@govbr-ds/core`)                                           |
| **Autenticação**         | [NextAuth.js](https://next-auth.js.org/) (^4.24.11)                                                         |
| **Infraestrutura Local** | [Supabase CLI](https://supabase.com/docs/guides/cli) + [Docker](https://www.docker.com/)                    |
| **Validação de Dados**   | [Yup](https://github.com/jquense/yup) / [Zod](https://zod.dev/) (via Form Resolvers)                        |
| **Estilo e Qualidade**   | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/) |

## 🚀 Guia de Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v20 ou superior)
- [NPM](https://www.npmjs.com/) (v9 ou superior)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started): `npm install -g supabase`

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

4.  **Inicie o ambiente Supabase:**
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

O arquivo `.env` é crucial para a configuração da aplicação.

| Variável                        | Descrição                                      | Exemplo (Local)                                           |
| ------------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| `DATABASE_URL`                  | String de conexão do PostgreSQL para o Prisma. | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| `NEXTAUTH_URL`                  | URL base da aplicação para o NextAuth.         | `http://localhost:3000`                                   |
| `NEXTAUTH_SECRET`               | Chave para assinar os tokens JWT.              | (Gerar com `openssl rand -base64 32`)                     |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL pública da API do Supabase.                | `http://127.0.0.1:54321`                                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (pública) do Supabase.           | (Fornecida pelo `supabase start`)                         |
| `SUPABASE_SERVICE_ROLE_KEY`     | Chave de serviço (privada) do Supabase.        | (Fornecida pelo `supabase start`)                         |
| `AZURE_AD_CLIENT_ID`            | ID do Cliente da aplicação no Azure AD.        | (Obtido no portal do Azure)                               |
| `AZURE_AD_CLIENT_SECRET`        | Segredo do Cliente da aplicação no Azure AD.   | (Obtido no portal do Azure)                               |
| `AZURE_AD_TENANT_ID`            | ID do Tenant (diretório) do Azure AD.          | (Obtido no portal do Azure)                               |

## ⚙️ Scripts Disponíveis

| Comando                  | Descrição                                           |
| ------------------------ | --------------------------------------------------- |
| `npm run dev`            | Inicia o servidor de desenvolvimento com Turbopack. |
| `npm run build`          | Compila a aplicação para produção.                  |
| `npm run start`          | Inicia o servidor de produção.                      |
| `npm run lint`           | Executa o ESLint para análise de código.            |
| `npm run format`         | Formata o código com Prettier.                      |
| `npm run db:seed`        | Popula o banco com dados do `prisma/seed.ts`.       |
| `npm run supabase:start` | Inicia os serviços do Supabase via Docker.          |
| `npm run supabase:stop`  | Para os serviços do Supabase.                       |
| `npm run supabase:reset` | Reinicia o ambiente Supabase local.                 |

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

## 🎨 Padrões de Código

- **ESLint** e **Prettier** são usados para manter um estilo de código consistente.
- **Husky** e **lint-staged** rodam o linter e o formatador automaticamente antes de cada `git commit`, prevenindo a submissão de código fora do padrão.

## 🤝 Como Contribuir

1.  **Faça um Fork** do repositório.
2.  **Crie uma branch** para a sua feature (`git checkout -b feature/nova-funcionalidade`).
3.  **Implemente** suas alterações.
4.  **Faça o commit** das suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade'`).
5.  **Envie para a sua branch** (`git push origin feature/nova-funcionalidade`).
6.  **Abra um Pull Request** para a branch `develop` do repositório original.

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
