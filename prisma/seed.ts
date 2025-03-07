import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando Seed...")

  // Responsáveis
  await prisma.responsavel.createMany({
    data: [
      { nome: "Camila Romero" },
      { nome: "Dagoberto Heg" },
      { nome: "Danubia Durand" },
      { nome: "DIM/CGF" },
      { nome: "Fernanda Pereira" },
      { nome: "Jean Frederick" },
      { nome: "Kelly Resqueti Paz" },
      { nome: "Tatiana Silva" },
      { nome: "Vanessa Mendes" }
    ],
    skipDuplicates: true
  })

  // Setores (Corrigido para usar "nome")
  await prisma.setor.createMany({
    data: [
      { nome: "Bancos, Financeiras e Administradoras de Cartão" },
      { nome: "Tecnologia" },
      { nome: "Saúde" },
      { nome: "Serviços" },
      { nome: "Varejo" }
    ],
    skipDuplicates: true
  })

  // Formas de Entrada (Corrigido para usar "nome")
  await prisma.formaEntrada.createMany({
    data: [
      { nome: "Ouvidoria" },
      { nome: "SEI" },
      { nome: "SEI - CIS" },
      { nome: "Sistema de Requerimentos" }
    ],
    skipDuplicates: true
  })

  // Encaminhamentos (Corrigido para usar "nome")
  await prisma.encaminhamento.createMany({
    data: [
      { nome: "Aguardando análise" },
      { nome: "Cancelado pelo titular/denunciante" },
      { nome: "Encaminhado para FIS" },
      { nome: "Encaminhado para TIS" },
      { nome: "Requerimento Individualizado" }
    ],
    skipDuplicates: true
  })

  // Situações do Processamento (Corrigido para usar "nome")
  await prisma.situacao.createMany({
    data: [
      { nome: "Em trâmite - aguardando análise" },
      { nome: "Em trâmite - aguardando FIS/TIS" },
      { nome: "Encaminhado para fiscalização" }
    ],
    skipDuplicates: true
  })

  // Pedidos de Manifestação (Corrigido para usar "nome")
  await prisma.pedidoManifestacao.createMany({
    data: [
      { nome: "Sim - Controlador Respondeu" },
      { nome: "Sim - Controlador não Respondeu" },
      { nome: "Não se aplica" }
    ],
    skipDuplicates: true
  })

  // Contatos Prévios (Corrigido para usar "nome")
  await prisma.contatoPrevio.createMany({
    data: [
      { nome: "Correio Eletrônico (e-mail)" },
      { nome: "Ligação telefônica" },
      { nome: "Reclame Aqui/Procon" },
      { nome: "N/A" }
    ],
    skipDuplicates: true
  })

  // Evidências (Corrigido para usar "nome")
  await prisma.evidencia.createMany({
    data: [
      { nome: "Boletim de Ocorrência" },
      { nome: "Print de e-mail" },
      { nome: "Processo Judicial" }
    ],
    skipDuplicates: true
  })

  console.log("✅ Seed aplicado com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
