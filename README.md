# 🏛 Backlog DIM - Gestão de Processamentos

Este projeto é uma **aplicação CRUD** para gerenciar **processamentos administrativos**.  
Os dados são carregados via **formulário** ou **importação de CSV**, e armazenados no **Supabase**.

## 🚀 Funcionalidades

- 📌 **Cadastro de Processamentos**
- 📄 **Listagem com Filtros e Busca (MUI DataGrid)**
- 🔄 **Edição e Exclusão Direta na Tabela**
- 📂 **Importação de Processamentos via CSV**
- 📊 **Página de Detalhes de Processamento**
- 🗄 **Versionamento do Banco de Dados com Supabase**

## 🏗 Tecnologias Utilizadas

- **Next.js 15 (App Router)**
- **React + MUI (Material UI)**
- **Supabase (PostgreSQL + Autenticação)**
- **PapaParse (Manipulação de CSV)**
- **Tailwind CSS**
- **Padrão Digital de Governo (GovBR DS)**

## 📂 Estrutura do Projeto

```
📂 app/
 ├── 📂 processamentos/
 │   ├── 📜 page.tsx            # Formulário de cadastro de Processamentos
 │   ├── 📂 lista/
 │   │   ├── 📜 page.tsx        # Listagem dos Processamentos (MUI DataGrid)
 │   ├── 📂 importar/
 │   │   ├── 📜 page.tsx        # Importação de Processamentos via CSV
 │   ├── 📂 [id]/
 │   │   ├── 📜 page.tsx        # Página de Detalhes do Processamento
 ├── 📂 styles/
 ├── 📂 lib/
 │   ├── 📜 supabase.ts         # Configuração do Supabase
 ├── 📜 package.json            # Dependências do projeto
 ├── 📜 tsconfig.json           # Configuração do TypeScript
 ├── 📜 README.md               # Documentação do Projeto
```

## 🔧 Configuração do Banco de Dados (Supabase)

1️⃣ **Instalar o Supabase CLI**

```sh
npm install -g supabase
```

2️⃣ **Criar um projeto Supabase localmente**

```sh
npx supabase init
```

3️⃣ **Configurar o banco de dados**

```sh
npx supabase db push
```

## 📤 Importação de CSV

- **Formato do CSV esperado:**

```
Responsável pelo atendimento;Nº do protocolo;Data da criação (Dia);Status;Tipo de solicitação;Denúncia anônima?;Ticket > Solicitante
Dagoberto Heg;2025011370273;13/02/2025;Solicitação;Denúncia;Não;MARIA TEREZA DA LUZ LACERDA
```

- **Para importar:**
  - Acesse `/processamentos/importar`
  - Faça upload do arquivo CSV
  - Confirme os dados antes de importar

## 🏛 Design System do Governo (GovBR DS)

O projeto utiliza o **Padrão Digital de Governo (GovBR DS)** para garantir **acessibilidade e identidade visual governamental**.

## 📜 Licença

Este projeto é open-source e segue a licença **MIT**.

---

🚀 **Desenvolvido para otimizar a gestão de processamentos administrativos!**
