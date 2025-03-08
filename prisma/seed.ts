import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando Seed...")

  // ==============================
  // 🌟 Populando tabelas auxiliares
  // ==============================

  console.log("🔹 Criando Responsáveis...")
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
      { nome: "Vanessa Mendes" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Setores...")
  await prisma.setor.createMany({
    data: [
      { nome: "Bancos, Financeiras e Administradoras de Cartão" },
      { nome: "Tecnologia" },
      { nome: "Saúde" },
      { nome: "Serviços" },
      { nome: "Varejo" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Formas de Entrada...")
  await prisma.formaEntrada.createMany({
    data: [
      { nome: "Ouvidoria" },
      { nome: "SEI" },
      { nome: "SEI - CIS" },
      { nome: "Sistema de Requerimentos" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Encaminhamentos...")
  await prisma.encaminhamento.createMany({
    data: [
      { nome: "Aguardando análise" },
      { nome: "Cancelado pelo titular/denunciante" },
      { nome: "Encaminhado para FIS" },
      { nome: "Encaminhado para TIS" },
      { nome: "Requerimento Individualizado" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Situações do Processamento...")
  await prisma.situacao.createMany({
    data: [
      { nome: "Em trâmite - aguardando análise" },
      { nome: "Em trâmite - aguardando FIS/TIS" },
      { nome: "Encaminhado para fiscalização" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Pedidos de Manifestação...")
  await prisma.pedidoManifestacao.createMany({
    data: [
      { nome: "Sim - Controlador Respondeu" },
      { nome: "Sim - Controlador não Respondeu" },
      { nome: "Não se aplica" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Contatos Prévios...")
  await prisma.contatoPrevio.createMany({
    data: [
      { nome: "Correio Eletrônico (e-mail)" },
      { nome: "Ligação telefônica" },
      { nome: "Reclame Aqui/Procon" },
      { nome: "N/A" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Evidências...")
  await prisma.evidencia.createMany({
    data: [
      { nome: "Boletim de Ocorrência" },
      { nome: "Print de e-mail" },
      { nome: "Processo Judicial" },
    ],
    skipDuplicates: true,
  })

  // ==============================
  // 🌟 Criando Perfis
  // ==============================
  console.log("🔹 Criando Perfis...")

  const perfis = {
    leitor: await prisma.perfil.upsert({
      where: { nome: "Leitor" },
      update: {},
      create: { nome: "Leitor" },
    }),
    atendente: await prisma.perfil.upsert({
      where: { nome: "Atendente" },
      update: {},
      create: { nome: "Atendente" },
    }),
    supervisor: await prisma.perfil.upsert({
      where: { nome: "Supervisor" },
      update: {},
      create: { nome: "Supervisor" },
    }),
    administrador: await prisma.perfil.upsert({
      where: { nome: "Administrador" },
      update: {},
      create: { nome: "Administrador" },
    }),
    superAdmin: await prisma.perfil.upsert({
      where: { nome: "SuperAdmin" },
      update: {},
      create: { nome: "SuperAdmin" },
    }),
  }

  // ==============================
  // 🌟 Criando Permissões
  // ==============================
  console.log("🔹 Criando Permissões...")

  const permissoes = [
    // 🔹 Permissões da entidade Processo (cada perfil tem sua permissão individual)
    { acao: "Exibir", recurso: "Processo", permitido: true, perfilId: perfis.leitor.id },
    {
      acao: "Exibir",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Exibir",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Exibir",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Inserir",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Inserir",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Inserir",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Inserir",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Ver Histórico",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Ver Histórico",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Ver Histórico",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Ver Histórico",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Editar Próprio",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Editar Próprio",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Editar Próprio",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Editar Próprio",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Editar Geral",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Editar Geral",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Editar Geral",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Editar Geral",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Excluir",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Excluir",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Excluir",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Excluir",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Alterar Responsável",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Alterar Responsável",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Alterar Responsável",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Alterar Responsável",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    // 🔹 Permissões da entidade Responsável
    {
      acao: "Exibir",
      recurso: "Responsavel",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Exibir",
      recurso: "Responsavel",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Exibir",
      recurso: "Responsavel",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Exibir",
      recurso: "Responsavel",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Cadastrar",
      recurso: "Responsavel",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Cadastrar",
      recurso: "Responsavel",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Cadastrar",
      recurso: "Responsavel",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Cadastrar",
      recurso: "Responsavel",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Editar",
      recurso: "Responsavel",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Editar",
      recurso: "Responsavel",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Editar",
      recurso: "Responsavel",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Editar",
      recurso: "Responsavel",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Desabilitar",
      recurso: "Responsavel",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Responsavel",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Responsavel",
      permitido: false,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Responsavel",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    // 🔹 Permissões de Metadados
    { acao: "Exibir", recurso: "Metadados", permitido: true, perfilId: perfis.leitor.id },
    {
      acao: "Exibir",
      recurso: "Metadados",
      permitido: true,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Exibir",
      recurso: "Metadados",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Exibir",
      recurso: "Metadados",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Cadastrar",
      recurso: "Metadados",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Cadastrar",
      recurso: "Metadados",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Cadastrar",
      recurso: "Metadados",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Cadastrar",
      recurso: "Metadados",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Editar",
      recurso: "Metadados",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Editar",
      recurso: "Metadados",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Editar",
      recurso: "Metadados",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Editar",
      recurso: "Metadados",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Desabilitar",
      recurso: "Metadados",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Metadados",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Metadados",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Metadados",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    // 🔹 Permissões de Relatórios
    {
      acao: "Exibir",
      recurso: "Relatorios",
      permitido: true,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Exibir",
      recurso: "Relatorios",
      permitido: true,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Exibir",
      recurso: "Relatorios",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Exibir",
      recurso: "Relatorios",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Criar",
      recurso: "Relatorios",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Criar",
      recurso: "Relatorios",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Criar",
      recurso: "Relatorios",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Criar",
      recurso: "Relatorios",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Editar",
      recurso: "Relatorios",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Editar",
      recurso: "Relatorios",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Editar",
      recurso: "Relatorios",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Editar",
      recurso: "Relatorios",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Desabilitar",
      recurso: "Relatorios",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Relatorios",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Relatorios",
      permitido: false,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Relatorios",
      permitido: true,
      perfilId: perfis.administrador.id,
    },
  ]

  // 🔹 Atualiza as permissões corretamente no banco
  for (const permissao of permissoes) {
    await prisma.permissao.upsert({
      where: {
        perfilId_acao_recurso: {
          perfilId: permissao.perfilId,
          acao: permissao.acao,
          recurso: permissao.recurso,
        },
      },
      update: { permitido: permissao.permitido },
      create: permissao,
    })
  }

  // ==============================
  // 🌟 Criando SuperAdmin
  // ==============================
  console.log("🔹 Criando SuperAdmin...")

  await prisma.user.upsert({
    where: { email: "luciano.psilva@anpd.gov.br" }, // 🔹 Altere para o e-mail real
    update: {},
    create: {
      email: "luciano.psilva@anpd.gov.br",
      perfilId: perfis.superAdmin.id,
    },
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
