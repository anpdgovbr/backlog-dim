# 📌 Configuração e Uso do Prisma no Projeto

Este projeto utiliza **Prisma ORM** para facilitar a integração com o banco de dados.

## **1️⃣ Instalando as Dependências**

Antes de começar, instale as dependências necessárias:

```sh
npm install prisma --save-dev
npm install @prisma/client
```

## **2️⃣ Inicializando o Prisma**

Se o Prisma ainda não foi inicializado no projeto, execute:

```sh
npx prisma init
```

Isso criará:

- O diretório **`prisma/`**
- O arquivo **`prisma/schema.prisma`**, onde você pode definir os modelos do banco de dados.
- Um arquivo **`.env`**, onde a string de conexão do banco será armazenada.

## **3️⃣ Configurando a Conexão com o Banco**

No arquivo **`.env`**, defina a variável **`DATABASE_URL`** apontando para seu banco PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

Caso esteja usando **Supabase**, utilize a URL fornecida no painel.

## **4️⃣ Criando e Aplicando as Migrações**

Após definir os modelos no arquivo `prisma/schema.prisma`, gere e aplique as migrações no banco de dados:

```sh
npx prisma migrate dev --name init
```

Isso cria a estrutura do banco com base nos modelos definidos.

## **5️⃣ Rodando o Seed (Inserindo Dados Iniciais)**

O projeto inclui um **seed** para popular o banco com valores iniciais. Para executar, use:

```sh
npx prisma db seed
```

Isso preencherá tabelas como **responsáveis, setores, formas de entrada, encaminhamentos, entre outras**.

## **6️⃣ Gerando o Cliente Prisma**

Sempre que alterar os modelos do Prisma, gere novamente o cliente Prisma:

```sh
npx prisma generate
```

Isso garante que o código TypeScript/JavaScript possa interagir corretamente com o banco.

## **7️⃣ Acessando o Banco via Prisma**

Você pode acessar o banco no código usando o **Prisma Client**:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const responsaveis = await prisma.responsavel.findMany()
  console.log(responsaveis)
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
```

## **8️⃣ Explorando o Banco com Prisma Studio**

O **Prisma Studio** oferece uma interface visual para gerenciar os dados do banco. Para abrir, execute:

```sh
npx prisma studio
```

Isso abrirá um painel no navegador onde você pode visualizar e editar registros.

---

## **📌 Resumo dos Comandos Mais Usados**

| Comando                              | Descrição                                         |
| ------------------------------------ | ------------------------------------------------- |
| `npm install prisma @prisma/client`  | Instala as dependências do Prisma                 |
| `npx prisma init`                    | Inicializa o Prisma no projeto                    |
| `npx prisma migrate dev --name init` | Cria e aplica a estrutura do banco                |
| `npx prisma db seed`                 | Popula o banco com dados iniciais                 |
| `npx prisma generate`                | Gera o cliente Prisma após mudanças no schema     |
| `npx prisma studio`                  | Abre a interface gráfica para visualizar os dados |

---

Agora, seu projeto está pronto para trabalhar com **Prisma + PostgreSQL**. 🚀  
Caso tenha dúvidas, consulte a [documentação oficial do Prisma](https://www.prisma.io/docs).
📌 1. Reset no Supabase
Se você resetar o banco do Supabase com:

sh
Copiar
Editar
npx supabase db reset
Ele apagará todas as tabelas e migrações, deixando o banco vazio.

📌 2. Rodar o Prisma para Reaplicar o Schema
Agora, você precisa rodar os comandos do Prisma para restaurar o esquema no banco.

✅ Passo 1: Aplicar migrações novamente

sh
Copiar
Editar
npx prisma migrate deploy
Isso reaplicará todas as migrações.

✅ Passo 2: Gerar o cliente do Prisma novamente

sh
Copiar
Editar
npx prisma generate
Isso garante que o Prisma reconhece a estrutura atual do banco.

✅ Passo 3: Rodar o Seed (se necessário) Se você tem um seed para popular tabelas iniciais:

sh
Copiar
Editar
npx tsx prisma/seed.ts
Ou, se estiver usando um arquivo .js:

sh
Copiar
Editar
node prisma/seed.js
📌 3. Testar Se o Banco Está OK
Depois de resetar o banco e rodar os scripts do Prisma, teste com:

✅ Verifique se Prisma consegue ler os dados do banco

sh
Copiar
Editar
npx prisma db pull
✅ Teste a conexão manualmente

sh
Copiar
Editar
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
Se tudo estiver certo, agora você pode rodar sua aplicação normalmente:

sh
Copiar
Editar
npm run dev
Se ainda houver erros, me envie a mensagem exata do console, que eu te ajudo! 🚀🔥
