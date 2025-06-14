# 🏛 Backlog DIM - Gestão de Processamentos

Este projeto é uma **aplicação CRUD** para gerenciar **processamentos administrativos**.  
Os dados são carregados via **formulário** ou **importação de CSV**, e armazenados no **Supabase**.

## 📑 Sumário
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Importação de CSV](#-importação-de-csv)
- [Prisma - Gerenciamento do Banco](#-prisma---gerenciamento-do-banco)
- [Licença](#-licença)

## 🚀 Funcionalidades

- 📌 **Cadastro de Processamentos**
- 📄 **Listagem com Filtros e Busca (MUI DataGrid)**
- 🔄 **Edição e Exclusão Direta na Tabela**
- 📂 **Importação de Processamentos via CSV**
- 📊 **Página de Detalhes de Processamento**
- 🔐 **Autenticação com Entra ID via NextAuth**
- 🗄 **Banco de Dados com Prisma + Supabase**

## 🏗 Tecnologias Utilizadas

- **Next.js 15 (App Router)**
- **React 19 + MUI (Material UI)**
- **Supabase (PostgreSQL + Autenticação)**
- **Prisma ORM**
- **PapaParse (Manipulação de CSV)**
- **GovBR Design System (Versão 3.6.1)**

## 📂 Estrutura do Projeto

```
📂 src/
 ├── 📂 app/
 │   ├── 📂 api/
 │   │   ├── auth/
 │   │   │   └── [...nextauth]/route.ts
 │   │   ├── processos/
 │   │   │   ├── route.ts
 │   │   │   ├── [id]/route.ts
 │   ├── auth/
 │   │   ├── login/page.tsx
 │   │   ├── logout/page.tsx
 │   ├── dashboard/
 │   │   ├── admin/
 │   │   │   ├── processo/page.tsx
 │   │   │   ├── responsaveis/page.tsx
 │   │   │   ├── setores/page.tsx
 │   │   ├── perfil/page.tsx
 │   │   ├── processos/page.tsx
 │   │   ├── importar/page.tsx
 ├── 📂 components/
 ├── 📂 config/
 ├── 📂 context/
 ├── 📂 lib/
 ├── 📂 styles/
 ├── 📂 types/
 ├── 📂 utils/
 ├── package.json
 ├── tsconfig.json
 ├── README.md
```

## 🛠️ Instalação e Configuração

### 1️⃣ Pré-Requisitos

Visual Studio Code, Git, Docker, NodeJs

Verificando instalação do NodeJs:
```sh
node -v
npm -v
```

Atualizando o NPM:
```sh
npm install -g npm@11.2.0
````
### 2️⃣ Clonando o Repositório

```sh
git clone https://github.com/anpdgovbr/backlog-dim.git
cd backlog-dim
```

Usar branch "alfa-04-audit-onServer"

### 3️⃣ Instalando Dependências

```sh
npm install
```

### 4️⃣ Configurando o Banco de Dados

Se estiver utilizando o **Supabase**, copie o arquivo de exemplo `.env.example` para `.env` e configure a **DATABASE_URL**:

```sh
cp .env.example .env
```

No arquivo `.env`, adicione:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
```

Se estiver utilizando o **Supabase**, pegue as credenciais do painel do Supabase.

### 5️⃣ Inicializando o Prisma e o Banco

Com o docker rodando, executar

```sh
npx supabase start --debug
```

```sh
npx prisma migrate dev --name init
npx prisma db seed  # Popula o banco de dados com informações iniciais
```

### 6️⃣ Rodando o Projeto

```sh
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

## 🔐 Autenticação

O login é realizado via Entra ID (NextAuth). Certifique-se de configurar as variáveis de ambiente corretamente e que o usuário tenha permissão de acesso.

## 📤 Importação de CSV

O formato do CSV esperado:

```
Responsável pelo atendimento;Nº do protocolo;Data da criação (Dia);Status;Tipo de solicitação;Denúncia anônima?;Ticket > Solicitante
Dagoberto Heg;2025011370273;13/02/2025;Solicitação;Denúncia;Não;MARIA TEREZA DA LUZ LACERDA
```

Para importar:

1. Acesse `/dashboard/processos/importar`
2. Faça upload do arquivo CSV
3. Confirme os dados antes de importar

## 🔧 Prisma - Gerenciamento do Banco

| Comando                                  | Descrição                                     |
|------------------------------------------|-----------------------------------------------|
| `npx prisma migrate dev --name init`     | Cria e aplica migrações no banco              |
| `npx prisma db push`                     | Atualiza o esquema do banco                   |
| `npx prisma db seed`                     | Popula o banco com dados iniciais             |
| `npx prisma generate`                    | Gera o cliente Prisma                         |
| `npx prisma studio`                      | Abre o Prisma Studio (interface gráfica)      |
| `npx prisma migrate reset --force`       | Reseta completamente o banco de dados         |

## 📜 Licença

Este projeto é open-source e segue a licença **MIT**.

---

🚀 **Desenvolvido para otimizar a gestão de processamentos administrativos de requerimentos da DIM!**
