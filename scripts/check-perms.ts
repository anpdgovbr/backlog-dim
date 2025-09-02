import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const invalidAcoes = await prisma.$queryRawUnsafe<{ acao: string }[]>(
    `SELECT DISTINCT acao FROM "Permissao" 
     WHERE acao NOT IN ('Exibir','Cadastrar','Editar','Desabilitar','VerHistorico','EditarProprio','EditarGeral','Alterar','Registrar','Acessar','Criar')`
  )

  const invalidRecursos = await prisma.$queryRawUnsafe<{ recurso: string }[]>(
    `SELECT DISTINCT recurso FROM "Permissao" 
     WHERE recurso NOT IN ('Processo','Responsavel','Metadados','Relatorios','Usuario','Permissoes','Auditoria','Admin')`
  )

  console.warn("Invalid acoes:", invalidAcoes)
  console.warn("Invalid recursos:", invalidRecursos)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
