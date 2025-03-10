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

    // 🔹 Permissões de Metadados (DEMAIS TABELAS DO NEGOCIO)
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

  // ==============================
  // 🌟 Criando CNAE
  // ==============================
  console.log("🔹 Criando CNAE...")

  await prisma.cNAE.createMany({
    data: [
      {
        code: "0111301",
        nome: "Cultivo de arroz",
        active: true,
      },
      {
        code: "0111302",
        nome: "Cultivo de milho",
        active: true,
      },
      {
        code: "0111303",
        nome: "Cultivo de trigo",
        active: true,
      },
      {
        code: "0111399",
        nome: "Cultivo de outros cereais não especificados anteriormente",
        active: true,
      },
      {
        code: "0112101",
        nome: "Cultivo de algodão herbáceo",
        active: false,
      },
      {
        code: "0112102",
        nome: "Cultivo de juta",
        active: false,
      },
      {
        code: "0112199",
        nome: "Cultivo de outras fibras de lavoura temporária não especificadas anteriormente",
        active: false,
      },
      {
        code: "0113000",
        nome: "Cultivo de cana-de-açúcar",
        active: false,
      },
      {
        code: "0114800",
        nome: "Cultivo de fumo",
        active: false,
      },
      {
        code: "0115600",
        nome: "Cultivo de soja",
        active: false,
      },
      {
        code: "0116401",
        nome: "Cultivo de amendoim",
        active: false,
      },
      {
        code: "0116402",
        nome: "Cultivo de girassol",
        active: false,
      },
      {
        code: "0116403",
        nome: "Cultivo de mamona",
        active: false,
      },
      {
        code: "0116499",
        nome: "Cultivo de outras oleaginosas de lavoura temporária não especificadas anteriormente",
        active: false,
      },
      {
        code: "0119901",
        nome: "Cultivo de abacaxi",
        active: false,
      },
      {
        code: "0119902",
        nome: "Cultivo de alho",
        active: false,
      },
      {
        code: "0119903",
        nome: "Cultivo de batata-inglesa",
        active: false,
      },
      {
        code: "0119904",
        nome: "Cultivo de cebola",
        active: false,
      },
      {
        code: "0119905",
        nome: "Cultivo de feijão",
        active: false,
      },
      {
        code: "0119906",
        nome: "Cultivo de mandioca",
        active: false,
      },
      {
        code: "0119907",
        nome: "Cultivo de melão",
        active: false,
      },
      {
        code: "0119908",
        nome: "Cultivo de melancia",
        active: false,
      },
      {
        code: "0119909",
        nome: "Cultivo de tomate rasteiro",
        active: false,
      },
      {
        code: "0119999",
        nome: "Cultivo de outras plantas de lavoura temporária não especificadas anteriormente",
        active: false,
      },
      {
        code: "0121101",
        nome: "Horticultura, exceto morango",
        active: false,
      },
      {
        code: "0121102",
        nome: "Cultivo de morango",
        active: false,
      },
      {
        code: "0122900",
        nome: "Cultivo de flores e plantas ornamentais",
        active: false,
      },
      {
        code: "0131800",
        nome: "Cultivo de laranja",
        active: false,
      },
      {
        code: "0132600",
        nome: "Cultivo de uva",
        active: false,
      },
      {
        code: "0133401",
        nome: "Cultivo de açaí",
        active: false,
      },
      {
        code: "0133402",
        nome: "Cultivo de banana",
        active: false,
      },
      {
        code: "0133403",
        nome: "Cultivo de caju",
        active: false,
      },
      {
        code: "0133404",
        nome: "Cultivo de cítricos, exceto laranja",
        active: false,
      },
      {
        code: "0133405",
        nome: "Cultivo de coco-da-baía",
        active: false,
      },
      {
        code: "0133406",
        nome: "Cultivo de guaraná",
        active: false,
      },
      {
        code: "0133407",
        nome: "Cultivo de maçã",
        active: false,
      },
      {
        code: "0133408",
        nome: "Cultivo de mamão",
        active: false,
      },
      {
        code: "0133409",
        nome: "Cultivo de maracujá",
        active: false,
      },
      {
        code: "0133410",
        nome: "Cultivo de manga",
        active: false,
      },
      {
        code: "0133411",
        nome: "Cultivo de pêssego",
        active: false,
      },
      {
        code: "0133499",
        nome: "Cultivo de frutas de lavoura permanente não especificadas anteriormente",
        active: false,
      },
      {
        code: "0134200",
        nome: "Cultivo de café",
        active: false,
      },
      {
        code: "0135100",
        nome: "Cultivo de cacau",
        active: false,
      },
      {
        code: "0139301",
        nome: "Cultivo de chá-da-índia",
        active: false,
      },
      {
        code: "0139302",
        nome: "Cultivo de erva-mate",
        active: false,
      },
      {
        code: "0139303",
        nome: "Cultivo de pimenta-do-reino",
        active: false,
      },
      {
        code: "0139304",
        nome: "Cultivo de plantas para condimento, exceto pimenta-do-reino",
        active: false,
      },
      {
        code: "0139305",
        nome: "Cultivo de dendê",
        active: false,
      },
      {
        code: "0139306",
        nome: "Cultivo de seringueira",
        active: false,
      },
      {
        code: "0139399",
        nome: "Cultivo de outras plantas de lavoura permanente não especificadas anteriormente",
        active: false,
      },
      {
        code: "0141501",
        nome: "Produção de sementes certificadas, exceto de forrageiras para pasto",
        active: false,
      },
      {
        code: "0141502",
        nome: "Produção de sementes certificadas de forrageiras para formação de pasto",
        active: false,
      },
      {
        code: "0142300",
        nome: "Produção de mudas e outras formas de propagação vegetal, certificadas",
        active: false,
      },
      {
        code: "0151201",
        nome: "Criação de bovinos para corte",
        active: false,
      },
      {
        code: "0151202",
        nome: "Criação de bovinos para leite",
        active: false,
      },
      {
        code: "0151203",
        nome: "Criação de bovinos, exceto para corte e leite",
        active: false,
      },
      {
        code: "0152101",
        nome: "Criação de bufalinos",
        active: false,
      },
      {
        code: "0152102",
        nome: "Criação de equinos",
        active: false,
      },
      {
        code: "0152103",
        nome: "Criação de asininos e muares",
        active: false,
      },
      {
        code: "0153901",
        nome: "Criação de caprinos",
        active: false,
      },
      {
        code: "0153902",
        nome: "Criação de ovinos, inclusive para produção de lã",
        active: false,
      },
      {
        code: "0154700",
        nome: "Criação de suínos",
        active: false,
      },
      {
        code: "0155501",
        nome: "Criação de frangos para corte",
        active: false,
      },
      {
        code: "0155502",
        nome: "Produção de pintos de um dia",
        active: false,
      },
      {
        code: "0155503",
        nome: "Criação de outros galináceos, exceto para corte",
        active: false,
      },
      {
        code: "0155504",
        nome: "Criação de aves, exceto galináceos",
        active: false,
      },
      {
        code: "0155505",
        nome: "Produção de ovos",
        active: false,
      },
      {
        code: "0159801",
        nome: "Apicultura",
        active: false,
      },
      {
        code: "0159802",
        nome: "Criação de animais de estimação",
        active: false,
      },
      {
        code: "0159803",
        nome: "Criação de escargô",
        active: false,
      },
      {
        code: "0159804",
        nome: "Criação de bicho-da-seda",
        active: false,
      },
      {
        code: "0159899",
        nome: "Criação de outros animais não especificados anteriormente",
        active: false,
      },
      {
        code: "0161001",
        nome: "Serviço de pulverização e controle de pragas agrícolas",
        active: false,
      },
      {
        code: "0161002",
        nome: "Serviço de poda de árvores para lavouras",
        active: false,
      },
      {
        code: "0161003",
        nome: "Serviço de preparação de terreno, cultivo e colheita",
        active: false,
      },
      {
        code: "0161099",
        nome: "Atividades de apoio à agricultura não especificadas anteriormente",
        active: false,
      },
      {
        code: "0162801",
        nome: "Serviço de inseminação artificial em animais",
        active: false,
      },
      {
        code: "0162802",
        nome: "Serviço de tosquiamento de ovinos",
        active: false,
      },
      {
        code: "0162803",
        nome: "Serviço de manejo de animais",
        active: false,
      },
      {
        code: "0162899",
        nome: "Atividades de apoio à pecuária não especificadas anteriormente",
        active: false,
      },
      {
        code: "0163600",
        nome: "Atividades de pós-colheita",
        active: false,
      },
      {
        code: "0170900",
        nome: "Caça e serviços relacionados",
        active: false,
      },
      {
        code: "0210101",
        nome: "Cultivo de eucalipto",
        active: false,
      },
      {
        code: "0210102",
        nome: "Cultivo de acácia-negra",
        active: false,
      },
      {
        code: "0210103",
        nome: "Cultivo de pinus",
        active: false,
      },
      {
        code: "0210104",
        nome: "Cultivo de teca",
        active: false,
      },
      {
        code: "0210105",
        nome: "Cultivo de espécies madeireiras, exceto eucalipto, acácia-negra, pinus e teca",
        active: false,
      },
      {
        code: "0210106",
        nome: "Cultivo de mudas em viveiros florestais",
        active: false,
      },
      {
        code: "0210107",
        nome: "Extração de madeira em florestas plantadas",
        active: false,
      },
      {
        code: "0210108",
        nome: "Produção de carvão vegetal - florestas plantadas",
        active: false,
      },
      {
        code: "0210109",
        nome: "Produção de casca de acácia-negra - florestas plantadas",
        active: false,
      },
      {
        code: "0210199",
        nome: "Produção de produtos não madeireiros não especificados anteriormente em florestas plantadas",
        active: false,
      },
      {
        code: "0220901",
        nome: "Extração de madeira em florestas nativas",
        active: false,
      },
      {
        code: "0220902",
        nome: "Produção de carvão vegetal - florestas nativas",
        active: false,
      },
      {
        code: "0220903",
        nome: "Coleta de castanha-do-pará em florestas nativas",
        active: false,
      },
      {
        code: "0220904",
        nome: "Coleta de látex em florestas nativas",
        active: false,
      },
      {
        code: "0220905",
        nome: "Coleta de palmito em florestas nativas",
        active: false,
      },
      {
        code: "0220906",
        nome: "Conservação de florestas nativas",
        active: false,
      },
      {
        code: "0220999",
        nome: "Coleta de produtos não madeireiros não especificados anteriormente em florestas nativas",
        active: false,
      },
      {
        code: "0230600",
        nome: "Atividades de apoio à produção florestal",
        active: false,
      },
      {
        code: "0311601",
        nome: "Pesca de peixes em água salgada",
        active: false,
      },
      {
        code: "0311602",
        nome: "Pesca de crustáceos e moluscos em água salgada",
        active: false,
      },
      {
        code: "0311603",
        nome: "Coleta de outros produtos marinhos",
        active: false,
      },
      {
        code: "0311604",
        nome: "Atividades de apoio à pesca em água salgada",
        active: false,
      },
      {
        code: "0312401",
        nome: "Pesca de peixes em água doce",
        active: false,
      },
      {
        code: "0312402",
        nome: "Pesca de crustáceos e moluscos em água doce",
        active: false,
      },
      {
        code: "0312403",
        nome: "Coleta de outros produtos aquáticos de água doce",
        active: false,
      },
      {
        code: "0312404",
        nome: "Atividades de apoio à pesca em água doce",
        active: false,
      },
      {
        code: "0321301",
        nome: "Criação de peixes em água salgada e salobra",
        active: false,
      },
      {
        code: "0321302",
        nome: "Criação de camarões em água salgada e salobra",
        active: false,
      },
      {
        code: "0321303",
        nome: "Criação de ostras e mexilhões em água salgada e salobra",
        active: false,
      },
      {
        code: "0321304",
        nome: "Criação de peixes ornamentais em água salgada e salobra",
        active: false,
      },
      {
        code: "0321305",
        nome: "Atividades de apoio à aquicultura em água salgada e salobra",
        active: false,
      },
      {
        code: "0321399",
        nome: "Cultivos e semicultivos da aquicultura em água salgada e salobra não especificados anteriormente",
        active: false,
      },
      {
        code: "0322101",
        nome: "Criação de peixes em água doce",
        active: false,
      },
      {
        code: "0322102",
        nome: "Criação de camarões em água doce",
        active: false,
      },
      {
        code: "0322103",
        nome: "Criação de ostras e mexilhões em água doce",
        active: false,
      },
      {
        code: "0322104",
        nome: "Criação de peixes ornamentais em água doce",
        active: false,
      },
      {
        code: "0322105",
        nome: "Ranicultura",
        active: false,
      },
      {
        code: "0322106",
        nome: "Criação de jacaré",
        active: false,
      },
      {
        code: "0322107",
        nome: "Atividades de apoio à aquicultura em água doce",
        active: false,
      },
      {
        code: "0322199",
        nome: "Cultivos e semicultivos da aquicultura em água doce não especificados anteriormente",
        active: false,
      },
      {
        code: "0500301",
        nome: "Extração de carvão mineral",
        active: false,
      },
      {
        code: "0500302",
        nome: "Beneficiamento de carvão mineral",
        active: false,
      },
      {
        code: "0600001",
        nome: "Extração de petróleo e gás natural",
        active: false,
      },
      {
        code: "0600002",
        nome: "Extração e beneficiamento de xisto",
        active: false,
      },
      {
        code: "0600003",
        nome: "Extração e beneficiamento de areias betuminosas",
        active: false,
      },
      {
        code: "0710301",
        nome: "Extração de minério de ferro",
        active: false,
      },
      {
        code: "0710302",
        nome: "Pelotização, sinterização e outros beneficiamentos de minério de ferro",
        active: false,
      },
      {
        code: "0721901",
        nome: "Extração de minério de alumínio",
        active: false,
      },
      {
        code: "0721902",
        nome: "Beneficiamento de minério de alumínio",
        active: false,
      },
      {
        code: "0722701",
        nome: "Extração de minério de estanho",
        active: false,
      },
      {
        code: "0722702",
        nome: "Beneficiamento de minério de estanho",
        active: false,
      },
      {
        code: "0723501",
        nome: "Extração de minério de manganês",
        active: false,
      },
      {
        code: "0723502",
        nome: "Beneficiamento de minério de manganês",
        active: false,
      },
      {
        code: "0724301",
        nome: "Extração de minério de metais preciosos",
        active: false,
      },
      {
        code: "0724302",
        nome: "Beneficiamento de minério de metais preciosos",
        active: false,
      },
      {
        code: "0725100",
        nome: "Extração de minerais radioativos",
        active: false,
      },
      {
        code: "0729401",
        nome: "Extração de minérios de nióbio e titânio",
        active: false,
      },
      {
        code: "0729402",
        nome: "Extração de minério de tungstênio",
        active: false,
      },
      {
        code: "0729403",
        nome: "Extração de minério de níquel",
        active: false,
      },
      {
        code: "0729404",
        nome: "Extração de minérios de cobre, chumbo, zinco e outros minerais metálicos não ferrosos não especificados anteriormente",
        active: false,
      },
      {
        code: "0729405",
        nome: "Beneficiamento de minérios de cobre, chumbo, zinco e outros minerais metálicos não ferrosos não especificados anteriormente",
        active: false,
      },
      {
        code: "0810001",
        nome: "Extração de ardósia e beneficiamento associado",
        active: false,
      },
      {
        code: "0810002",
        nome: "Extração de granito e beneficiamento associado",
        active: false,
      },
      {
        code: "0810003",
        nome: "Extração de mármore e beneficiamento associado",
        active: false,
      },
      {
        code: "0810004",
        nome: "Extração de calcário e dolomita e beneficiamento associado",
        active: false,
      },
      {
        code: "0810005",
        nome: "Extração de gesso e caulim",
        active: false,
      },
      {
        code: "0810006",
        nome: "Extração de areia, cascalho ou pedregulho e beneficiamento associado",
        active: false,
      },
      {
        code: "0810007",
        nome: "Extração de argila e beneficiamento associado",
        active: false,
      },
      {
        code: "0810008",
        nome: "Extração de saibro e beneficiamento associado",
        active: false,
      },
      {
        code: "0810009",
        nome: "Extração de basalto e beneficiamento associado",
        active: false,
      },
      {
        code: "0810010",
        nome: "Beneficiamento de gesso e caulim associado à extração",
        active: false,
      },
      {
        code: "0810099",
        nome: "Extração e britamento de pedras e outros materiais para construção e beneficiamento associado",
        active: false,
      },
      {
        code: "0891600",
        nome: "Extração de minerais para fabricação de adubos, fertilizantes e outros produtos químicos",
        active: false,
      },
      {
        code: "0892401",
        nome: "Extração de sal marinho",
        active: false,
      },
      {
        code: "0892402",
        nome: "Extração de sal-gema",
        active: false,
      },
      {
        code: "0892403",
        nome: "Refino e outros tratamentos do sal",
        active: false,
      },
      {
        code: "0893200",
        nome: "Extração de gemas (pedras preciosas e semipreciosas)",
        active: false,
      },
      {
        code: "0899101",
        nome: "Extração de grafita",
        active: false,
      },
      {
        code: "0899102",
        nome: "Extração de quartzo",
        active: false,
      },
      {
        code: "0899103",
        nome: "Extração de amianto",
        active: false,
      },
      {
        code: "0899199",
        nome: "Extração de outros minerais não metálicos não especificados anteriormente",
        active: false,
      },
      {
        code: "0910600",
        nome: "Atividades de apoio à extração de petróleo e gás natural",
        active: false,
      },
      {
        code: "0990401",
        nome: "Atividades de apoio à extração de minério de ferro",
        active: false,
      },
      {
        code: "0990402",
        nome: "Atividades de apoio à extração de minerais metálicos não ferrosos",
        active: false,
      },
      {
        code: "0990403",
        nome: "Atividades de apoio à extração de minerais não metálicos",
        active: false,
      },
      {
        code: "1011201",
        nome: "Frigorífico - abate de bovinos",
        active: false,
      },
      {
        code: "1011202",
        nome: "Frigorífico - abate de equinos",
        active: false,
      },
      {
        code: "1011203",
        nome: "Frigorífico - abate de ovinos e caprinos",
        active: false,
      },
      {
        code: "1011204",
        nome: "Frigorífico - abate de bufalinos",
        active: false,
      },
      {
        code: "1011205",
        nome: "Matadouro - abate de reses sob contrato, exceto abate de suínos",
        active: false,
      },
      {
        code: "1012101",
        nome: "Abate de aves",
        active: false,
      },
      {
        code: "1012102",
        nome: "Abate de pequenos animais",
        active: false,
      },
      {
        code: "1012103",
        nome: "Frigorífico - abate de suínos",
        active: false,
      },
      {
        code: "1012104",
        nome: "Matadouro - abate de suínos sob contrato",
        active: false,
      },
      {
        code: "1013901",
        nome: "Fabricação de produtos de carne",
        active: false,
      },
      {
        code: "1013902",
        nome: "Preparação de subprodutos do abate",
        active: false,
      },
      {
        code: "1020101",
        nome: "Preservação de peixes, crustáceos e moluscos",
        active: false,
      },
      {
        code: "1020102",
        nome: "Fabricação de conservas de peixes, crustáceos e moluscos",
        active: false,
      },
      {
        code: "1031700",
        nome: "Fabricação de conservas de frutas",
        active: false,
      },
      {
        code: "1032501",
        nome: "Fabricação de conservas de palmito",
        active: false,
      },
      {
        code: "1032599",
        nome: "Fabricação de conservas de legumes e outros vegetais, exceto palmito",
        active: false,
      },
      {
        code: "1033301",
        nome: "Fabricação de sucos concentrados de frutas, hortaliças e legumes",
        active: false,
      },
      {
        code: "1033302",
        nome: "Fabricação de sucos de frutas, hortaliças e legumes, exceto concentrados",
        active: false,
      },
      {
        code: "1041400",
        nome: "Fabricação de óleos vegetais em bruto, exceto óleo de milho",
        active: false,
      },
      {
        code: "1042200",
        nome: "Fabricação de óleos vegetais refinados, exceto óleo de milho",
        active: false,
      },
      {
        code: "1043100",
        nome: "Fabricação de margarina e outras gorduras vegetais e de óleos não comestíveis de animais",
        active: false,
      },
      {
        code: "1051100",
        nome: "Preparação do leite",
        active: false,
      },
      {
        code: "1052000",
        nome: "Fabricação de laticínios",
        active: false,
      },
      {
        code: "1053800",
        nome: "Fabricação de sorvetes e outros gelados comestíveis",
        active: false,
      },
      {
        code: "1061901",
        nome: "Beneficiamento de arroz",
        active: false,
      },
      {
        code: "1061902",
        nome: "Fabricação de produtos do arroz",
        active: false,
      },
      {
        code: "1062700",
        nome: "Moagem de trigo e fabricação de derivados",
        active: false,
      },
      {
        code: "1063500",
        nome: "Fabricação de farinha de mandioca e derivados",
        active: false,
      },
      {
        code: "1064300",
        nome: "Fabricação de farinha de milho e derivados, exceto óleos de milho",
        active: false,
      },
      {
        code: "1065101",
        nome: "Fabricação de amidos e féculas de vegetais",
        active: false,
      },
      {
        code: "1065102",
        nome: "Fabricação de óleo de milho em bruto",
        active: false,
      },
      {
        code: "1065103",
        nome: "Fabricação de óleo de milho refinado",
        active: false,
      },
      {
        code: "1066000",
        nome: "Fabricação de alimentos para animais",
        active: false,
      },
      {
        code: "1069400",
        nome: "Moagem e fabricação de produtos de origem vegetal não especificados anteriormente",
        active: false,
      },
      {
        code: "1071600",
        nome: "Fabricação de açúcar em bruto",
        active: false,
      },
      {
        code: "1072401",
        nome: "Fabricação de açúcar de cana refinado",
        active: false,
      },
      {
        code: "1072402",
        nome: "Fabricação de açúcar de cereais (dextrose) e de beterraba",
        active: false,
      },
      {
        code: "1081301",
        nome: "Beneficiamento de café",
        active: false,
      },
      {
        code: "1081302",
        nome: "Torrefação e moagem de café",
        active: false,
      },
      {
        code: "1082100",
        nome: "Fabricação de produtos à base de café",
        active: false,
      },
      {
        code: "1091101",
        nome: "Fabricação de produtos de panificação industrial",
        active: false,
      },
      {
        code: "1091102",
        nome: "Fabricação de produtos de padaria e confeitaria com predominância de produção própria",
        active: false,
      },
      {
        code: "1092900",
        nome: "Fabricação de biscoitos e bolachas",
        active: false,
      },
      {
        code: "1093701",
        nome: "Fabricação de produtos derivados do cacau e de chocolates",
        active: false,
      },
      {
        code: "1093702",
        nome: "Fabricação de frutas cristalizadas, balas e semelhantes",
        active: false,
      },
      {
        code: "1094500",
        nome: "Fabricação de massas alimentícias",
        active: false,
      },
      {
        code: "1095300",
        nome: "Fabricação de especiarias, molhos, temperos e condimentos",
        active: false,
      },
      {
        code: "1096100",
        nome: "Fabricação de alimentos e pratos prontos",
        active: false,
      },
      {
        code: "1099601",
        nome: "Fabricação de vinagres",
        active: false,
      },
      {
        code: "1099602",
        nome: "Fabricação de pós-alimentícios",
        active: false,
      },
      {
        code: "1099603",
        nome: "Fabricação de fermentos e leveduras",
        active: false,
      },
      {
        code: "1099604",
        nome: "Fabricação de gelo comum",
        active: false,
      },
      {
        code: "1099605",
        nome: "Fabricação de produtos para infusão (chá, mate, etc.)",
        active: false,
      },
      {
        code: "1099606",
        nome: "Fabricação de adoçantes naturais e artificiais",
        active: false,
      },
      {
        code: "1099607",
        nome: "Fabricação de alimentos dietéticos e complementos alimentares",
        active: false,
      },
      {
        code: "1099699",
        nome: "Fabricação de outros produtos alimentícios não especificados anteriormente",
        active: false,
      },
      {
        code: "1111901",
        nome: "Fabricação de aguardente de cana-de-açúcar",
        active: false,
      },
      {
        code: "1111902",
        nome: "Fabricação de outras aguardentes e bebidas destiladas",
        active: false,
      },
      {
        code: "1112700",
        nome: "Fabricação de vinho",
        active: false,
      },
      {
        code: "1113501",
        nome: "Fabricação de malte, inclusive malte uísque",
        active: false,
      },
      {
        code: "1113502",
        nome: "Fabricação de cervejas e chopes",
        active: false,
      },
      {
        code: "1121600",
        nome: "Fabricação de águas envasadas",
        active: false,
      },
      {
        code: "1122401",
        nome: "Fabricação de refrigerantes",
        active: false,
      },
      {
        code: "1122402",
        nome: "Fabricação de chá mate e outros chás prontos para consumo",
        active: false,
      },
      {
        code: "1122403",
        nome: "Fabricação de refrescos, xaropes e pós para refrescos, exceto refrescos de frutas",
        active: false,
      },
      {
        code: "1122404",
        nome: "Fabricação de bebidas isotônicas",
        active: false,
      },
      {
        code: "1122499",
        nome: "Fabricação de outras bebidas não alcoólicas não especificadas anteriormente",
        active: false,
      },
      {
        code: "1210700",
        nome: "Processamento industrial do fumo",
        active: false,
      },
      {
        code: "1220401",
        nome: "Fabricação de cigarros",
        active: false,
      },
      {
        code: "1220402",
        nome: "Fabricação de cigarrilhas e charutos",
        active: false,
      },
      {
        code: "1220403",
        nome: "Fabricação de filtros para cigarros",
        active: false,
      },
      {
        code: "1220499",
        nome: "Fabricação de outros produtos do fumo, exceto cigarros, cigarrilhas e charutos",
        active: false,
      },
      {
        code: "1311100",
        nome: "Preparação e fiação de fibras de algodão",
        active: false,
      },
      {
        code: "1312000",
        nome: "Preparação e fiação de fibras têxteis naturais, exceto algodão",
        active: false,
      },
      {
        code: "1313800",
        nome: "Fiação de fibras artificiais e sintéticas",
        active: false,
      },
      {
        code: "1314600",
        nome: "Fabricação de linhas para costurar e bordar",
        active: false,
      },
      {
        code: "1321900",
        nome: "Tecelagem de fios de algodão",
        active: false,
      },
      {
        code: "1322700",
        nome: "Tecelagem de fios de fibras têxteis naturais, exceto algodão",
        active: false,
      },
      {
        code: "1323500",
        nome: "Tecelagem de fios de fibras artificiais e sintéticas",
        active: false,
      },
      {
        code: "1330800",
        nome: "Fabricação de tecidos de malha",
        active: false,
      },
      {
        code: "1340501",
        nome: "Estamparia e texturização em fios, tecidos, artefatos têxteis e peças do vestuário",
        active: false,
      },
      {
        code: "1340502",
        nome: "Alvejamento, tingimento e torção em fios, tecidos, artefatos têxteis e peças do vestuário",
        active: false,
      },
      {
        code: "1340599",
        nome: "Outros serviços de acabamento em fios, tecidos, artefatos têxteis e peças do vestuário",
        active: false,
      },
      {
        code: "1351100",
        nome: "Fabricação de artefatos têxteis para uso doméstico",
        active: false,
      },
      {
        code: "1352900",
        nome: "Fabricação de artefatos de tapeçaria",
        active: false,
      },
      {
        code: "1353700",
        nome: "Fabricação de artefatos de cordoaria",
        active: false,
      },
      {
        code: "1354500",
        nome: "Fabricação de tecidos especiais, inclusive artefatos",
        active: false,
      },
      {
        code: "1359600",
        nome: "Fabricação de outros produtos têxteis não especificados anteriormente",
        active: false,
      },
      {
        code: "1411801",
        nome: "Confecção de roupas íntimas",
        active: false,
      },
      {
        code: "1411802",
        nome: "Facção de roupas íntimas",
        active: false,
      },
      {
        code: "1412601",
        nome: "Confecção de peças do vestuário, exceto roupas íntimas e as confeccionadas sob medida",
        active: false,
      },
      {
        code: "1412602",
        nome: "Confecção, sob medida, de peças do vestuário, exceto roupas íntimas",
        active: false,
      },
      {
        code: "1412603",
        nome: "Facção de peças do vestuário, exceto roupas íntimas",
        active: false,
      },
      {
        code: "1413401",
        nome: "Confecção de roupas profissionais, exceto sob medida",
        active: false,
      },
      {
        code: "1413402",
        nome: "Confecção, sob medida, de roupas profissionais",
        active: false,
      },
      {
        code: "1413403",
        nome: "Facção de roupas profissionais",
        active: false,
      },
      {
        code: "1414200",
        nome: "Fabricação de acessórios do vestuário, exceto para segurança e proteção",
        active: false,
      },
      {
        code: "1421500",
        nome: "Fabricação de meias",
        active: false,
      },
      {
        code: "1422300",
        nome: "Fabricação de artigos do vestuário, produzidos em malharias e tricotagens, exceto meias",
        active: false,
      },
      {
        code: "1510600",
        nome: "Curtimento e outras preparações de couro",
        active: false,
      },
      {
        code: "1521100",
        nome: "Fabricação de artigos para viagem, bolsas e semelhantes de qualquer material",
        active: false,
      },
      {
        code: "1529700",
        nome: "Fabricação de artefatos de couro não especificados anteriormente",
        active: false,
      },
      {
        code: "1531901",
        nome: "Fabricação de calçados de couro",
        active: false,
      },
      {
        code: "1531902",
        nome: "Acabamento de calçados de couro sob contrato",
        active: false,
      },
      {
        code: "1532700",
        nome: "Fabricação de tênis de qualquer material",
        active: false,
      },
      {
        code: "1533500",
        nome: "Fabricação de calçados de material sintético",
        active: false,
      },
      {
        code: "1539400",
        nome: "Fabricação de calçados de materiais não especificados\r\nanteriormente",
        active: false,
      },
      {
        code: "1540800",
        nome: "Fabricação de partes para calçados, de qualquer material",
        active: false,
      },
      {
        code: "1610203",
        nome: "Serrarias com desdobramento de madeira em bruto",
        active: false,
      },
      {
        code: "1610204",
        nome: "Serrarias sem desdobramento de madeira em bruto - Resseragem",
        active: false,
      },
      {
        code: "1610205",
        nome: "Serviço de tratamento de madeira realizado sob contrato",
        active: false,
      },
      {
        code: "1621800",
        nome: "Fabricação de madeira laminada e de chapas de madeira compensada, prensada e aglomerada",
        active: false,
      },
      {
        code: "1622601",
        nome: "Fabricação de casas de madeira pré-fabricadas",
        active: false,
      },
      {
        code: "1622602",
        nome: "Fabricação de esquadrias de madeira e de peças de madeira para instalações industriais e comerciais",
        active: false,
      },
      {
        code: "1622699",
        nome: "Fabricação de outros artigos de carpintaria para construção",
        active: false,
      },
      {
        code: "1623400",
        nome: "Fabricação de artefatos de tanoaria e de embalagens de madeira",
        active: false,
      },
      {
        code: "1629301",
        nome: "Fabricação de artefatos diversos de madeira, exceto móveis",
        active: false,
      },
      {
        code: "1629302",
        nome: "Fabricação de artefatos diversos de cortiça, bambu, palha, vime e outros materiais trançados, exceto móveis",
        active: false,
      },
      {
        code: "1710900",
        nome: "Fabricação de celulose e outras pastas para a fabricação de papel",
        active: false,
      },
      {
        code: "1721400",
        nome: "Fabricação de papel",
        active: false,
      },
      {
        code: "1722200",
        nome: "Fabricação de cartolina e papel-cartão",
        active: false,
      },
      {
        code: "1731100",
        nome: "Fabricação de embalagens de papel",
        active: false,
      },
      {
        code: "1732000",
        nome: "Fabricação de embalagens de cartolina e papel-cartão",
        active: false,
      },
      {
        code: "1733800",
        nome: "Fabricação de chapas e de embalagens de papelão ondulado",
        active: false,
      },
      {
        code: "1741901",
        nome: "Fabricação de formulários contínuos",
        active: false,
      },
      {
        code: "1741902",
        nome: "Fabricação de produtos de papel, cartolina, papel-cartão e papelão ondulado para uso comercial e de escritório",
        active: false,
      },
      {
        code: "1742701",
        nome: "Fabricação de fraldas descartáveis",
        active: false,
      },
      {
        code: "1742702",
        nome: "Fabricação de absorventes higiênicos",
        active: false,
      },
      {
        code: "1742799",
        nome: "Fabricação de produtos de papel para uso doméstico e higiênico-sanitário não especificados anteriormente",
        active: false,
      },
      {
        code: "1749400",
        nome: "Fabricação de produtos de pastas celulósicas, papel, cartolina, papel-cartão e papelão ondulado não especificados anteriormente",
        active: false,
      },
      {
        code: "1811301",
        nome: "Impressão de jornais",
        active: false,
      },
      {
        code: "1811302",
        nome: "Impressão de livros, revistas e outras publicações periódicas",
        active: false,
      },
      {
        code: "1812100",
        nome: "Impressão de material de segurança",
        active: false,
      },
      {
        code: "1813001",
        nome: "Impressão de material para uso publicitário",
        active: false,
      },
      {
        code: "1813099",
        nome: "Impressão de material para outros usos",
        active: false,
      },
      {
        code: "1821100",
        nome: "Serviços de pré-impressão",
        active: false,
      },
      {
        code: "1822901",
        nome: "Serviços de encadernação e plastificação",
        active: false,
      },
      {
        code: "1822999",
        nome: "Serviços de acabamentos gráficos, exceto encadernação e plastificação",
        active: false,
      },
      {
        code: "1830001",
        nome: "Reprodução de som em qualquer suporte",
        active: false,
      },
      {
        code: "1830002",
        nome: "Reprodução de vídeo em qualquer suporte",
        active: false,
      },
      {
        code: "1830003",
        nome: "Reprodução de software em qualquer suporte",
        active: false,
      },
      {
        code: "1910100",
        nome: "Coquerias",
        active: false,
      },
      {
        code: "1921700",
        nome: "Fabricação de produtos do refino de petróleo",
        active: false,
      },
      {
        code: "1922501",
        nome: "Formulação de combustíveis",
        active: false,
      },
      {
        code: "1922502",
        nome: "Rerrefino de óleos lubrificantes",
        active: false,
      },
      {
        code: "1922599",
        nome: "Fabricação de outros produtos derivados do petróleo, exceto produtos do refino",
        active: false,
      },
      {
        code: "1931400",
        nome: "Fabricação de álcool",
        active: false,
      },
      {
        code: "1932200",
        nome: "Fabricação de biocombustíveis, exceto álcool",
        active: false,
      },
      {
        code: "2011800",
        nome: "Fabricação de cloro e álcalis",
        active: false,
      },
      {
        code: "2012600",
        nome: "Fabricação de intermediários para fertilizantes",
        active: false,
      },
      {
        code: "2013401",
        nome: "Fabricação de adubos e fertilizantes organo-minerais",
        active: false,
      },
      {
        code: "2013402",
        nome: "Fabricação de adubos e fertilizantes, exceto organo-minerais",
        active: false,
      },
      {
        code: "2014200",
        nome: "Fabricação de gases industriais",
        active: false,
      },
      {
        code: "2019301",
        nome: "Elaboração de combustíveis nucleares",
        active: false,
      },
      {
        code: "2019399",
        nome: "Fabricação de outros produtos químicos inorgânicos não especificados anteriormente",
        active: false,
      },
      {
        code: "2021500",
        nome: "Fabricação de produtos petroquímicos básicos",
        active: false,
      },
      {
        code: "2022300",
        nome: "Fabricação de intermediários para plastificantes, resinas e fibras",
        active: false,
      },
      {
        code: "2029100",
        nome: "Fabricação de produtos químicos orgânicos não especificados anteriormente",
        active: false,
      },
      {
        code: "2031200",
        nome: "Fabricação de resinas termoplásticas",
        active: false,
      },
      {
        code: "2032100",
        nome: "Fabricação de resinas termofixas",
        active: false,
      },
      {
        code: "2033900",
        nome: "Fabricação de elastômeros",
        active: false,
      },
      {
        code: "2040100",
        nome: "Fabricação de fibras artificiais e sintéticas",
        active: false,
      },
      {
        code: "2051700",
        nome: "Fabricação de defensivos agrícolas",
        active: false,
      },
      {
        code: "2052500",
        nome: "Fabricação de desinfestantes domissanitários",
        active: false,
      },
      {
        code: "2061400",
        nome: "Fabricação de sabões e detergentes sintéticos",
        active: false,
      },
      {
        code: "2062200",
        nome: "Fabricação de produtos de limpeza e polimento",
        active: false,
      },
      {
        code: "2063100",
        nome: "Fabricação de cosméticos, produtos de perfumaria e de higiene pessoal",
        active: false,
      },
      {
        code: "2071100",
        nome: "Fabricação de tintas, vernizes, esmaltes e lacas",
        active: false,
      },
      {
        code: "2072000",
        nome: "Fabricação de tintas de impressão",
        active: false,
      },
      {
        code: "2073800",
        nome: "Fabricação de impermeabilizantes, solventes e produtos afins",
        active: false,
      },
      {
        code: "2091600",
        nome: "Fabricação de adesivos e selantes",
        active: false,
      },
      {
        code: "2092401",
        nome: "Fabricação de pólvoras, explosivos e detonantes",
        active: false,
      },
      {
        code: "2092402",
        nome: "Fabricação de artigos pirotécnicos",
        active: false,
      },
      {
        code: "2092403",
        nome: "Fabricação de fósforos de segurança",
        active: false,
      },
      {
        code: "2093200",
        nome: "Fabricação de aditivos de uso industrial",
        active: false,
      },
      {
        code: "2094100",
        nome: "Fabricação de catalisadores",
        active: false,
      },
      {
        code: "2099101",
        nome: "Fabricação de chapas, filmes, papéis e outros materiais e produtos químicos para fotografia",
        active: false,
      },
      {
        code: "2099199",
        nome: "Fabricação de outros produtos químicos não especificados anteriormente",
        active: false,
      },
      {
        code: "2110600",
        nome: "Fabricação de produtos farmoquímicos",
        active: false,
      },
      {
        code: "2121101",
        nome: "Fabricação de medicamentos alopáticos para uso humano",
        active: false,
      },
      {
        code: "2121102",
        nome: "Fabricação de medicamentos homeopáticos para uso humano",
        active: false,
      },
      {
        code: "2121103",
        nome: "Fabricação de medicamentos fitoterápicos para uso humano",
        active: false,
      },
      {
        code: "2122000",
        nome: "Fabricação de medicamentos para uso veterinário",
        active: false,
      },
      {
        code: "2123800",
        nome: "Fabricação de preparações farmacêuticas",
        active: false,
      },
      {
        code: "2211100",
        nome: "Fabricação de pneumáticos e de câmaras-de-ar",
        active: false,
      },
      {
        code: "2212900",
        nome: "Reforma de pneumáticos usados",
        active: false,
      },
      {
        code: "2219600",
        nome: "Fabricação de artefatos de borracha não especificados\r\nanteriormente",
        active: false,
      },
      {
        code: "2221800",
        nome: "Fabricação de laminados planos e tubulares de material plástico",
        active: false,
      },
      {
        code: "2222600",
        nome: "Fabricação de embalagens de material plástico",
        active: false,
      },
      {
        code: "2223400",
        nome: "Fabricação de tubos e acessórios de material plástico para uso na construção",
        active: false,
      },
      {
        code: "2229301",
        nome: "Fabricação de artefatos de material plástico para uso pessoal e doméstico",
        active: false,
      },
      {
        code: "2229302",
        nome: "Fabricação de artefatos de material plástico para usos industriais",
        active: false,
      },
      {
        code: "2229303",
        nome: "Fabricação de artefatos de material plástico para uso na construção, exceto tubos e acessórios",
        active: false,
      },
      {
        code: "2229399",
        nome: "Fabricação de artefatos de material plástico para outros usos não especificados anteriormente",
        active: false,
      },
      {
        code: "2311700",
        nome: "Fabricação de vidro plano e de segurança",
        active: false,
      },
      {
        code: "2312500",
        nome: "Fabricação de embalagens de vidro",
        active: false,
      },
      {
        code: "2319200",
        nome: "Fabricação de artigos de vidro",
        active: false,
      },
      {
        code: "2320600",
        nome: "Fabricação de cimento",
        active: false,
      },
      {
        code: "2330301",
        nome: "Fabricação de estruturas pré-moldadas de concreto armado, em série e sob encomenda",
        active: false,
      },
      {
        code: "2330302",
        nome: "Fabricação de artefatos de cimento para uso na construção",
        active: false,
      },
      {
        code: "2330303",
        nome: "Fabricação de artefatos de fibrocimento para uso na construção",
        active: false,
      },
      {
        code: "2330304",
        nome: "Fabricação de casas pré-moldadas de concreto",
        active: false,
      },
      {
        code: "2330305",
        nome: "Preparação de massa de concreto e argamassa para construção",
        active: false,
      },
      {
        code: "2330399",
        nome: "Fabricação de outros artefatos e produtos de concreto, cimento, fibrocimento, gesso e materiais semelhantes",
        active: false,
      },
      {
        code: "2341900",
        nome: "Fabricação de produtos cerâmicos refratários",
        active: false,
      },
      {
        code: "2342701",
        nome: "Fabricação de azulejos e pisos",
        active: false,
      },
      {
        code: "2342702",
        nome: "Fabricação de artefatos de cerâmica e barro cozido para uso na construção, exceto azulejos e pisos",
        active: false,
      },
      {
        code: "2349401",
        nome: "Fabricação de material sanitário de cerâmica",
        active: false,
      },
      {
        code: "2349499",
        nome: "Fabricação de produtos cerâmicos não refratários não especificados anteriormente",
        active: false,
      },
      {
        code: "2391501",
        nome: "Britamento de pedras, exceto associado à extração",
        active: false,
      },
      {
        code: "2391502",
        nome: "Aparelhamento de pedras para construção, exceto associado à extração",
        active: false,
      },
      {
        code: "2391503",
        nome: "Aparelhamento de placas e execução de trabalhos em mármore, granito, ardósia e outras pedras",
        active: false,
      },
      {
        code: "2392300",
        nome: "Fabricação de cal e gesso",
        active: false,
      },
      {
        code: "2399101",
        nome: "Decoração, lapidação, gravação, vitrificação e outros trabalhos em cerâmica, louça, vidro e cristal",
        active: false,
      },
      {
        code: "2399102",
        nome: "Fabricação de abrasivos",
        active: false,
      },
      {
        code: "2399199",
        nome: "Fabricação de outros produtos de minerais não metálicos não especificados anteriormente",
        active: false,
      },
      {
        code: "2411300",
        nome: "Produção de ferro-gusa",
        active: false,
      },
      {
        code: "2412100",
        nome: "Produção de ferroligas",
        active: false,
      },
      {
        code: "2421100",
        nome: "Produção de semiacabados de aço",
        active: false,
      },
      {
        code: "2422901",
        nome: "Produção de laminados planos de aço ao carbono, revestidos ou não",
        active: false,
      },
      {
        code: "2422902",
        nome: "Produção de laminados planos de aços especiais",
        active: false,
      },
      {
        code: "2423701",
        nome: "Produção de tubos de aço sem costura",
        active: false,
      },
      {
        code: "2423702",
        nome: "Produção de laminados longos de aço, exceto tubos",
        active: false,
      },
      {
        code: "2424501",
        nome: "Produção de arames de aço",
        active: false,
      },
      {
        code: "2424502",
        nome: "Produção de relaminados, trefilados e perfilados de aço, exceto arames",
        active: false,
      },
      {
        code: "2431800",
        nome: "Produção de tubos de aço com costura",
        active: false,
      },
      {
        code: "2439300",
        nome: "Produção de outros tubos de ferro e aço",
        active: false,
      },
      {
        code: "2441501",
        nome: "Produção de alumínio e suas ligas em formas primárias",
        active: false,
      },
      {
        code: "2441502",
        nome: "Produção de laminados de alumínio",
        active: false,
      },
      {
        code: "2442300",
        nome: "Metalurgia dos metais preciosos",
        active: false,
      },
      {
        code: "2443100",
        nome: "Metalurgia do cobre",
        active: false,
      },
      {
        code: "2449101",
        nome: "Produção de zinco em formas primárias",
        active: false,
      },
      {
        code: "2449102",
        nome: "Produção de laminados de zinco",
        active: false,
      },
      {
        code: "2449103",
        nome: "Fabricação de ânodos para galvanoplastia",
        active: false,
      },
      {
        code: "2449199",
        nome: "Metalurgia de outros metais não ferrosos e suas ligas não especificados anteriormente",
        active: false,
      },
      {
        code: "2451200",
        nome: "Fundição de ferro e aço",
        active: false,
      },
      {
        code: "2452100",
        nome: "Fundição de metais não ferrosos e suas ligas",
        active: false,
      },
      {
        code: "2511000",
        nome: "Fabricação de estruturas metálicas",
        active: false,
      },
      {
        code: "2512800",
        nome: "Fabricação de esquadrias de metal",
        active: false,
      },
      {
        code: "2513600",
        nome: "Fabricação de obras de caldeiraria pesada",
        active: false,
      },
      {
        code: "2521700",
        nome: "Fabricação de tanques, reservatórios metálicos e caldeiras para aquecimento central",
        active: false,
      },
      {
        code: "2522500",
        nome: "Fabricação de caldeiras geradoras de vapor, exceto para aquecimento central e para veículos",
        active: false,
      },
      {
        code: "2531401",
        nome: "Produção de forjados de aço",
        active: false,
      },
      {
        code: "2531402",
        nome: "Produção de forjados de metais não ferrosos e suas ligas",
        active: false,
      },
      {
        code: "2532201",
        nome: "Produção de artefatos estampados de metal",
        active: false,
      },
      {
        code: "2532202",
        nome: "Metalurgia do pó",
        active: false,
      },
      {
        code: "2539001",
        nome: "Serviços de usinagem, torneiria e solda",
        active: false,
      },
      {
        code: "2539002",
        nome: "Serviços de tratamento e revestimento em metais",
        active: false,
      },
      {
        code: "2541100",
        nome: "Fabricação de artigos de cutelaria",
        active: false,
      },
      {
        code: "2542000",
        nome: "Fabricação de artigos de serralheria, exceto esquadrias",
        active: false,
      },
      {
        code: "2543800",
        nome: "Fabricação de ferramentas",
        active: false,
      },
      {
        code: "2550101",
        nome: "Fabricação de equipamento bélico pesado, exceto veículos militares de combate",
        active: false,
      },
      {
        code: "2550102",
        nome: "Fabricação de armas de fogo, outras armas e munições",
        active: false,
      },
      {
        code: "2591800",
        nome: "Fabricação de embalagens metálicas",
        active: false,
      },
      {
        code: "2592601",
        nome: "Fabricação de produtos de trefilados de metal padronizados",
        active: false,
      },
      {
        code: "2592602",
        nome: "Fabricação de produtos de trefilados de metal, exceto padronizados",
        active: false,
      },
      {
        code: "2593400",
        nome: "Fabricação de artigos de metal para uso doméstico e pessoal",
        active: false,
      },
      {
        code: "2599301",
        nome: "Serviços de confecção de armações metálicas para a construção",
        active: false,
      },
      {
        code: "2599302",
        nome: "Serviço de corte e dobra de metais",
        active: false,
      },
      {
        code: "2599399",
        nome: "Fabricação de outros produtos de metal não especificados anteriormente",
        active: false,
      },
      {
        code: "2610800",
        nome: "Fabricação de componentes eletrônicos",
        active: false,
      },
      {
        code: "2621300",
        nome: "Fabricação de equipamentos de informática",
        active: false,
      },
      {
        code: "2622100",
        nome: "Fabricação de periféricos para equipamentos de informática",
        active: false,
      },
      {
        code: "2631100",
        nome: "Fabricação de equipamentos transmissores de comunicação, peças e acessórios",
        active: false,
      },
      {
        code: "2632900",
        nome: "Fabricação de aparelhos telefônicos e de outros equipamentos de comunicação, peças e acessórios",
        active: false,
      },
      {
        code: "2640000",
        nome: "Fabricação de aparelhos de recepção, reprodução, gravação e amplificação de áudio e vídeo",
        active: false,
      },
      {
        code: "2651500",
        nome: "Fabricação de aparelhos e equipamentos de medida, teste e controle",
        active: false,
      },
      {
        code: "2652300",
        nome: "Fabricação de cronômetros e relógios",
        active: false,
      },
      {
        code: "2660400",
        nome: "Fabricação de aparelhos eletromédicos e eletroterapêuticos e equipamentos de irradiação",
        active: false,
      },
      {
        code: "2670101",
        nome: "Fabricação de equipamentos e instrumentos ópticos, peças e acessórios",
        active: false,
      },
      {
        code: "2670102",
        nome: "Fabricação de aparelhos fotográficos e cinematográficos, peças e acessórios",
        active: false,
      },
      {
        code: "2680900",
        nome: "Fabricação de mídias virgens, magnéticas e ópticas",
        active: false,
      },
      {
        code: "2710401",
        nome: "Fabricação de geradores de corrente contínua e alternada, peças e acessórios",
        active: false,
      },
      {
        code: "2710402",
        nome: "Fabricação de transformadores, indutores, conversores, sincronizadores e semelhantes, peças e acessórios",
        active: false,
      },
      {
        code: "2710403",
        nome: "Fabricação de motores elétricos, peças e acessórios",
        active: false,
      },
      {
        code: "2721000",
        nome: "Fabricação de pilhas, baterias e acumuladores elétricos, exceto para veículos automotores",
        active: false,
      },
      {
        code: "2722801",
        nome: "Fabricação de baterias e acumuladores para veículos automotores",
        active: false,
      },
      {
        code: "2722802",
        nome: "Recondicionamento de baterias e acumuladores para veículos automotores",
        active: false,
      },
      {
        code: "2731700",
        nome: "Fabricação de aparelhos e equipamentos para distribuição e controle de energia elétrica",
        active: false,
      },
      {
        code: "2732500",
        nome: "Fabricação de material elétrico para instalações em circuito de consumo",
        active: false,
      },
      {
        code: "2733300",
        nome: "Fabricação de fios, cabos e condutores elétricos isolados",
        active: false,
      },
      {
        code: "2740601",
        nome: "Fabricação de lâmpadas",
        active: false,
      },
      {
        code: "2740602",
        nome: "Fabricação de luminárias e outros equipamentos de iluminação",
        active: false,
      },
      {
        code: "2751100",
        nome: "Fabricação de fogões, refrigeradores e máquinas de lavar e secar para uso doméstico, peças e acessórios",
        active: false,
      },
      {
        code: "2759701",
        nome: "Fabricação de aparelhos elétricos de uso pessoal, peças e acessórios",
        active: false,
      },
      {
        code: "2759799",
        nome: "Fabricação de outros aparelhos eletrodomésticos não especificados anteriormente, peças e acessórios",
        active: false,
      },
      {
        code: "2790201",
        nome: "Fabricação de eletrodos, contatos e outros artigos de carvão e grafita para uso elétrico, eletroímãs e isoladores",
        active: false,
      },
      {
        code: "2790202",
        nome: "Fabricação de equipamentos para sinalização e alarme",
        active: false,
      },
      {
        code: "2790299",
        nome: "Fabricação de outros equipamentos e aparelhos elétricos não especificados anteriormente",
        active: false,
      },
      {
        code: "2811900",
        nome: "Fabricação de motores e turbinas, peças e acessórios, exceto para aviões e veículos rodoviários",
        active: false,
      },
      {
        code: "2812700",
        nome: "Fabricação de equipamentos hidráulicos e pneumáticos, peças e acessórios, exceto válvulas",
        active: false,
      },
      {
        code: "2813500",
        nome: "Fabricação de válvulas, registros e dispositivos semelhantes, peças e acessórios",
        active: false,
      },
      {
        code: "2814301",
        nome: "Fabricação de compressores para uso industrial, peças e acessórios",
        active: false,
      },
      {
        code: "2814302",
        nome: "Fabricação de compressores para uso não industrial, peças e acessórios",
        active: false,
      },
      {
        code: "2815101",
        nome: "Fabricação de rolamentos para fins industriais",
        active: false,
      },
      {
        code: "2815102",
        nome: "Fabricação de equipamentos de transmissão para fins industriais, exceto rolamentos",
        active: false,
      },
      {
        code: "2821601",
        nome: "Fabricação de fornos industriais, aparelhos e equipamentos não elétricos para instalações térmicas, peças e acessórios",
        active: false,
      },
      {
        code: "2821602",
        nome: "Fabricação de estufas e fornos elétricos para fins industriais, peças e acessórios",
        active: false,
      },
      {
        code: "2822401",
        nome: "Fabricação de máquinas, equipamentos e aparelhos para transporte e elevação de pessoas, peças e acessórios",
        active: false,
      },
      {
        code: "2822402",
        nome: "Fabricação de máquinas, equipamentos e aparelhos para transporte e elevação de cargas, peças e acessórios",
        active: false,
      },
      {
        code: "2823200",
        nome: "Fabricação de máquinas e aparelhos de refrigeração e ventilação para uso industrial e comercial, peças e acessórios",
        active: false,
      },
      {
        code: "2824101",
        nome: "Fabricação de aparelhos e equipamentos de ar condicionado para uso industrial",
        active: false,
      },
      {
        code: "2824102",
        nome: "Fabricação de aparelhos e equipamentos de ar condicionado para uso não industrial",
        active: false,
      },
      {
        code: "2825900",
        nome: "Fabricação de máquinas e equipamentos para saneamento básico e ambiental, peças e acessórios",
        active: false,
      },
      {
        code: "2829101",
        nome: "Fabricação de máquinas de escrever, calcular e outros equipamentos não eletrônicos para escritório, peças e acessórios",
        active: false,
      },
      {
        code: "2829199",
        nome: "Fabricação de outras máquinas e equipamentos de uso geral não especificados anteriormente, peças e acessórios",
        active: false,
      },
      {
        code: "2831300",
        nome: "Fabricação de tratores agrícolas, peças e acessórios",
        active: false,
      },
      {
        code: "2832100",
        nome: "Fabricação de equipamentos para irrigação agrícola, peças e acessórios",
        active: false,
      },
      {
        code: "2833000",
        nome: "Fabricação de máquinas e equipamentos para a agricultura e pecuária, peças e acessórios, exceto para irrigação",
        active: false,
      },
      {
        code: "2840200",
        nome: "Fabricação de máquinas-ferramenta, peças e acessórios",
        active: false,
      },
      {
        code: "2851800",
        nome: "Fabricação de máquinas e equipamentos para a prospecção e extração de petróleo, peças e acessórios",
        active: false,
      },
      {
        code: "2852600",
        nome: "Fabricação de outras máquinas e equipamentos para uso na extração mineral, peças e acessórios, exceto na extração de petróleo",
        active: false,
      },
      {
        code: "2853400",
        nome: "Fabricação de tratores, peças e acessórios, exceto agrícolas",
        active: false,
      },
      {
        code: "2854200",
        nome: "Fabricação de máquinas e equipamentos para terraplenagem, pavimentação e construção, peças e acessórios, exceto tratores",
        active: false,
      },
      {
        code: "2861500",
        nome: "Fabricação de máquinas para a indústria metalúrgica, peças e acessórios, exceto máquinas-ferramenta",
        active: false,
      },
      {
        code: "2862300",
        nome: "Fabricação de máquinas e equipamentos para as indústrias de alimentos, bebidas e fumo, peças e acessórios",
        active: false,
      },
      {
        code: "2863100",
        nome: "Fabricação de máquinas e equipamentos para a indústria têxtil, peças e acessórios",
        active: false,
      },
      {
        code: "2864000",
        nome: "Fabricação de máquinas e equipamentos para as indústrias do vestuário, do couro e de calçados, peças e acessórios",
        active: false,
      },
      {
        code: "2865800",
        nome: "Fabricação de máquinas e equipamentos para as indústrias de celulose, papel e papelão e artefatos, peças e acessórios",
        active: false,
      },
      {
        code: "2866600",
        nome: "Fabricação de máquinas e equipamentos para a indústria do plástico, peças e acessórios",
        active: false,
      },
      {
        code: "2869100",
        nome: "Fabricação de máquinas e equipamentos para uso industrial específico não especificados anteriormente, peças e acessórios",
        active: false,
      },
      {
        code: "2910701",
        nome: "Fabricação de automóveis, camionetas e utilitários",
        active: false,
      },
      {
        code: "2910702",
        nome: "Fabricação de chassis com motor para automóveis, camionetas e utilitários",
        active: false,
      },
      {
        code: "2910703",
        nome: "Fabricação de motores para automóveis, camionetas e utilitários",
        active: false,
      },
      {
        code: "2920401",
        nome: "Fabricação de caminhões e ônibus",
        active: false,
      },
      {
        code: "2920402",
        nome: "Fabricação de motores para caminhões e ônibus",
        active: false,
      },
      {
        code: "2930101",
        nome: "Fabricação de cabines, carrocerias e reboques para caminhões",
        active: false,
      },
      {
        code: "2930102",
        nome: "Fabricação de carrocerias para ônibus",
        active: false,
      },
      {
        code: "2930103",
        nome: "Fabricação de cabines, carrocerias e reboques para outros veículos automotores, exceto caminhões e ônibus",
        active: false,
      },
      {
        code: "2941700",
        nome: "Fabricação de peças e acessórios para o sistema motor de veículos automotores",
        active: false,
      },
      {
        code: "2942500",
        nome: "Fabricação de peças e acessórios para os sistemas de marcha e transmissão de veículos automotores",
        active: false,
      },
      {
        code: "2943300",
        nome: "Fabricação de peças e acessórios para o sistema de freios de veículos automotores",
        active: false,
      },
      {
        code: "2944100",
        nome: "Fabricação de peças e acessórios para o sistema de direção e suspensão de veículos automotores",
        active: false,
      },
      {
        code: "2945000",
        nome: "Fabricação de material elétrico e eletrônico para veículos automotores, exceto baterias",
        active: false,
      },
      {
        code: "2949201",
        nome: "Fabricação de bancos e estofados para veículos automotores",
        active: false,
      },
      {
        code: "2949299",
        nome: "Fabricação de outras peças e acessórios para veículos automotores não especificadas anteriormente",
        active: false,
      },
      {
        code: "2950600",
        nome: "Recondicionamento e recuperação de motores para veículos automotores",
        active: false,
      },
      {
        code: "3011301",
        nome: "Construção de embarcações de grande porte",
        active: false,
      },
      {
        code: "3011302",
        nome: "Construção de embarcações para uso comercial e para usos especiais, exceto de grande porte",
        active: false,
      },
      {
        code: "3012100",
        nome: "Construção de embarcações para esporte e lazer",
        active: false,
      },
      {
        code: "3031800",
        nome: "Fabricação de locomotivas, vagões e outros materiais rodantes",
        active: false,
      },
      {
        code: "3032600",
        nome: "Fabricação de peças e acessórios para veículos ferroviários",
        active: false,
      },
      {
        code: "3041500",
        nome: "Fabricação de aeronaves",
        active: false,
      },
      {
        code: "3042300",
        nome: "Fabricação de turbinas, motores e outros componentes e peças para aeronaves",
        active: false,
      },
      {
        code: "3050400",
        nome: "Fabricação de veículos militares de combate",
        active: false,
      },
      {
        code: "3091101",
        nome: "Fabricação de motocicletas",
        active: false,
      },
      {
        code: "3091102",
        nome: "Fabricação de peças e acessórios para motocicletas",
        active: false,
      },
      {
        code: "3092000",
        nome: "Fabricação de bicicletas e triciclos não motorizados, peças e acessórios",
        active: false,
      },
      {
        code: "3099700",
        nome: "Fabricação de equipamentos de transporte não especificados anteriormente",
        active: false,
      },
      {
        code: "3101200",
        nome: "Fabricação de móveis com predominância de madeira",
        active: false,
      },
      {
        code: "3102100",
        nome: "Fabricação de móveis com predominância de metal",
        active: false,
      },
      {
        code: "3103900",
        nome: "Fabricação de móveis de outros materiais, exceto madeira e metal",
        active: false,
      },
      {
        code: "3104700",
        nome: "Fabricação de colchões",
        active: false,
      },
      {
        code: "3211601",
        nome: "Lapidação de gemas",
        active: false,
      },
      {
        code: "3211602",
        nome: "Fabricação de artefatos de joalheria e ourivesaria",
        active: false,
      },
      {
        code: "3211603",
        nome: "Cunhagem de moedas e medalhas",
        active: false,
      },
      {
        code: "3212400",
        nome: "Fabricação de bijuterias e artefatos semelhantes",
        active: false,
      },
      {
        code: "3220500",
        nome: "Fabricação de instrumentos musicais, peças e acessórios",
        active: false,
      },
      {
        code: "3230200",
        nome: "Fabricação de artefatos para pesca e esporte",
        active: false,
      },
      {
        code: "3240001",
        nome: "Fabricação de jogos eletrônicos",
        active: false,
      },
      {
        code: "3240002",
        nome: "Fabricação de mesas de bilhar, de sinuca e acessórios não associada à locação",
        active: false,
      },
      {
        code: "3240003",
        nome: "Fabricação de mesas de bilhar, de sinuca e acessórios associada à locação",
        active: false,
      },
      {
        code: "3240099",
        nome: "Fabricação de outros brinquedos e jogos recreativos não especificados anteriormente",
        active: false,
      },
      {
        code: "3250701",
        nome: "Fabricação de instrumentos não eletrônicos e utensílios para uso médico, cirúrgico, odontológico e de laboratório",
        active: false,
      },
      {
        code: "3250702",
        nome: "Fabricação de mobiliário para uso médico, cirúrgico, odontológico e de laboratório",
        active: false,
      },
      {
        code: "3250703",
        nome: "Fabricação de aparelhos e utensílios para correção de defeitos físicos e aparelhos ortopédicos em geral sob encomenda",
        active: false,
      },
      {
        code: "3250704",
        nome: "Fabricação de aparelhos e utensílios para correção de defeitos físicos e aparelhos ortopédicos em geral, exceto sob encomenda",
        active: false,
      },
      {
        code: "3250705",
        nome: "Fabricação de materiais para medicina e odontologia",
        active: false,
      },
      {
        code: "3250706",
        nome: "Serviços de prótese dentária",
        active: false,
      },
      {
        code: "3250707",
        nome: "Fabricação de artigos ópticos",
        active: false,
      },
      {
        code: "3250709",
        nome: "Serviço de laboratório óptico",
        active: false,
      },
      {
        code: "3291400",
        nome: "Fabricação de escovas, pincéis e vassouras",
        active: false,
      },
      {
        code: "3292201",
        nome: "Fabricação de roupas de proteção e segurança e resistentes a fogo",
        active: false,
      },
      {
        code: "3292202",
        nome: "Fabricação de equipamentos e acessórios para segurança pessoal e profissional",
        active: false,
      },
      {
        code: "3299001",
        nome: "Fabricação de guarda-chuvas e similares",
        active: false,
      },
      {
        code: "3299002",
        nome: "Fabricação de canetas, lápis e outros artigos para escritório",
        active: false,
      },
      {
        code: "3299003",
        nome: "Fabricação de letras, letreiros e placas de qualquer material, exceto luminosos",
        active: false,
      },
      {
        code: "3299004",
        nome: "Fabricação de painéis e letreiros luminosos",
        active: false,
      },
      {
        code: "3299005",
        nome: "Fabricação de aviamentos para costura",
        active: false,
      },
      {
        code: "3299006",
        nome: "Fabricação de velas, inclusive decorativas",
        active: false,
      },
      {
        code: "3299099",
        nome: "Fabricação de produtos diversos não especificados anteriormente",
        active: false,
      },
      {
        code: "3311200",
        nome: "Manutenção e reparação de tanques, reservatórios metálicos e caldeiras, exceto para veículos",
        active: false,
      },
      {
        code: "3312102",
        nome: "Manutenção e reparação de aparelhos e instrumentos de medida, teste e controle",
        active: false,
      },
      {
        code: "3312103",
        nome: "Manutenção e reparação de aparelhos eletromédicos e eletroterapêuticos e equipamentos de irradiação",
        active: false,
      },
      {
        code: "3312104",
        nome: "Manutenção e reparação de equipamentos e instrumentos ópticos",
        active: false,
      },
      {
        code: "3313901",
        nome: "Manutenção e reparação de geradores, transformadores e motores elétricos",
        active: false,
      },
      {
        code: "3313902",
        nome: "Manutenção e reparação de baterias e acumuladores elétricos, exceto para veículos",
        active: false,
      },
      {
        code: "3313999",
        nome: "Manutenção e reparação de máquinas, aparelhos e materiais elétricos não especificados anteriormente",
        active: false,
      },
      {
        code: "3314701",
        nome: "Manutenção e reparação de máquinas motrizes não elétricas",
        active: false,
      },
      {
        code: "3314702",
        nome: "Manutenção e reparação de equipamentos hidráulicos e pneumáticos, exceto válvulas",
        active: false,
      },
      {
        code: "3314703",
        nome: "Manutenção e reparação de válvulas industriais",
        active: false,
      },
      {
        code: "3314704",
        nome: "Manutenção e reparação de compressores",
        active: false,
      },
      {
        code: "3314705",
        nome: "Manutenção e reparação de equipamentos de transmissão para fins industriais",
        active: false,
      },
      {
        code: "3314706",
        nome: "Manutenção e reparação de máquinas, aparelhos e equipamentos para instalações térmicas",
        active: false,
      },
      {
        code: "3314707",
        nome: "Manutenção e reparação de máquinas e aparelhos de refrigeração e ventilação para uso industrial e comercial",
        active: false,
      },
      {
        code: "3314708",
        nome: "Manutenção e reparação de máquinas, equipamentos e aparelhos para transporte e elevação de cargas",
        active: false,
      },
      {
        code: "3314709",
        nome: "Manutenção e reparação de máquinas de escrever, calcular e de outros equipamentos não eletrônicos para escritório",
        active: false,
      },
      {
        code: "3314710",
        nome: "Manutenção e reparação de máquinas e equipamentos para uso geral não especificados anteriormente",
        active: false,
      },
      {
        code: "3314711",
        nome: "Manutenção e reparação de máquinas e equipamentos para agricultura e pecuária",
        active: false,
      },
      {
        code: "3314712",
        nome: "Manutenção e reparação de tratores agrícolas",
        active: false,
      },
      {
        code: "3314713",
        nome: "Manutenção e reparação de máquinas-ferramenta",
        active: false,
      },
      {
        code: "3314714",
        nome: "Manutenção e reparação de máquinas e equipamentos para a prospecção e extração de petróleo",
        active: false,
      },
      {
        code: "3314715",
        nome: "Manutenção e reparação de máquinas e equipamentos para uso na extração mineral, exceto na extração de petróleo",
        active: false,
      },
      {
        code: "3314716",
        nome: "Manutenção e reparação de tratores, exceto agrícolas",
        active: false,
      },
      {
        code: "3314717",
        nome: "Manutenção e reparação de máquinas e equipamentos de terraplenagem, pavimentação e construção, exceto tratores",
        active: false,
      },
      {
        code: "3314718",
        nome: "Manutenção e reparação de máquinas para a indústria metalúrgica, exceto máquinas-ferramenta",
        active: false,
      },
      {
        code: "3314719",
        nome: "Manutenção e reparação de máquinas e equipamentos para as indústrias de alimentos, bebidas e fumo",
        active: false,
      },
      {
        code: "3314720",
        nome: "Manutenção e reparação de máquinas e equipamentos para a indústria têxtil, do vestuário, do couro e calçados",
        active: false,
      },
      {
        code: "3314721",
        nome: "Manutenção e reparação de máquinas e aparelhos para a indústria de celulose, papel e papelão e artefatos",
        active: false,
      },
      {
        code: "3314722",
        nome: "Manutenção e reparação de máquinas e aparelhos para a indústria do plástico",
        active: false,
      },
      {
        code: "3314799",
        nome: "Manutenção e reparação de outras máquinas e equipamentos para usos industriais não especificados anteriormente",
        active: false,
      },
      {
        code: "3315500",
        nome: "Manutenção e reparação de veículos ferroviários",
        active: false,
      },
      {
        code: "3316301",
        nome: "Manutenção e reparação de aeronaves, exceto a manutenção na pista",
        active: false,
      },
      {
        code: "3316302",
        nome: "Manutenção de aeronaves na pista",
        active: false,
      },
      {
        code: "3317101",
        nome: "Manutenção e reparação de embarcações e estruturas flutuantes",
        active: false,
      },
      {
        code: "3317102",
        nome: "Manutenção e reparação de embarcações para esporte e lazer",
        active: false,
      },
      {
        code: "3319800",
        nome: "Manutenção e reparação de equipamentos e produtos não especificados anteriormente",
        active: false,
      },
      {
        code: "3321000",
        nome: "Instalação de máquinas e equipamentos industriais",
        active: false,
      },
      {
        code: "3329501",
        nome: "Serviços de montagem de móveis de qualquer material",
        active: false,
      },
      {
        code: "3329599",
        nome: "Instalação de outros equipamentos não especificados anteriormente",
        active: false,
      },
      {
        code: "3511501",
        nome: "Geração de energia elétrica",
        active: false,
      },
      {
        code: "3511502",
        nome: "Atividades de coordenação e controle da operação da geração e transmissão de energia elétrica",
        active: false,
      },
      {
        code: "3512300",
        nome: "Transmissão de energia elétrica",
        active: false,
      },
      {
        code: "3513100",
        nome: "Comércio atacadista de energia elétrica",
        active: false,
      },
      {
        code: "3514000",
        nome: "Distribuição de energia elétrica",
        active: false,
      },
      {
        code: "3520401",
        nome: "Produção de gás; processamento de gás natural",
        active: false,
      },
      {
        code: "3520402",
        nome: "Distribuição de combustíveis gasosos por redes urbanas",
        active: false,
      },
      {
        code: "3530100",
        nome: "Produção e distribuição de vapor, água quente e ar condicionado",
        active: false,
      },
      {
        code: "3600601",
        nome: "Captação, tratamento e distribuição de água",
        active: false,
      },
      {
        code: "3600602",
        nome: "Distribuição de água por caminhões",
        active: false,
      },
      {
        code: "3701100",
        nome: "Gestão de redes de esgoto",
        active: false,
      },
      {
        code: "3702900",
        nome: "Atividades relacionadas a esgoto, exceto a gestão de redes",
        active: false,
      },
      {
        code: "3811400",
        nome: "Coleta de resíduos não perigosos",
        active: false,
      },
      {
        code: "3812200",
        nome: "Coleta de resíduos perigosos",
        active: false,
      },
      {
        code: "3821100",
        nome: "Tratamento e disposição de resíduos não perigosos",
        active: false,
      },
      {
        code: "3822000",
        nome: "Tratamento e disposição de resíduos perigosos",
        active: false,
      },
      {
        code: "3831901",
        nome: "Recuperação de sucatas de alumínio",
        active: false,
      },
      {
        code: "3831999",
        nome: "Recuperação de materiais metálicos, exceto alumínio",
        active: false,
      },
      {
        code: "3832700",
        nome: "Recuperação de materiais plásticos",
        active: false,
      },
      {
        code: "3839401",
        nome: "Usinas de compostagem",
        active: false,
      },
      {
        code: "3839499",
        nome: "Recuperação de materiais não especificados anteriormente",
        active: false,
      },
      {
        code: "3900500",
        nome: "Descontaminação e outros serviços de gestão de resíduos",
        active: false,
      },
      {
        code: "4110700",
        nome: "Incorporação de empreendimentos imobiliários",
        active: false,
      },
      {
        code: "4120400",
        nome: "Construção de edifícios",
        active: false,
      },
      {
        code: "4211101",
        nome: "Construção de rodovias e ferrovias",
        active: false,
      },
      {
        code: "4211102",
        nome: "Pintura para sinalização em pistas rodoviárias e aeroportos",
        active: false,
      },
      {
        code: "4212000",
        nome: "Construção de obras de arte especiais",
        active: false,
      },
      {
        code: "4213800",
        nome: "Obras de urbanização - ruas, praças e calçadas",
        active: false,
      },
      {
        code: "4221901",
        nome: "Construção de barragens e represas para geração de energia\r\nelétrica",
        active: false,
      },
      {
        code: "4221902",
        nome: "Construção de estações e redes de distribuição de energia elétrica",
        active: false,
      },
      {
        code: "4221903",
        nome: "Manutenção de redes de distribuição de energia elétrica",
        active: false,
      },
      {
        code: "4221904",
        nome: "Construção de estações e redes de telecomunicações",
        active: false,
      },
      {
        code: "4221905",
        nome: "Manutenção de estações e redes de telecomunicações",
        active: false,
      },
      {
        code: "4222701",
        nome: "Construção de redes de abastecimento de água, coleta de esgoto e construções correlatas, exceto obras de irrigação",
        active: false,
      },
      {
        code: "4222702",
        nome: "Obras de irrigação",
        active: false,
      },
      {
        code: "4223500",
        nome: "Construção de redes de transportes por dutos, exceto para água e esgoto",
        active: false,
      },
      {
        code: "4291000",
        nome: "Obras portuárias, marítimas e fluviais",
        active: false,
      },
      {
        code: "4292801",
        nome: "Montagem de estruturas metálicas",
        active: false,
      },
      {
        code: "4292802",
        nome: "Obras de montagem industrial",
        active: false,
      },
      {
        code: "4299501",
        nome: "Construção de instalações esportivas e recreativas",
        active: false,
      },
      {
        code: "4299599",
        nome: "Outras obras de engenharia civil não especificadas anteriormente",
        active: false,
      },
      {
        code: "4311801",
        nome: "Demolição de edifícios e outras estruturas",
        active: false,
      },
      {
        code: "4311802",
        nome: "Preparação de canteiro e limpeza de terreno",
        active: false,
      },
      {
        code: "4312600",
        nome: "Perfurações e sondagens",
        active: false,
      },
      {
        code: "4313400",
        nome: "Obras de terraplenagem",
        active: false,
      },
      {
        code: "4319300",
        nome: "Serviços de preparação do terreno não especificados anteriormente",
        active: false,
      },
      {
        code: "4321500",
        nome: "Instalação e manutenção elétrica",
        active: false,
      },
      {
        code: "4322301",
        nome: "Instalações hidráulicas, sanitárias e de gás",
        active: false,
      },
      {
        code: "4322302",
        nome: "Instalação e manutenção de sistemas centrais de ar condicionado, de ventilação e refrigeração",
        active: false,
      },
      {
        code: "4322303",
        nome: "Instalações de sistema de prevenção contra incêndio",
        active: false,
      },
      {
        code: "4329101",
        nome: "Instalação de painéis publicitários",
        active: false,
      },
      {
        code: "4329102",
        nome: "Instalação de equipamentos para orientação à navegação marítima, fluvial e lacustre",
        active: false,
      },
      {
        code: "4329103",
        nome: "Instalação, manutenção e reparação de elevadores, escadas e esteiras rolantes",
        active: false,
      },
      {
        code: "4329104",
        nome: "Montagem e instalação de sistemas e equipamentos de iluminação e sinalização em vias públicas, portos e aeroportos",
        active: false,
      },
      {
        code: "4329105",
        nome: "Tratamentos térmicos, acústicos ou de vibração",
        active: false,
      },
      {
        code: "4329199",
        nome: "Outras obras de instalações em construções não especificadas anteriormente",
        active: false,
      },
      {
        code: "4330401",
        nome: "Impermeabilização em obras de engenharia civil",
        active: false,
      },
      {
        code: "4330402",
        nome: "Instalação de portas, janelas, tetos, divisórias e armários embutidos de qualquer material",
        active: false,
      },
      {
        code: "4330403",
        nome: "Obras de acabamento em gesso e estuque",
        active: false,
      },
      {
        code: "4330404",
        nome: "Serviços de pintura de edifícios em geral",
        active: false,
      },
      {
        code: "4330405",
        nome: "Aplicação de revestimentos e de resinas em interiores e exteriores",
        active: false,
      },
      {
        code: "4330499",
        nome: "Outras obras de acabamento da construção",
        active: false,
      },
      {
        code: "4391600",
        nome: "Obras de fundações",
        active: false,
      },
      {
        code: "4399101",
        nome: "Administração de obras",
        active: false,
      },
      {
        code: "4399102",
        nome: "Montagem e desmontagem de andaimes e outras estruturas temporárias",
        active: false,
      },
      {
        code: "4399103",
        nome: "Obras de alvenaria",
        active: false,
      },
      {
        code: "4399104",
        nome: "Serviços de operação e fornecimento de equipamentos para transporte e elevação de cargas e pessoas para uso em obras",
        active: false,
      },
      {
        code: "4399105",
        nome: "Perfuração e construção de poços de água",
        active: false,
      },
      {
        code: "4399199",
        nome: "Serviços especializados para construção não especificados anteriormente",
        active: false,
      },
      {
        code: "4511101",
        nome: "Comércio a varejo de automóveis, camionetas e utilitários novos",
        active: false,
      },
      {
        code: "4511102",
        nome: "Comércio a varejo de automóveis, camionetas e utilitários usados",
        active: false,
      },
      {
        code: "4511103",
        nome: "Comércio por atacado de automóveis, camionetas e utilitários novos e usados",
        active: false,
      },
      {
        code: "4511104",
        nome: "Comércio por atacado de caminhões novos e usados",
        active: false,
      },
      {
        code: "4511105",
        nome: "Comércio por atacado de reboques e semireboques novos e usados",
        active: false,
      },
      {
        code: "4511106",
        nome: "Comércio por atacado de ônibus e micro-ônibus novos e usados",
        active: false,
      },
      {
        code: "4512901",
        nome: "Representantes comerciais e agentes do comércio de veículos automotores",
        active: false,
      },
      {
        code: "4512902",
        nome: "Comércio sob consignação de veículos automotores",
        active: false,
      },
      {
        code: "4520001",
        nome: "Serviços de manutenção e reparação mecânica de veículos automotores",
        active: false,
      },
      {
        code: "4520002",
        nome: "Serviços de lanternagem ou funilaria e pintura de veículos automotores",
        active: false,
      },
      {
        code: "4520003",
        nome: "Serviços de manutenção e reparação elétrica de veículos automotores",
        active: false,
      },
      {
        code: "4520004",
        nome: "Serviços de alinhamento e balanceamento de veículos automotores",
        active: false,
      },
      {
        code: "4520005",
        nome: "Serviços de lavagem, lubrificação e polimento de veículos automotores",
        active: false,
      },
      {
        code: "4520006",
        nome: "Serviços de borracharia para veículos automotores",
        active: false,
      },
      {
        code: "4520007",
        nome: "Serviços de instalação, manutenção e reparação de acessórios para veículos automotores",
        active: false,
      },
      {
        code: "4520008",
        nome: "Serviços de capotaria",
        active: false,
      },
      {
        code: "4530701",
        nome: "Comércio por atacado de peças e acessórios novos para veículos automotores",
        active: false,
      },
      {
        code: "4530702",
        nome: "Comércio por atacado de pneumáticos e câmaras-de-ar",
        active: false,
      },
      {
        code: "4530703",
        nome: "Comércio a varejo de peças e acessórios novos para veículos automotores",
        active: false,
      },
      {
        code: "4530704",
        nome: "Comércio a varejo de peças e acessórios usados para veículos automotores",
        active: false,
      },
      {
        code: "4530705",
        nome: "Comércio a varejo de pneumáticos e câmaras-de-ar",
        active: false,
      },
      {
        code: "4530706",
        nome: "Representantes comerciais e agentes do comércio de peças e acessórios novos e usados para veículos automotores",
        active: false,
      },
      {
        code: "4541201",
        nome: "Comércio por atacado de motocicletas e motonetas",
        active: false,
      },
      {
        code: "4541202",
        nome: "Comércio por atacado de peças e acessórios para motocicletas e motonetas",
        active: false,
      },
      {
        code: "4541203",
        nome: "Comércio a varejo de motocicletas e motonetas novas",
        active: false,
      },
      {
        code: "4541204",
        nome: "Comércio a varejo de motocicletas e motonetas usadas",
        active: false,
      },
      {
        code: "4541206",
        nome: "Comércio a varejo de peças e acessórios novos para motocicletas e motonetas",
        active: false,
      },
      {
        code: "4541207",
        nome: "Comércio a varejo de peças e acessórios usados para motocicletas e motonetas",
        active: false,
      },
      {
        code: "4542101",
        nome: "Representantes comerciais e agentes do comércio de motocicletas e motonetas, peças e acessórios",
        active: false,
      },
      {
        code: "4542102",
        nome: "Comércio sob consignação de motocicletas e motonetas",
        active: false,
      },
      {
        code: "4543900",
        nome: "Manutenção e reparação de motocicletas e motonetas",
        active: false,
      },
      {
        code: "4611700",
        nome: "Representantes comerciais e agentes do comércio de matérias-primas agrícolas e animais vivos",
        active: false,
      },
      {
        code: "4612500",
        nome: "Representantes comerciais e agentes do comércio de combustíveis, minerais, produtos siderúrgicos e químicos",
        active: false,
      },
      {
        code: "4613300",
        nome: "Representantes comerciais e agentes do comércio de madeira, material de construção e ferragens",
        active: false,
      },
      {
        code: "4614100",
        nome: "Representantes comerciais e agentes do comércio de máquinas, equipamentos, embarcações e aeronaves",
        active: false,
      },
      {
        code: "4615000",
        nome: "Representantes comerciais e agentes do comércio de eletrodomésticos, móveis e artigos de uso doméstico",
        active: false,
      },
      {
        code: "4616800",
        nome: "Representantes comerciais e agentes do comércio de têxteis, vestuário, calçados e artigos de viagem",
        active: false,
      },
      {
        code: "4617600",
        nome: "Representantes comerciais e agentes do comércio de produtos alimentícios, bebidas e fumo",
        active: false,
      },
      {
        code: "4618401",
        nome: "Representantes comerciais e agentes do comércio de medicamentos, cosméticos e produtos de perfumaria",
        active: false,
      },
      {
        code: "4618402",
        nome: "Representantes comerciais e agentes do comércio de instrumentos e materiais odonto-médico-hospitalares",
        active: false,
      },
      {
        code: "4618403",
        nome: "Representantes comerciais e agentes do comércio de jornais, revistas e outras publicações",
        active: false,
      },
      {
        code: "4618499",
        nome: "Outros representantes comerciais e agentes do comércio especializado em produtos não especificados anteriormente",
        active: false,
      },
      {
        code: "4619200",
        nome: "Representantes comerciais e agentes do comércio de mercadorias em geral não especializado",
        active: false,
      },
      {
        code: "4621400",
        nome: "Comércio atacadista de café em grão",
        active: false,
      },
      {
        code: "4622200",
        nome: "Comércio atacadista de soja",
        active: false,
      },
      {
        code: "4623101",
        nome: "Comércio atacadista de animais vivos",
        active: false,
      },
      {
        code: "4623102",
        nome: "Comércio atacadista de couros, lãs, peles e outros subprodutos não comestíveis de origem animal",
        active: false,
      },
      {
        code: "4623103",
        nome: "Comércio atacadista de algodão",
        active: false,
      },
      {
        code: "4623104",
        nome: "Comércio atacadista de fumo em folha não beneficiado",
        active: false,
      },
      {
        code: "4623105",
        nome: "Comércio atacadista de cacau",
        active: false,
      },
      {
        code: "4623106",
        nome: "Comércio atacadista de sementes, flores, plantas e gramas",
        active: false,
      },
      {
        code: "4623107",
        nome: "Comércio atacadista de sisal",
        active: false,
      },
      {
        code: "4623108",
        nome: "Comércio atacadista de matérias-primas agrícolas com atividade de fracionamento e acondicionamento associada",
        active: false,
      },
      {
        code: "4623109",
        nome: "Comércio atacadista de alimentos para animais",
        active: false,
      },
      {
        code: "4623199",
        nome: "Comércio atacadista de matérias-primas agrícolas não especificadas anteriormente",
        active: false,
      },
      {
        code: "4631100",
        nome: "Comércio atacadista de leite e laticínios",
        active: false,
      },
      {
        code: "4632001",
        nome: "Comércio atacadista de cereais e leguminosas beneficiados",
        active: false,
      },
      {
        code: "4632002",
        nome: "Comércio atacadista de farinhas, amidos e féculas",
        active: false,
      },
      {
        code: "4632003",
        nome: "Comércio atacadista de cereais e leguminosas beneficiados, farinhas, amidos e féculas, com atividade de fracionamento e acondicionamento associada",
        active: false,
      },
      {
        code: "4633801",
        nome: "Comércio atacadista de frutas, verduras, raízes, tubérculos, hortaliças e legumes frescos",
        active: false,
      },
      {
        code: "4633802",
        nome: "Comércio atacadista de aves vivas e ovos",
        active: false,
      },
      {
        code: "4633803",
        nome: "Comércio atacadista de coelhos e outros pequenos animais vivos para alimentação",
        active: false,
      },
      {
        code: "4634601",
        nome: "Comércio atacadista de carnes bovinas e suínas e derivados",
        active: false,
      },
      {
        code: "4634602",
        nome: "Comércio atacadista de aves abatidas e derivados",
        active: false,
      },
      {
        code: "4634603",
        nome: "Comércio atacadista de pescados e frutos do mar",
        active: false,
      },
      {
        code: "4634699",
        nome: "Comércio atacadista de carnes e derivados de outros animais",
        active: false,
      },
      {
        code: "4635401",
        nome: "Comércio atacadista de água mineral",
        active: false,
      },
      {
        code: "4635402",
        nome: "Comércio atacadista de cerveja, chope e refrigerante",
        active: false,
      },
      {
        code: "4635403",
        nome: "Comércio atacadista de bebidas com atividade de fracionamento e acondicionamento associada",
        active: false,
      },
      {
        code: "4635499",
        nome: "Comércio atacadista de bebidas não especificadas anteriormente",
        active: false,
      },
      {
        code: "4636201",
        nome: "Comércio atacadista de fumo beneficiado",
        active: false,
      },
      {
        code: "4636202",
        nome: "Comércio atacadista de cigarros, cigarrilhas e charutos",
        active: false,
      },
      {
        code: "4637101",
        nome: "Comércio atacadista de café torrado, moído e solúvel",
        active: false,
      },
      {
        code: "4637102",
        nome: "Comércio atacadista de açúcar",
        active: false,
      },
      {
        code: "4637103",
        nome: "Comércio atacadista de óleos e gorduras",
        active: false,
      },
      {
        code: "4637104",
        nome: "Comércio atacadista de pães, bolos, biscoitos e similares",
        active: false,
      },
      {
        code: "4637105",
        nome: "Comércio atacadista de massas alimentícias",
        active: false,
      },
      {
        code: "4637106",
        nome: "Comércio atacadista de sorvetes",
        active: false,
      },
      {
        code: "4637107",
        nome: "Comércio atacadista de chocolates, confeitos, balas, bombons e semelhantes",
        active: false,
      },
      {
        code: "4637199",
        nome: "Comércio atacadista especializado em outros produtos alimentícios não especificados anteriormente",
        active: false,
      },
      {
        code: "4639701",
        nome: "Comércio atacadista de produtos alimentícios em geral",
        active: false,
      },
      {
        code: "4639702",
        nome: "Comércio atacadista de produtos alimentícios em geral, com atividade de fracionamento e acondicionamento associada",
        active: false,
      },
      {
        code: "4641901",
        nome: "Comércio atacadista de tecidos",
        active: false,
      },
      {
        code: "4641902",
        nome: "Comércio atacadista de artigos de cama, mesa e banho",
        active: false,
      },
      {
        code: "4641903",
        nome: "Comércio atacadista de artigos de armarinho",
        active: false,
      },
      {
        code: "4642701",
        nome: "Comércio atacadista de artigos do vestuário e acessórios, exceto profissionais e de segurança",
        active: false,
      },
      {
        code: "4642702",
        nome: "Comércio atacadista de roupas e acessórios para uso profissional e de segurança do trabalho",
        active: false,
      },
      {
        code: "4643501",
        nome: "Comércio atacadista de calçados",
        active: false,
      },
      {
        code: "4643502",
        nome: "Comércio atacadista de bolsas, malas e artigos de viagem",
        active: false,
      },
      {
        code: "4644301",
        nome: "Comércio atacadista de medicamentos e drogas de uso humano",
        active: false,
      },
      {
        code: "4644302",
        nome: "Comércio atacadista de medicamentos e drogas de uso veterinário",
        active: false,
      },
      {
        code: "4645101",
        nome: "Comércio atacadista de instrumentos e materiais para uso médico, cirúrgico, hospitalar e de laboratórios",
        active: false,
      },
      {
        code: "4645102",
        nome: "Comércio atacadista de próteses e artigos de ortopedia",
        active: false,
      },
      {
        code: "4645103",
        nome: "Comércio atacadista de produtos odontológicos",
        active: false,
      },
      {
        code: "4646001",
        nome: "Comércio atacadista de cosméticos e produtos de perfumaria",
        active: false,
      },
      {
        code: "4646002",
        nome: "Comércio atacadista de produtos de higiene pessoal",
        active: false,
      },
      {
        code: "4647801",
        nome: "Comércio atacadista de artigos de escritório e de papelaria",
        active: false,
      },
      {
        code: "4647802",
        nome: "Comércio atacadista de livros, jornais e outras publicações",
        active: false,
      },
      {
        code: "4649401",
        nome: "Comércio atacadista de equipamentos elétricos de uso pessoal e doméstico",
        active: false,
      },
      {
        code: "4649402",
        nome: "Comércio atacadista de aparelhos eletrônicos de uso pessoal e doméstico",
        active: false,
      },
      {
        code: "4649403",
        nome: "Comércio atacadista de bicicletas, triciclos e outros veículos recreativos",
        active: false,
      },
      {
        code: "4649404",
        nome: "Comércio atacadista de móveis e artigos de colchoaria",
        active: false,
      },
      {
        code: "4649405",
        nome: "Comércio atacadista de artigos de tapeçaria; persianas e cortinas",
        active: false,
      },
      {
        code: "4649406",
        nome: "Comércio atacadista de lustres, luminárias e abajures",
        active: false,
      },
      {
        code: "4649407",
        nome: "Comércio atacadista de filmes, CDs, DVDs, fitas e discos",
        active: false,
      },
      {
        code: "4649408",
        nome: "Comércio atacadista de produtos de higiene, limpeza e conservação domiciliar",
        active: false,
      },
      {
        code: "4649409",
        nome: "Comércio atacadista de produtos de higiene, limpeza e conservação domiciliar, com atividade de fracionamento e acondicionamento associada",
        active: false,
      },
      {
        code: "4649410",
        nome: "Comércio atacadista de jóias, relógios e bijuterias, inclusive pedras preciosas e semipreciosas lapidadas",
        active: false,
      },
      {
        code: "4649499",
        nome: "Comércio atacadista de outros equipamentos e artigos de uso pessoal e doméstico não especificados anteriormente",
        active: false,
      },
      {
        code: "4651601",
        nome: "Comércio atacadista de equipamentos de informática",
        active: false,
      },
      {
        code: "4651602",
        nome: "Comércio atacadista de suprimentos para informática",
        active: false,
      },
      {
        code: "4652400",
        nome: "Comércio atacadista de componentes eletrônicos e equipamentos de telefonia e comunicação",
        active: false,
      },
      {
        code: "4661300",
        nome: "Comércio atacadista de máquinas, aparelhos e equipamentos para uso agropecuário; partes e peças",
        active: false,
      },
      {
        code: "4662100",
        nome: "Comércio atacadista de máquinas, equipamentos para terraplenagem, mineração e construção; partes e peças",
        active: false,
      },
      {
        code: "4663000",
        nome: "Comércio atacadista de máquinas e equipamentos para uso industrial; partes e peças",
        active: false,
      },
      {
        code: "4664800",
        nome: "Comércio atacadista de máquinas, aparelhos e equipamentos para uso odonto-médico-hospitalar; partes e peças",
        active: false,
      },
      {
        code: "4665600",
        nome: "Comércio atacadista de máquinas e equipamentos para uso comercial; partes e peças",
        active: false,
      },
      {
        code: "4669901",
        nome: "Comércio atacadista de bombas e compressores; partes e peças",
        active: false,
      },
      {
        code: "4669999",
        nome: "Comércio atacadista de outras máquinas e equipamentos não especificados anteriormente; partes e peças",
        active: false,
      },
      {
        code: "4671100",
        nome: "Comércio atacadista de madeira e produtos derivados",
        active: false,
      },
      {
        code: "4672900",
        nome: "Comércio atacadista de ferragens e ferramentas",
        active: false,
      },
      {
        code: "4673700",
        nome: "Comércio atacadista de material elétrico",
        active: false,
      },
      {
        code: "4674500",
        nome: "Comércio atacadista de cimento",
        active: false,
      },
      {
        code: "4679601",
        nome: "Comércio atacadista de tintas, vernizes e similares",
        active: false,
      },
      {
        code: "4679602",
        nome: "Comércio atacadista de mármores e granitos",
        active: false,
      },
      {
        code: "4679603",
        nome: "Comércio atacadista de vidros, espelhos e vitrais",
        active: false,
      },
      {
        code: "4679604",
        nome: "Comércio atacadista especializado de materiais de construção não especificados anteriormente",
        active: false,
      },
      {
        code: "4679699",
        nome: "Comércio atacadista de materiais de construção em geral",
        active: false,
      },
      {
        code: "4681801",
        nome: "Comércio atacadista de álcool carburante, biodiesel, gasolina e demais derivados de petróleo, exceto lubrificantes, não realizado por transportador retalhista (TRR)",
        active: false,
      },
      {
        code: "4681802",
        nome: "Comércio atacadista de combustíveis realizado por transportador retalhista (TRR)",
        active: false,
      },
      {
        code: "4681803",
        nome: "Comércio atacadista de combustíveis de origem vegetal, exceto álcool carburante",
        active: false,
      },
      {
        code: "4681804",
        nome: "Comércio atacadista de combustíveis de origem mineral em bruto",
        active: false,
      },
      {
        code: "4681805",
        nome: "Comércio atacadista de lubrificantes",
        active: false,
      },
      {
        code: "4682600",
        nome: "Comércio atacadista de gás liquefeito de petróleo (GLP)",
        active: false,
      },
      {
        code: "4683400",
        nome: "Comércio atacadista de defensivos agrícolas, adubos, fertilizantes e corretivos do solo",
        active: false,
      },
      {
        code: "4684201",
        nome: "Comércio atacadista de resinas e elastômeros",
        active: false,
      },
      {
        code: "4684202",
        nome: "Comércio atacadista de solventes",
        active: false,
      },
      {
        code: "4684299",
        nome: "Comércio atacadista de outros produtos químicos e petroquímicos não especificados anteriormente",
        active: false,
      },
      {
        code: "4685100",
        nome: "Comércio atacadista de produtos siderúrgicos e metalúrgicos, exceto para construção",
        active: false,
      },
      {
        code: "4686901",
        nome: "Comércio atacadista de papel e papelão em bruto",
        active: false,
      },
      {
        code: "4686902",
        nome: "Comércio atacadista de embalagens",
        active: false,
      },
      {
        code: "4687701",
        nome: "Comércio atacadista de resíduos de papel e papelão",
        active: false,
      },
      {
        code: "4687702",
        nome: "Comércio atacadista de resíduos e sucatas não metálicos, exceto de papel e papelão",
        active: false,
      },
      {
        code: "4687703",
        nome: "Comércio atacadista de resíduos e sucatas metálicos",
        active: false,
      },
      {
        code: "4689301",
        nome: "Comércio atacadista de produtos da extração mineral, exceto combustíveis",
        active: false,
      },
      {
        code: "4689302",
        nome: "Comércio atacadista de fios e fibras beneficiados",
        active: false,
      },
      {
        code: "4689399",
        nome: "Comércio atacadista especializado em outros produtos intermediários não especificados anteriormente",
        active: false,
      },
      {
        code: "4691500",
        nome: "Comércio atacadista de mercadorias em geral, com predominância de produtos alimentícios",
        active: false,
      },
      {
        code: "4692300",
        nome: "Comércio atacadista de mercadorias em geral, com predominância de insumos agropecuários",
        active: false,
      },
      {
        code: "4693100",
        nome: "Comércio atacadista de mercadorias em geral, sem predominância de alimentos ou de insumos agropecuários",
        active: false,
      },
      {
        code: "4711301",
        nome: "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - hipermercados",
        active: false,
      },
      {
        code: "4711302",
        nome: "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados",
        active: false,
      },
      {
        code: "4712100",
        nome: "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - minimercados, mercearias e armazéns",
        active: false,
      },
      {
        code: "4713002",
        nome: "Lojas de variedades, exceto lojas de departamentos ou magazines",
        active: false,
      },
      {
        code: "4713004",
        nome: "Lojas de departamentos ou magazines, exceto lojas francas (Duty free)",
        active: false,
      },
      {
        code: "4713005",
        nome: "Lojas francas (Duty Free) de aeroportos, portos e em fronteiras terrestres",
        active: false,
      },
      {
        code: "4721102",
        nome: "Padaria e confeitaria com predominância de revenda",
        active: false,
      },
      {
        code: "4721103",
        nome: "Comércio varejista de laticínios e frios",
        active: false,
      },
      {
        code: "4721104",
        nome: "Comércio varejista de doces, balas, bombons e semelhantes",
        active: false,
      },
      {
        code: "4722901",
        nome: "Comércio varejista de carnes - açougues",
        active: false,
      },
      {
        code: "4722902",
        nome: "Peixaria",
        active: false,
      },
      {
        code: "4723700",
        nome: "Comércio varejista de bebidas",
        active: false,
      },
      {
        code: "4724500",
        nome: "Comércio varejista de hortifrutigranjeiros",
        active: false,
      },
      {
        code: "4729601",
        nome: "Tabacaria",
        active: false,
      },
      {
        code: "4729602",
        nome: "Comércio varejista de mercadorias em lojas de conveniência",
        active: false,
      },
      {
        code: "4729699",
        nome: "Comércio varejista de produtos alimentícios em geral ou especializado em produtos alimentícios não especificados anteriormente",
        active: false,
      },
      {
        code: "4731800",
        nome: "Comércio varejista de combustíveis para veículos automotores",
        active: false,
      },
      {
        code: "4732600",
        nome: "Comércio varejista de lubrificantes",
        active: false,
      },
      {
        code: "4741500",
        nome: "Comércio varejista de tintas e materiais para pintura",
        active: false,
      },
      {
        code: "4742300",
        nome: "Comércio varejista de material elétrico",
        active: false,
      },
      {
        code: "4743100",
        nome: "Comércio varejista de vidros",
        active: false,
      },
      {
        code: "4744001",
        nome: "Comércio varejista de ferragens e ferramentas",
        active: false,
      },
      {
        code: "4744002",
        nome: "Comércio varejista de madeira e artefatos",
        active: false,
      },
      {
        code: "4744003",
        nome: "Comércio varejista de materiais hidráulicos",
        active: false,
      },
      {
        code: "4744004",
        nome: "Comércio varejista de cal, areia, pedra britada, tijolos e telhas",
        active: false,
      },
      {
        code: "4744005",
        nome: "Comércio varejista de materiais de construção não especificados anteriormente",
        active: false,
      },
      {
        code: "4744006",
        nome: "Comércio varejista de pedras para revestimento",
        active: false,
      },
      {
        code: "4744099",
        nome: "Comércio varejista de materiais de construção em geral",
        active: false,
      },
      {
        code: "4751201",
        nome: "Comércio varejista especializado de equipamentos e suprimentos de informática",
        active: false,
      },
      {
        code: "4751202",
        nome: "Recarga de cartuchos para equipamentos de informática",
        active: false,
      },
      {
        code: "4752100",
        nome: "Comércio varejista especializado de equipamentos de telefonia e comunicação",
        active: false,
      },
      {
        code: "4753900",
        nome: "Comércio varejista especializado de eletrodomésticos e equipamentos de áudio e vídeo",
        active: false,
      },
      {
        code: "4754701",
        nome: "Comércio varejista de móveis",
        active: false,
      },
      {
        code: "4754702",
        nome: "Comércio varejista de artigos de colchoaria",
        active: false,
      },
      {
        code: "4754703",
        nome: "Comércio varejista de artigos de iluminação",
        active: false,
      },
      {
        code: "4755501",
        nome: "Comércio varejista de tecidos",
        active: false,
      },
      {
        code: "4755502",
        nome: "Comercio varejista de artigos de armarinho",
        active: false,
      },
      {
        code: "4755503",
        nome: "Comercio varejista de artigos de cama, mesa e banho",
        active: false,
      },
      {
        code: "4756300",
        nome: "Comércio varejista especializado de instrumentos musicais e acessórios",
        active: false,
      },
      {
        code: "4757100",
        nome: "Comércio varejista especializado de peças e acessórios para aparelhos eletroeletrônicos para uso doméstico, exceto informática e comunicação",
        active: false,
      },
      {
        code: "4759801",
        nome: "Comércio varejista de artigos de tapeçaria, cortinas e persianas",
        active: false,
      },
      {
        code: "4759899",
        nome: "Comércio varejista de outros artigos de uso doméstico não especificados anteriormente",
        active: false,
      },
      {
        code: "4761001",
        nome: "Comércio varejista de livros",
        active: false,
      },
      {
        code: "4761002",
        nome: "Comércio varejista de jornais e revistas",
        active: false,
      },
      {
        code: "4761003",
        nome: "Comércio varejista de artigos de papelaria",
        active: false,
      },
      {
        code: "4762800",
        nome: "Comércio varejista de discos, CDs, DVDs e fitas",
        active: false,
      },
      {
        code: "4763601",
        nome: "Comércio varejista de brinquedos e artigos recreativos",
        active: false,
      },
      {
        code: "4763602",
        nome: "Comércio varejista de artigos esportivos",
        active: false,
      },
      {
        code: "4763603",
        nome: "Comércio varejista de bicicletas e triciclos; peças e acessórios",
        active: false,
      },
      {
        code: "4763604",
        nome: "Comércio varejista de artigos de caça, pesca e camping",
        active: false,
      },
      {
        code: "4763605",
        nome: "Comércio varejista de embarcações e outros veículos recreativos; peças e acessórios",
        active: false,
      },
      {
        code: "4771701",
        nome: "Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas",
        active: false,
      },
      {
        code: "4771702",
        nome: "Comércio varejista de produtos farmacêuticos, com manipulação de fórmulas",
        active: false,
      },
      {
        code: "4771703",
        nome: "Comércio varejista de produtos farmacêuticos homeopáticos",
        active: false,
      },
      {
        code: "4771704",
        nome: "Comércio varejista de medicamentos veterinários",
        active: false,
      },
      {
        code: "4772500",
        nome: "Comércio varejista de cosméticos, produtos de perfumaria e de higiene pessoal",
        active: false,
      },
      {
        code: "4773300",
        nome: "Comércio varejista de artigos médicos e ortopédicos",
        active: false,
      },
      {
        code: "4774100",
        nome: "Comércio varejista de artigos de óptica",
        active: false,
      },
      {
        code: "4781400",
        nome: "Comércio varejista de artigos do vestuário e acessórios",
        active: false,
      },
      {
        code: "4782201",
        nome: "Comércio varejista de calçados",
        active: false,
      },
      {
        code: "4782202",
        nome: "Comércio varejista de artigos de viagem",
        active: false,
      },
      {
        code: "4783101",
        nome: "Comércio varejista de artigos de joalheria",
        active: false,
      },
      {
        code: "4783102",
        nome: "Comércio varejista de artigos de relojoaria",
        active: false,
      },
      {
        code: "4784900",
        nome: "Comércio varejista de gás liqüefeito de petróleo (GLP)",
        active: false,
      },
      {
        code: "4785701",
        nome: "Comércio varejista de antiguidades",
        active: false,
      },
      {
        code: "4785799",
        nome: "Comércio varejista de outros artigos usados",
        active: false,
      },
      {
        code: "4789001",
        nome: "Comércio varejista de suvenires, bijuterias e artesanatos",
        active: false,
      },
      {
        code: "4789002",
        nome: "Comércio varejista de plantas e flores naturais",
        active: false,
      },
      {
        code: "4789003",
        nome: "Comércio varejista de objetos de arte",
        active: false,
      },
      {
        code: "4789004",
        nome: "Comércio varejista de animais vivos e de artigos e alimentos para animais de estimação",
        active: false,
      },
      {
        code: "4789005",
        nome: "Comércio varejista de produtos saneantes domissanitários",
        active: false,
      },
      {
        code: "4789006",
        nome: "Comércio varejista de fogos de artifício e artigos pirotécnicos",
        active: false,
      },
      {
        code: "4789007",
        nome: "Comércio varejista de equipamentos para escritório",
        active: false,
      },
      {
        code: "4789008",
        nome: "Comércio varejista de artigos fotográficos e para filmagem",
        active: false,
      },
      {
        code: "4789009",
        nome: "Comércio varejista de armas e munições",
        active: false,
      },
      {
        code: "4789099",
        nome: "Comércio varejista de outros produtos não especificados anteriormente",
        active: false,
      },
      {
        code: "4911600",
        nome: "Transporte ferroviário de carga",
        active: false,
      },
      {
        code: "4912401",
        nome: "Transporte ferroviário de passageiros intermunicipal e interestadual",
        active: false,
      },
      {
        code: "4912402",
        nome: "Transporte ferroviário de passageiros municipal e em região metropolitana",
        active: false,
      },
      {
        code: "4912403",
        nome: "Transporte metroviário",
        active: false,
      },
      {
        code: "4921301",
        nome: "Transporte rodoviário coletivo de passageiros, com itinerário fixo, municipal",
        active: false,
      },
      {
        code: "4921302",
        nome: "Transporte rodoviário coletivo de passageiros, com itinerário fixo, intermunicipal em região metropolitana",
        active: false,
      },
      {
        code: "4922101",
        nome: "Transporte rodoviário coletivo de passageiros, com itinerário fixo, intermunicipal, exceto em região metropolitana",
        active: false,
      },
      {
        code: "4922102",
        nome: "Transporte rodoviário coletivo de passageiros, com itinerário fixo, interestadual",
        active: false,
      },
      {
        code: "4922103",
        nome: "Transporte rodoviário coletivo de passageiros, com itinerário fixo, internacional",
        active: false,
      },
      {
        code: "4923001",
        nome: "Serviço de táxi",
        active: false,
      },
      {
        code: "4923002",
        nome: "Serviço de transporte de passageiros - locação de automóveis com motorista",
        active: false,
      },
      {
        code: "4924800",
        nome: "Transporte escolar",
        active: false,
      },
      {
        code: "4929901",
        nome: "Transporte rodoviário coletivo de passageiros, sob regime de fretamento, municipal",
        active: false,
      },
      {
        code: "4929902",
        nome: "Transporte rodoviário coletivo de passageiros, sob regime de fretamento, intermunicipal, interestadual e internacional",
        active: false,
      },
      {
        code: "4929903",
        nome: "Organização de excursões em veículos rodoviários próprios, municipal",
        active: false,
      },
      {
        code: "4929904",
        nome: "Organização de excursões em veículos rodoviários próprios, intermunicipal, interestadual e internacional",
        active: false,
      },
      {
        code: "4929999",
        nome: "Outros transportes rodoviários de passageiros não especificados anteriormente",
        active: false,
      },
      {
        code: "4930201",
        nome: "Transporte rodoviário de carga, exceto produtos perigosos e mudanças, municipal",
        active: false,
      },
      {
        code: "4930202",
        nome: "Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal, interestadual e internacional",
        active: false,
      },
      {
        code: "4930203",
        nome: "Transporte rodoviário de produtos perigosos",
        active: false,
      },
      {
        code: "4930204",
        nome: "Transporte rodoviário de mudanças",
        active: false,
      },
      {
        code: "4940000",
        nome: "Transporte dutoviário",
        active: false,
      },
      {
        code: "4950700",
        nome: "Trens turísticos, teleféricos e similares",
        active: false,
      },
      {
        code: "5011401",
        nome: "Transporte marítimo de cabotagem - Carga",
        active: false,
      },
      {
        code: "5011402",
        nome: "Transporte marítimo de cabotagem - Passageiros",
        active: false,
      },
      {
        code: "5012201",
        nome: "Transporte marítimo de longo curso - Carga",
        active: false,
      },
      {
        code: "5012202",
        nome: "Transporte marítimo de longo curso - Passageiros",
        active: false,
      },
      {
        code: "5021101",
        nome: "Transporte por navegação interior de carga, municipal, exceto travessia",
        active: false,
      },
      {
        code: "5021102",
        nome: "Transporte por navegação interior de carga, intermunicipal, interestadual e internacional, exceto travessia",
        active: false,
      },
      {
        code: "5022001",
        nome: "Transporte por navegação interior de passageiros em linhas regulares, municipal, exceto travessia",
        active: false,
      },
      {
        code: "5022002",
        nome: "Transporte por navegação interior de passageiros em linhas regulares, intermunicipal, interestadual e internacional, exceto travessia",
        active: false,
      },
      {
        code: "5030101",
        nome: "Navegação de apoio marítimo",
        active: false,
      },
      {
        code: "5030102",
        nome: "Navegação de apoio portuário",
        active: false,
      },
      {
        code: "5030103",
        nome: "Serviço de rebocadores e empurradores",
        active: false,
      },
      {
        code: "5091201",
        nome: "Transporte por navegação de travessia, municipal",
        active: false,
      },
      {
        code: "5091202",
        nome: "Transporte por navegação de travessia, intermunicipal, interestadual e internacional",
        active: false,
      },
      {
        code: "5099801",
        nome: "Transporte aquaviário para passeios turísticos",
        active: false,
      },
      {
        code: "5099899",
        nome: "Outros transportes aquaviários não especificados anteriormente",
        active: false,
      },
      {
        code: "5111100",
        nome: "Transporte aéreo de passageiros regular",
        active: false,
      },
      {
        code: "5112901",
        nome: "Serviço de táxi aéreo e locação de aeronaves com tripulação",
        active: false,
      },
      {
        code: "5112999",
        nome: "Outros serviços de transporte aéreo de passageiros não regular",
        active: false,
      },
      {
        code: "5120000",
        nome: "Transporte aéreo de carga",
        active: false,
      },
      {
        code: "5130700",
        nome: "Transporte espacial",
        active: false,
      },
      {
        code: "5211701",
        nome: "Armazéns gerais - emissão de warrant",
        active: false,
      },
      {
        code: "5211702",
        nome: "Guarda-móveis",
        active: false,
      },
      {
        code: "5211799",
        nome: "Depósitos de mercadorias para terceiros, exceto armazéns gerais e guarda-móveis",
        active: false,
      },
      {
        code: "5212500",
        nome: "Carga e descarga",
        active: false,
      },
      {
        code: "5221400",
        nome: "Concessionárias de rodovias, pontes, túneis e serviços relacionados",
        active: false,
      },
      {
        code: "5222200",
        nome: "Terminais rodoviários e ferroviários",
        active: false,
      },
      {
        code: "5223100",
        nome: "Estacionamento de veículos",
        active: false,
      },
      {
        code: "5229001",
        nome: "Serviços de apoio ao transporte por táxi, inclusive centrais de chamada",
        active: false,
      },
      {
        code: "5229002",
        nome: "Serviços de reboque de veículos",
        active: false,
      },
      {
        code: "5229099",
        nome: "Outras atividades auxiliares dos transportes terrestres não especificadas anteriormente",
        active: false,
      },
      {
        code: "5231101",
        nome: "Administração da infraestrutura portuária",
        active: false,
      },
      {
        code: "5231102",
        nome: "Atividades do Operador Portuário",
        active: false,
      },
      {
        code: "5231103",
        nome: "Gestão de terminais aquaviários",
        active: false,
      },
      {
        code: "5232000",
        nome: "Atividades de agenciamento marítimo",
        active: false,
      },
      {
        code: "5239701",
        nome: "Serviços de praticagem",
        active: false,
      },
      {
        code: "5239799",
        nome: "Atividades auxiliares dos transportes aquaviários não especificadas anteriormente",
        active: false,
      },
      {
        code: "5240101",
        nome: "Operação dos aeroportos e campos de aterrissagem",
        active: false,
      },
      {
        code: "5240199",
        nome: "Atividades auxiliares dos transportes aéreos, exceto operação dos aeroportos e campos de aterrissagem",
        active: false,
      },
      {
        code: "5250801",
        nome: "Comissaria de despachos",
        active: false,
      },
      {
        code: "5250802",
        nome: "Atividades de despachantes aduaneiros",
        active: false,
      },
      {
        code: "5250803",
        nome: "Agenciamento de cargas, exceto para o transporte marítimo",
        active: false,
      },
      {
        code: "5250804",
        nome: "Organização logística do transporte de carga",
        active: false,
      },
      {
        code: "5250805",
        nome: "Operador de transporte multimodal - OTM",
        active: false,
      },
      {
        code: "5310501",
        nome: "Atividades do Correio Nacional",
        active: false,
      },
      {
        code: "5310502",
        nome: "Atividades de franqueadas e permissionárias do Correio Nacional",
        active: false,
      },
      {
        code: "5320201",
        nome: "Serviços de malote não realizados pelo Correio Nacional",
        active: false,
      },
      {
        code: "5320202",
        nome: "Serviços de entrega rápida",
        active: false,
      },
      {
        code: "5510801",
        nome: "Hotéis",
        active: false,
      },
      {
        code: "5510802",
        nome: "Apart-hotéis",
        active: false,
      },
      {
        code: "5510803",
        nome: "Motéis",
        active: false,
      },
      {
        code: "5590601",
        nome: "Albergues, exceto assistenciais",
        active: false,
      },
      {
        code: "5590602",
        nome: "Campings",
        active: false,
      },
      {
        code: "5590603",
        nome: "Pensões (alojamento)",
        active: false,
      },
      {
        code: "5590699",
        nome: "Outros alojamentos não especificados anteriormente",
        active: false,
      },
      {
        code: "5611201",
        nome: "Restaurantes e similares",
        active: false,
      },
      {
        code: "5611203",
        nome: "Lanchonetes, casas de chá, de sucos e similares",
        active: false,
      },
      {
        code: "5611204",
        nome: "Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento",
        active: false,
      },
      {
        code: "5611205",
        nome: "Bares e outros estabelecimentos especializados em servir bebidas, com entretenimento",
        active: false,
      },
      {
        code: "5612100",
        nome: "Serviços ambulantes de alimentação",
        active: false,
      },
      {
        code: "5620101",
        nome: "Fornecimento de alimentos preparados preponderantemente para empresas",
        active: false,
      },
      {
        code: "5620102",
        nome: "Serviços de alimentação para eventos e recepções - bufê",
        active: false,
      },
      {
        code: "5620103",
        nome: "Cantinas - serviços de alimentação privativos",
        active: false,
      },
      {
        code: "5620104",
        nome: "Fornecimento de alimentos preparados preponderantemente para consumo domiciliar",
        active: false,
      },
      {
        code: "5811500",
        nome: "Edição de livros",
        active: false,
      },
      {
        code: "5812301",
        nome: "Edição de jornais diários",
        active: false,
      },
      {
        code: "5812302",
        nome: "Edição de jornais não diários",
        active: false,
      },
      {
        code: "5813100",
        nome: "Edição de revistas",
        active: false,
      },
      {
        code: "5819100",
        nome: "Edição de cadastros, listas e outros produtos gráficos",
        active: false,
      },
      {
        code: "5821200",
        nome: "Edição integrada à impressão de livros",
        active: false,
      },
      {
        code: "5822101",
        nome: "Edição integrada à impressão de jornais diários",
        active: false,
      },
      {
        code: "5822102",
        nome: "Edição integrada à impressão de jornais não diários",
        active: false,
      },
      {
        code: "5823900",
        nome: "Edição integrada à impressão de revistas",
        active: false,
      },
      {
        code: "5829800",
        nome: "Edição integrada à impressão de cadastros, listas e outros produtos gráficos",
        active: false,
      },
      {
        code: "5911101",
        nome: "Estúdios cinematográficos",
        active: false,
      },
      {
        code: "5911102",
        nome: "Produção de filmes para publicidade",
        active: false,
      },
      {
        code: "5911199",
        nome: "Atividades de produção cinematográfica, de vídeos e de programas de televisão não especificadas anteriormente",
        active: false,
      },
      {
        code: "5912001",
        nome: "Serviços de dublagem",
        active: false,
      },
      {
        code: "5912002",
        nome: "Serviços de mixagem sonora em produção audiovisual",
        active: false,
      },
      {
        code: "5912099",
        nome: "Atividades de pós-produção cinematográfica, de vídeos e de programas de televisão não especificadas anteriormente",
        active: false,
      },
      {
        code: "5913800",
        nome: "Distribuição cinematográfica, de vídeo e de programas de televisão",
        active: false,
      },
      {
        code: "5914600",
        nome: "Atividades de exibição cinematográfica",
        active: false,
      },
      {
        code: "5920100",
        nome: "Atividades de gravação de som e de edição de música",
        active: false,
      },
      {
        code: "6010100",
        nome: "Atividades de rádio",
        active: false,
      },
      {
        code: "6021700",
        nome: "Atividades de televisão aberta",
        active: false,
      },
      {
        code: "6022501",
        nome: "Programadoras",
        active: false,
      },
      {
        code: "6022502",
        nome: "Atividades relacionadas à televisão por assinatura, exceto programadoras",
        active: false,
      },
      {
        code: "6110801",
        nome: "Serviços de telefonia fixa comutada - STFC",
        active: false,
      },
      {
        code: "6110802",
        nome: "Serviços de redes de transporte de telecomunicações - SRTT",
        active: false,
      },
      {
        code: "6110803",
        nome: "Serviços de comunicação multimídia - SCM",
        active: false,
      },
      {
        code: "6110899",
        nome: "Serviços de telecomunicações por fio não especificados anteriormente",
        active: false,
      },
      {
        code: "6120501",
        nome: "Telefonia móvel celular",
        active: false,
      },
      {
        code: "6120502",
        nome: "Serviço móvel especializado - SME",
        active: false,
      },
      {
        code: "6120599",
        nome: "Serviços de telecomunicações sem fio não especificados anteriormente",
        active: false,
      },
      {
        code: "6130200",
        nome: "Telecomunicações por satélite",
        active: false,
      },
      {
        code: "6141800",
        nome: "Operadoras de televisão por assinatura por cabo",
        active: false,
      },
      {
        code: "6142600",
        nome: "Operadoras de televisão por assinatura por micro-ondas",
        active: false,
      },
      {
        code: "6143400",
        nome: "Operadoras de televisão por assinatura por satélite",
        active: false,
      },
      {
        code: "6190601",
        nome: "Provedores de acesso às redes de comunicações",
        active: false,
      },
      {
        code: "6190602",
        nome: "Provedores de voz sobre protocolo Internet - VOIP",
        active: false,
      },
      {
        code: "6190699",
        nome: "Outras atividades de telecomunicações não especificadas anteriormente",
        active: false,
      },
      {
        code: "6201501",
        nome: "Desenvolvimento de programas de computador sob encomenda",
        active: false,
      },
      {
        code: "6201502",
        nome: "Web desing",
        active: false,
      },
      {
        code: "6202300",
        nome: "Desenvolvimento e licenciamento de programas de computador customizáveis",
        active: false,
      },
      {
        code: "6203100",
        nome: "Desenvolvimento e licenciamento de programas de computador não customizáveis",
        active: false,
      },
      {
        code: "6204000",
        nome: "Consultoria em tecnologia da informação",
        active: false,
      },
      {
        code: "6209100",
        nome: "Suporte técnico, manutenção e outros serviços em tecnologia da informação",
        active: false,
      },
      {
        code: "6311900",
        nome: "Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na Internet",
        active: false,
      },
      {
        code: "6319400",
        nome: "Portais, provedores de conteúdo e outros serviços de informação na Internet",
        active: false,
      },
      {
        code: "6391700",
        nome: "Agências de notícias",
        active: false,
      },
      {
        code: "6399200",
        nome: "Outras atividades de prestação de serviços de informação não especificadas anteriormente",
        active: false,
      },
      {
        code: "6410700",
        nome: "Banco Central",
        active: false,
      },
      {
        code: "6421200",
        nome: "Bancos comerciais",
        active: false,
      },
      {
        code: "6422100",
        nome: "Bancos múltiplos, com carteira comercial",
        active: false,
      },
      {
        code: "6423900",
        nome: "Caixas econômicas",
        active: false,
      },
      {
        code: "6424701",
        nome: "Bancos cooperativos",
        active: false,
      },
      {
        code: "6424702",
        nome: "Cooperativas centrais de crédito",
        active: false,
      },
      {
        code: "6424703",
        nome: "Cooperativas de crédito mútuo",
        active: false,
      },
      {
        code: "6424704",
        nome: "Cooperativas de crédito rural",
        active: false,
      },
      {
        code: "6431000",
        nome: "Bancos múltiplos, sem carteira comercial",
        active: false,
      },
      {
        code: "6432800",
        nome: "Bancos de investimento",
        active: false,
      },
      {
        code: "6433600",
        nome: "Bancos de desenvolvimento",
        active: false,
      },
      {
        code: "6434400",
        nome: "Agências de fomento",
        active: false,
      },
      {
        code: "6435201",
        nome: "Sociedades de crédito imobiliário",
        active: false,
      },
      {
        code: "6435202",
        nome: "Associações de poupança e empréstimo",
        active: false,
      },
      {
        code: "6435203",
        nome: "Companhias hipotecárias",
        active: false,
      },
      {
        code: "6436100",
        nome: "Sociedades de crédito, financiamento e investimento - financeiras",
        active: false,
      },
      {
        code: "6437900",
        nome: "Sociedades de crédito ao microempreendedor",
        active: false,
      },
      {
        code: "6438701",
        nome: "Bancos de câmbio",
        active: false,
      },
      {
        code: "6438799",
        nome: "Outras instituições de intermediação não monetária não especificadas anteriormente",
        active: false,
      },
      {
        code: "6440900",
        nome: "Arrendamento mercantil",
        active: false,
      },
      {
        code: "6450600",
        nome: "Sociedades de capitalização",
        active: false,
      },
      {
        code: "6461100",
        nome: "Holdings de instituições financeiras",
        active: false,
      },
      {
        code: "6462000",
        nome: "Holdings de instituições não financeiras",
        active: false,
      },
      {
        code: "6463800",
        nome: "Outras sociedades de participação, exceto holdings",
        active: false,
      },
      {
        code: "6470101",
        nome: "Fundos de investimento, exceto previdenciários e imobiliários",
        active: false,
      },
      {
        code: "6470102",
        nome: "Fundos de investimento previdenciários",
        active: false,
      },
      {
        code: "6470103",
        nome: "Fundos de investimento imobiliários",
        active: false,
      },
      {
        code: "6491300",
        nome: "Sociedades de fomento mercantil - factoring",
        active: false,
      },
      {
        code: "6492100",
        nome: "Securitização de créditos",
        active: false,
      },
      {
        code: "6493000",
        nome: "Administração de consórcios para aquisição de bens e direitos",
        active: false,
      },
      {
        code: "6499901",
        nome: "Clubes de investimento",
        active: false,
      },
      {
        code: "6499902",
        nome: "Sociedades de investimento",
        active: false,
      },
      {
        code: "6499903",
        nome: "Fundo garantidor de crédito",
        active: false,
      },
      {
        code: "6499904",
        nome: "Caixas de financiamento de corporações",
        active: false,
      },
      {
        code: "6499905",
        nome: "Concessão de crédito pelas OSCIP",
        active: false,
      },
      {
        code: "6499999",
        nome: "Outras atividades de serviços financeiros não especificadas anteriormente",
        active: false,
      },
      {
        code: "6511101",
        nome: "Sociedade seguradora de seguros vida",
        active: false,
      },
      {
        code: "6511102",
        nome: "Planos de auxílio-funeral",
        active: false,
      },
      {
        code: "6512000",
        nome: "Sociedade seguradora de seguros não vida",
        active: false,
      },
      {
        code: "6520100",
        nome: "Sociedade seguradora de seguros-saúde",
        active: false,
      },
      {
        code: "6530800",
        nome: "Resseguros",
        active: false,
      },
      {
        code: "6541300",
        nome: "Previdência complementar fechada",
        active: false,
      },
      {
        code: "6542100",
        nome: "Previdência complementar aberta",
        active: false,
      },
      {
        code: "6550200",
        nome: "Planos de saúde",
        active: false,
      },
      {
        code: "6611801",
        nome: "Bolsa de valores",
        active: false,
      },
      {
        code: "6611802",
        nome: "Bolsa de mercadorias",
        active: false,
      },
      {
        code: "6611803",
        nome: "Bolsa de mercadorias e futuros",
        active: false,
      },
      {
        code: "6611804",
        nome: "Administração de mercados de balcão organizados",
        active: false,
      },
      {
        code: "6612601",
        nome: "Corretoras de títulos e valores mobiliários",
        active: false,
      },
      {
        code: "6612602",
        nome: "Distribuidoras de títulos e valores mobiliários",
        active: false,
      },
      {
        code: "6612603",
        nome: "Corretoras de câmbio",
        active: false,
      },
      {
        code: "6612604",
        nome: "Corretoras de contratos de mercadorias",
        active: false,
      },
      {
        code: "6612605",
        nome: "Agentes de investimentos em aplicações financeiras",
        active: false,
      },
      {
        code: "6613400",
        nome: "Administração de cartões de crédito",
        active: false,
      },
      {
        code: "6619301",
        nome: "Serviços de liquidação e custódia",
        active: false,
      },
      {
        code: "6619302",
        nome: "Correspondentes de instituições financeiras",
        active: false,
      },
      {
        code: "6619303",
        nome: "Representações de bancos estrangeiros",
        active: false,
      },
      {
        code: "6619304",
        nome: "Caixas eletrônicos",
        active: false,
      },
      {
        code: "6619305",
        nome: "Operadoras de cartões de débito",
        active: false,
      },
      {
        code: "6619399",
        nome: "Outras atividades auxiliares dos serviços financeiros não especificadas anteriormente",
        active: false,
      },
      {
        code: "6621501",
        nome: "Peritos e avaliadores de seguros",
        active: false,
      },
      {
        code: "6621502",
        nome: "Auditoria e consultoria atuarial",
        active: false,
      },
      {
        code: "6622300",
        nome: "Corretores e agentes de seguros, de planos de previdência complementar e de saúde",
        active: false,
      },
      {
        code: "6629100",
        nome: "Atividades auxiliares dos seguros, da previdência complementar e dos planos de saúde não especificadas anteriormente",
        active: false,
      },
      {
        code: "6630400",
        nome: "Atividades de administração de fundos por contrato ou comissão",
        active: false,
      },
      {
        code: "6810201",
        nome: "Compra e venda de imóveis próprios",
        active: false,
      },
      {
        code: "6810202",
        nome: "Aluguel de imóveis próprios",
        active: false,
      },
      {
        code: "6810203",
        nome: "Loteamento de imóveis próprios",
        active: false,
      },
      {
        code: "6821801",
        nome: "Corretagem na compra e venda e avaliação de imóveis",
        active: false,
      },
      {
        code: "6821802",
        nome: "Corretagem no aluguel de imóveis",
        active: false,
      },
      {
        code: "6822600",
        nome: "Gestão e administração da propriedade imobiliária",
        active: false,
      },
      {
        code: "6911701",
        nome: "Serviços advocatícios",
        active: false,
      },
      {
        code: "6911702",
        nome: "Atividades auxiliares da justiça",
        active: false,
      },
      {
        code: "6911703",
        nome: "Agente de propriedade industrial",
        active: false,
      },
      {
        code: "6912500",
        nome: "Cartórios",
        active: false,
      },
      {
        code: "6920601",
        nome: "Atividades de contabilidade",
        active: false,
      },
      {
        code: "6920602",
        nome: "Atividades de consultoria e auditoria contábil e tributária",
        active: false,
      },
      {
        code: "7020400",
        nome: "Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica",
        active: false,
      },
      {
        code: "7111100",
        nome: "Serviços de arquitetura",
        active: false,
      },
      {
        code: "7112000",
        nome: "Serviços de engenharia",
        active: false,
      },
      {
        code: "7119701",
        nome: "Serviços de cartografia, topografia e geodésia",
        active: false,
      },
      {
        code: "7119702",
        nome: "Atividades de estudos geológicos",
        active: false,
      },
      {
        code: "7119703",
        nome: "Serviços de desenho técnico relacionados à arquitetura e engenharia",
        active: false,
      },
      {
        code: "7119704",
        nome: "Serviços de perícia técnica relacionados à segurança do trabalho",
        active: false,
      },
      {
        code: "7119799",
        nome: "Atividades técnicas relacionadas à engenharia e arquitetura não especificadas anteriormente",
        active: false,
      },
      {
        code: "7120100",
        nome: "Testes e análises técnicas",
        active: false,
      },
      {
        code: "7210000",
        nome: "Pesquisa e desenvolvimento experimental em ciências físicas e naturais",
        active: false,
      },
      {
        code: "7220700",
        nome: "Pesquisa e desenvolvimento experimental em ciências sociais e humanas",
        active: false,
      },
      {
        code: "7311400",
        nome: "Agências de publicidade",
        active: false,
      },
      {
        code: "7312200",
        nome: "Agenciamento de espaços para publicidade, exceto em veículos de comunicação",
        active: false,
      },
      {
        code: "7319001",
        nome: "Criação de estandes para feiras e exposições",
        active: false,
      },
      {
        code: "7319002",
        nome: "Promoção de vendas",
        active: false,
      },
      {
        code: "7319003",
        nome: "Marketing direto",
        active: false,
      },
      {
        code: "7319004",
        nome: "Consultoria em publicidade",
        active: false,
      },
      {
        code: "7319099",
        nome: "Outras atividades de publicidade não especificadas anteriormente",
        active: false,
      },
      {
        code: "7320300",
        nome: "Pesquisas de mercado e de opinião pública",
        active: false,
      },
      {
        code: "7410202",
        nome: "Design de interiores",
        active: false,
      },
      {
        code: "7410203",
        nome: "Desing de produto",
        active: false,
      },
      {
        code: "7410299",
        nome: "Atividades de desing não especificadas anteriormente",
        active: false,
      },
      {
        code: "7420001",
        nome: "Atividades de produção de fotografias, exceto aérea e submarina",
        active: false,
      },
      {
        code: "7420002",
        nome: "Atividades de produção de fotografias aéreas e submarinas",
        active: false,
      },
      {
        code: "7420003",
        nome: "Laboratórios fotográficos",
        active: false,
      },
      {
        code: "7420004",
        nome: "Filmagem de festas e eventos",
        active: false,
      },
      {
        code: "7420005",
        nome: "Serviços de microfilmagem",
        active: false,
      },
      {
        code: "7490101",
        nome: "Serviços de tradução, interpretação e similares",
        active: false,
      },
      {
        code: "7490102",
        nome: "Escafandria e mergulho",
        active: false,
      },
      {
        code: "7490103",
        nome: "Serviços de agronomia e de consultoria às atividades agrícolas e pecuárias",
        active: false,
      },
      {
        code: "7490104",
        nome: "Atividades de intermediação e agenciamento de serviços e negócios em geral, exceto imobiliários",
        active: false,
      },
      {
        code: "7490105",
        nome: "Agenciamento de profissionais para atividades esportivas, culturais e artísticas",
        active: false,
      },
      {
        code: "7490199",
        nome: "Outras atividades profissionais, científicas e técnicas não especificadas anteriormente",
        active: false,
      },
      {
        code: "7500100",
        nome: "Atividades veterinárias",
        active: false,
      },
      {
        code: "7711000",
        nome: "Locação de automóveis sem condutor",
        active: false,
      },
      {
        code: "7719501",
        nome: "Locação de embarcações sem tripulação, exceto para fins\r\nrecreativos",
        active: false,
      },
      {
        code: "7719502",
        nome: "Locação de aeronaves sem tripulação",
        active: false,
      },
      {
        code: "7719599",
        nome: "Locação de outros meios de transporte não especificados anteriormente, sem condutor",
        active: false,
      },
      {
        code: "7721700",
        nome: "Aluguel de equipamentos recreativos e esportivos",
        active: false,
      },
      {
        code: "7722500",
        nome: "Aluguel de fitas de vídeo, DVDs e similares",
        active: false,
      },
      {
        code: "7723300",
        nome: "Aluguel de objetos do vestuário, jóias e acessórios",
        active: false,
      },
      {
        code: "7729201",
        nome: "Aluguel de aparelhos de jogos eletrônicos",
        active: false,
      },
      {
        code: "7729202",
        nome: "Aluguel de móveis, utensílios e aparelhos de uso doméstico e pessoal; instrumentos musicais",
        active: false,
      },
      {
        code: "7729203",
        nome: "Aluguel de material médico",
        active: false,
      },
      {
        code: "7729299",
        nome: "Aluguel de outros objetos pessoais e domésticos não especificados anteriormente",
        active: false,
      },
      {
        code: "7731400",
        nome: "Aluguel de máquinas e equipamentos agrícolas sem operador",
        active: false,
      },
      {
        code: "7732201",
        nome: "Aluguel de máquinas e equipamentos para construção sem operador, exceto andaimes",
        active: false,
      },
      {
        code: "7732202",
        nome: "Aluguel de andaimes",
        active: false,
      },
      {
        code: "7733100",
        nome: "Aluguel de máquinas e equipamentos para escritório",
        active: false,
      },
      {
        code: "7739001",
        nome: "Aluguel de máquinas e equipamentos para extração de minérios e petróleo, sem operador",
        active: false,
      },
      {
        code: "7739002",
        nome: "Aluguel de equipamentos científicos, médicos e hospitalares, sem operador",
        active: false,
      },
      {
        code: "7739003",
        nome: "Aluguel de palcos, coberturas e outras estruturas de uso temporário, exceto andaimes",
        active: false,
      },
      {
        code: "7739099",
        nome: "Aluguel de outras máquinas e equipamentos comerciais e industriais não especificados anteriormente, sem operador",
        active: false,
      },
      {
        code: "7740300",
        nome: "Gestão de ativos intangíveis não financeiros",
        active: false,
      },
      {
        code: "7810800",
        nome: "Seleção e agenciamento de mão de obra",
        active: false,
      },
      {
        code: "7820500",
        nome: "Locação de mão de obra temporária",
        active: false,
      },
      {
        code: "7830200",
        nome: "Fornecimento e gestão de recursos humanos para terceiros",
        active: false,
      },
      {
        code: "7911200",
        nome: "Agências de viagens",
        active: false,
      },
      {
        code: "7912100",
        nome: "Operadores turísticos",
        active: false,
      },
      {
        code: "7990200",
        nome: "Serviços de reservas e outros serviços de turismo não especificados anteriormente",
        active: false,
      },
      {
        code: "8011101",
        nome: "Atividades de vigilância e segurança privada",
        active: false,
      },
      {
        code: "8011102",
        nome: "Serviços de adestramento de cães de guarda",
        active: false,
      },
      {
        code: "8012900",
        nome: "Atividades de transporte de valores",
        active: false,
      },
      {
        code: "8020001",
        nome: "Atividades de monitoramento de sistemas de segurança eletrônico",
        active: false,
      },
      {
        code: "8020002",
        nome: "Outras atividades de serviços de segurança",
        active: false,
      },
      {
        code: "8030700",
        nome: "Atividades de investigação particular",
        active: false,
      },
      {
        code: "8111700",
        nome: "Serviços combinados para apoio a edifícios, exceto condomínios prediais",
        active: false,
      },
      {
        code: "8112500",
        nome: "Condomínios prediais",
        active: false,
      },
      {
        code: "8121400",
        nome: "Limpeza em prédios e em domicílios",
        active: false,
      },
      {
        code: "8122200",
        nome: "Imunização e controle de pragas urbanas",
        active: false,
      },
      {
        code: "8129000",
        nome: "Atividades de limpeza não especificadas anteriormente",
        active: false,
      },
      {
        code: "8130300",
        nome: "Atividades paisagísticas",
        active: false,
      },
      {
        code: "8211300",
        nome: "Serviços combinados de escritório e apoio administrativo",
        active: false,
      },
      {
        code: "8219901",
        nome: "Fotocópias",
        active: false,
      },
      {
        code: "8219999",
        nome: "Preparação de documentos e serviços especializados de apoio administrativo não especificados anteriormente",
        active: false,
      },
      {
        code: "8220200",
        nome: "Atividades de teleatendimento",
        active: false,
      },
      {
        code: "8230001",
        nome: "Serviços de organização de feiras, congressos, exposições e festas",
        active: false,
      },
      {
        code: "8230002",
        nome: "Casas de festas e eventos",
        active: false,
      },
      {
        code: "8291100",
        nome: "Atividades de cobrança e informações cadastrais",
        active: false,
      },
      {
        code: "8292000",
        nome: "Envasamento e empacotamento sob contrato",
        active: false,
      },
      {
        code: "8299701",
        nome: "Medição de consumo de energia elétrica, gás e água",
        active: false,
      },
      {
        code: "8299702",
        nome: "Emissão de vales-alimentação, vales-transporte e similares",
        active: false,
      },
      {
        code: "8299703",
        nome: "Serviços de gravação de carimbos, exceto confecção",
        active: false,
      },
      {
        code: "8299704",
        nome: "Leiloeiros independentes",
        active: false,
      },
      {
        code: "8299705",
        nome: "Serviços de levantamento de fundos sob contrato",
        active: false,
      },
      {
        code: "8299706",
        nome: "Casas lotéricas",
        active: false,
      },
      {
        code: "8299707",
        nome: "Salas de acesso à Internet",
        active: false,
      },
      {
        code: "8299799",
        nome: "Outras atividades de serviços prestados principalmente às empresas não especificadas anteriormente",
        active: false,
      },
      {
        code: "8411600",
        nome: "Administração pública em geral",
        active: false,
      },
      {
        code: "8412400",
        nome: "Regulação das atividades de saúde, educação, serviços culturais e outros serviços sociais",
        active: false,
      },
      {
        code: "8413200",
        nome: "Regulação das atividades econômicas",
        active: false,
      },
      {
        code: "8421300",
        nome: "Relações exteriores",
        active: false,
      },
      {
        code: "8422100",
        nome: "Defesa",
        active: false,
      },
      {
        code: "8423000",
        nome: "Justiça",
        active: false,
      },
      {
        code: "8424800",
        nome: "Segurança e ordem pública",
        active: false,
      },
      {
        code: "8425600",
        nome: "Defesa Civil",
        active: false,
      },
      {
        code: "8430200",
        nome: "Seguridade social obrigatória",
        active: false,
      },
      {
        code: "8511200",
        nome: "Educação infantil - creche",
        active: false,
      },
      {
        code: "8512100",
        nome: "Educação infantil - pré-escola",
        active: false,
      },
      {
        code: "8513900",
        nome: "Ensino fundamental",
        active: false,
      },
      {
        code: "8520100",
        nome: "Ensino médio",
        active: false,
      },
      {
        code: "8531700",
        nome: "Educação superior - graduação",
        active: false,
      },
      {
        code: "8532500",
        nome: "Educação superior - graduação e pós-graduação",
        active: false,
      },
      {
        code: "8533300",
        nome: "Educação superior - pós-graduação e extensão",
        active: false,
      },
      {
        code: "8541400",
        nome: "Educação profissional de nível técnico",
        active: false,
      },
      {
        code: "8542200",
        nome: "Educação profissional de nível tecnológico",
        active: false,
      },
      {
        code: "8550301",
        nome: "Administração de caixas escolares",
        active: false,
      },
      {
        code: "8550302",
        nome: "Atividades de apoio à educação, exceto caixas escolares",
        active: false,
      },
      {
        code: "8591100",
        nome: "Ensino de esportes",
        active: false,
      },
      {
        code: "8592901",
        nome: "Ensino de dança",
        active: false,
      },
      {
        code: "8592902",
        nome: "Ensino de artes cênicas, exceto dança",
        active: false,
      },
      {
        code: "8592903",
        nome: "Ensino de música",
        active: false,
      },
      {
        code: "8592999",
        nome: "Ensino de arte e cultura não especificado anteriormente",
        active: false,
      },
      {
        code: "8593700",
        nome: "Ensino de idiomas",
        active: false,
      },
      {
        code: "8599601",
        nome: "Formação de condutores",
        active: false,
      },
      {
        code: "8599602",
        nome: "Cursos de pilotagem",
        active: false,
      },
      {
        code: "8599603",
        nome: "Treinamento em informática",
        active: false,
      },
      {
        code: "8599604",
        nome: "Treinamento em desenvolvimento profissional e gerencial",
        active: false,
      },
      {
        code: "8599605",
        nome: "Cursos preparatórios para concursos",
        active: false,
      },
      {
        code: "8599699",
        nome: "Outras atividades de ensino não especificadas anteriormente",
        active: false,
      },
      {
        code: "8610101",
        nome: "Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências",
        active: false,
      },
      {
        code: "8610102",
        nome: "Atividades de atendimento em pronto-socorro e unidades hospitalares para atendimento a urgências",
        active: false,
      },
      {
        code: "8621601",
        nome: "UTI móvel",
        active: false,
      },
      {
        code: "8621602",
        nome: "Serviços móveis de atendimento a urgências, exceto por UTI móvel",
        active: false,
      },
      {
        code: "8622400",
        nome: "Serviços de remoção de pacientes, exceto os serviços móveis de atendimento a urgências",
        active: false,
      },
      {
        code: "8630501",
        nome: "Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos",
        active: false,
      },
      {
        code: "8630502",
        nome: "Atividade médica ambulatorial com recursos para realização de exames complementares",
        active: false,
      },
      {
        code: "8630503",
        nome: "Atividade médica ambulatorial restrita a consultas",
        active: false,
      },
      {
        code: "8630504",
        nome: "Atividade odontológica",
        active: false,
      },
      {
        code: "8630506",
        nome: "Serviços de vacinação e imunização humana",
        active: false,
      },
      {
        code: "8630507",
        nome: "Atividades de reprodução humana assistida",
        active: false,
      },
      {
        code: "8630599",
        nome: "Atividades de atenção ambulatorial não especificadas anteriormente",
        active: false,
      },
      {
        code: "8640201",
        nome: "Laboratórios de anatomia patológica e citológica",
        active: false,
      },
      {
        code: "8640202",
        nome: "Laboratórios clínicos",
        active: false,
      },
      {
        code: "8640203",
        nome: "Serviços de diálise e nefrologia",
        active: false,
      },
      {
        code: "8640204",
        nome: "Serviços de tomografia",
        active: false,
      },
      {
        code: "8640205",
        nome: "Serviços de diagnóstico por imagem com uso de radiação ionizante, exceto tomografia",
        active: false,
      },
      {
        code: "8640206",
        nome: "Serviços de ressonância magnética",
        active: false,
      },
      {
        code: "8640207",
        nome: "Serviços de diagnóstico por imagem sem uso de radiação ionizante, exceto ressonância magnética",
        active: false,
      },
      {
        code: "8640208",
        nome: "Serviços de diagnóstico por registro gráfico - ECG, EEG e outros exames análogos",
        active: false,
      },
      {
        code: "8640209",
        nome: "Serviços de diagnóstico por métodos ópticos - endoscopia e outros exames análogos",
        active: false,
      },
      {
        code: "8640210",
        nome: "Serviços de quimioterapia",
        active: false,
      },
      {
        code: "8640211",
        nome: "Serviços de radioterapia",
        active: false,
      },
      {
        code: "8640212",
        nome: "Serviços de hemoterapia",
        active: false,
      },
      {
        code: "8640213",
        nome: "Serviços de litotripsia",
        active: false,
      },
      {
        code: "8640214",
        nome: "Serviços de bancos de células e tecidos humanos",
        active: false,
      },
      {
        code: "8640299",
        nome: "Atividades de serviços de complementação diagnóstica e terapêutica não especificadas anteriormente",
        active: false,
      },
      {
        code: "8650001",
        nome: "Atividades de enfermagem",
        active: false,
      },
      {
        code: "8650002",
        nome: "Atividades de profissionais da nutrição",
        active: false,
      },
      {
        code: "8650003",
        nome: "Atividades de psicologia e psicanálise",
        active: false,
      },
      {
        code: "8650004",
        nome: "Atividades de fisioterapia",
        active: false,
      },
      {
        code: "8650005",
        nome: "Atividades de terapia ocupacional",
        active: false,
      },
      {
        code: "8650006",
        nome: "Atividades de fonoaudiologia",
        active: false,
      },
      {
        code: "8650007",
        nome: "Atividades de terapia de nutrição enteral e parenteral",
        active: false,
      },
      {
        code: "8650099",
        nome: "Atividades de profissionais da área de saúde não especificadas anteriormente",
        active: false,
      },
      {
        code: "8660700",
        nome: "Atividades de apoio à gestão de saúde",
        active: false,
      },
      {
        code: "8690901",
        nome: "Atividades de práticas integrativas e complementares em saúde humana",
        active: false,
      },
      {
        code: "8690902",
        nome: "Atividades de bancos de leite humano",
        active: false,
      },
      {
        code: "8690903",
        nome: "Atividades de acupuntura",
        active: false,
      },
      {
        code: "8690904",
        nome: "Atividades de podologia",
        active: false,
      },
      {
        code: "8690999",
        nome: "Outras atividades de atenção à saúde humana não especificadas anteriormente",
        active: false,
      },
      {
        code: "8711501",
        nome: "Clínicas e residências geriátricas",
        active: false,
      },
      {
        code: "8711502",
        nome: "Instituições de longa permanência para idosos",
        active: false,
      },
      {
        code: "8711503",
        nome: "Atividades de assistência a deficientes físicos, imunodeprimidos e convalescentes",
        active: false,
      },
      {
        code: "8711504",
        nome: "Centros de apoio a pacientes com câncer e com AIDS",
        active: false,
      },
      {
        code: "8711505",
        nome: "Condomínios residenciais para idosos",
        active: false,
      },
      {
        code: "8712300",
        nome: "Atividades de fornecimento de infraestrutura de apoio e assistência a paciente no domicílio",
        active: false,
      },
      {
        code: "8720401",
        nome: "Atividades de centros de assistência psicossocial",
        active: false,
      },
      {
        code: "8720499",
        nome: "Atividades de assistência psicossocial e à saúde a portadores de distúrbios psíquicos, deficiência mental e dependência química e grupos similares não especificadas anteriormente",
        active: false,
      },
      {
        code: "8730101",
        nome: "Orfanatos",
        active: false,
      },
      {
        code: "8730102",
        nome: "Albergues assistenciais",
        active: false,
      },
      {
        code: "8730199",
        nome: "Atividades de assistência social prestadas em residências coletivas e particulares não especificadas anteriormente",
        active: false,
      },
      {
        code: "8800600",
        nome: "Serviços de assistência social sem alojamento",
        active: false,
      },
      {
        code: "9001901",
        nome: "Produção teatral",
        active: false,
      },
      {
        code: "9001902",
        nome: "Produção musical",
        active: false,
      },
      {
        code: "9001903",
        nome: "Produção de espetáculos de dança",
        active: false,
      },
      {
        code: "9001904",
        nome: "Produção de espetáculos circenses, de marionetes e similares",
        active: false,
      },
      {
        code: "9001905",
        nome: "Produção de espetáculos de rodeios, vaquejadas e similares",
        active: false,
      },
      {
        code: "9001906",
        nome: "Atividades de sonorização e de iluminação",
        active: false,
      },
      {
        code: "9001999",
        nome: "Artes cênicas, espetáculos e atividades complementares não especificados anteriormente",
        active: false,
      },
      {
        code: "9002701",
        nome: "Atividades de artistas plásticos, jornalistas independentes e\r\nescritores",
        active: false,
      },
      {
        code: "9002702",
        nome: "Restauração de obras de arte",
        active: false,
      },
      {
        code: "9003500",
        nome: "Gestão de espaços para artes cênicas, espetáculos e outras atividades artísticas",
        active: false,
      },
      {
        code: "9101500",
        nome: "Atividades de bibliotecas e arquivos",
        active: false,
      },
      {
        code: "9102301",
        nome: "Atividades de museus e de exploração de lugares e prédios históricos e atrações similares",
        active: false,
      },
      {
        code: "9102302",
        nome: "Restauração e conservação de lugares e prédios históricos",
        active: false,
      },
      {
        code: "9103100",
        nome: "Atividades de jardins botânicos, zoológicos, parques nacionais, reservas ecológicas e áreas de proteção ambiental",
        active: false,
      },
      {
        code: "9200301",
        nome: "Casas de bingo",
        active: false,
      },
      {
        code: "9200302",
        nome: "Exploração de apostas em corridas de cavalos",
        active: false,
      },
      {
        code: "9200399",
        nome: "Exploração de jogos de azar e apostas não especificados anteriormente",
        active: false,
      },
      {
        code: "9311500",
        nome: "Gestão de instalações de esportes",
        active: false,
      },
      {
        code: "9312300",
        nome: "Clubes sociais, esportivos e similares",
        active: false,
      },
      {
        code: "9313100",
        nome: "Atividades de condicionamento físico",
        active: false,
      },
      {
        code: "9319101",
        nome: "Produção e promoção de eventos esportivos",
        active: false,
      },
      {
        code: "9319199",
        nome: "Outras atividades esportivas não especificadas anteriormente",
        active: false,
      },
      {
        code: "9321200",
        nome: "Parques de diversão e parques temáticos",
        active: false,
      },
      {
        code: "9329801",
        nome: "Discotecas, danceterias, salões de dança e similares",
        active: false,
      },
      {
        code: "9329802",
        nome: "Exploração de boliches",
        active: false,
      },
      {
        code: "9329803",
        nome: "Exploração de jogos de sinuca, bilhar e similares",
        active: false,
      },
      {
        code: "9329804",
        nome: "Exploração de jogos eletrônicos recreativos",
        active: false,
      },
      {
        code: "9329899",
        nome: "Outras atividades de recreação e lazer não especificadas anteriormente",
        active: false,
      },
      {
        code: "9411100",
        nome: "Atividades de organizações associativas patronais e empresariais",
        active: false,
      },
      {
        code: "9412001",
        nome: "Atividades de fiscalização profissional",
        active: false,
      },
      {
        code: "9412099",
        nome: "Outras atividades associativas profissionais",
        active: false,
      },
      {
        code: "9420100",
        nome: "Atividades de organizações sindicais",
        active: false,
      },
      {
        code: "9430800",
        nome: "Atividades de associações de defesa de direitos sociais",
        active: false,
      },
      {
        code: "9491000",
        nome: "Atividades de organizações religiosas ou filosóficas",
        active: false,
      },
      {
        code: "9492800",
        nome: "Atividades de organizações políticas",
        active: false,
      },
      {
        code: "9493600",
        nome: "Atividades de organizações associativas ligadas à cultura e à arte",
        active: false,
      },
      {
        code: "9499500",
        nome: "Atividades associativas não especificadas anteriormente",
        active: false,
      },
      {
        code: "9511800",
        nome: "Reparação e manutenção de computadores e de equipamentos periféricos",
        active: false,
      },
      {
        code: "9512600",
        nome: "Reparação e manutenção de equipamentos de comunicação",
        active: false,
      },
      {
        code: "9521500",
        nome: "Reparação e manutenção de equipamentos eletroeletrônicos de uso pessoal e doméstico",
        active: false,
      },
      {
        code: "9529101",
        nome: "Reparação de calçados, bolsas e artigos de viagem",
        active: false,
      },
      {
        code: "9529102",
        nome: "Chaveiros",
        active: false,
      },
      {
        code: "9529103",
        nome: "Reparação de relógios",
        active: false,
      },
      {
        code: "9529104",
        nome: "Reparação de bicicletas, triciclos e outros veículos não motorizados",
        active: false,
      },
      {
        code: "9529105",
        nome: "Reparação de artigos do mobiliário",
        active: false,
      },
      {
        code: "9529106",
        nome: "Reparação de jóias",
        active: false,
      },
      {
        code: "9529199",
        nome: "Reparação e manutenção de outros objetos e equipamentos pessoais e domésticos não especificados anteriormente",
        active: false,
      },
      {
        code: "9601701",
        nome: "Lavanderias",
        active: false,
      },
      {
        code: "9601702",
        nome: "Tinturarias",
        active: false,
      },
      {
        code: "9601703",
        nome: "Toalheiros",
        active: false,
      },
      {
        code: "9602501",
        nome: "Cabeleireiros, manicure e pedicure",
        active: false,
      },
      {
        code: "9602502",
        nome: "Atividades de estética e outros serviços de cuidados com a beleza",
        active: false,
      },
      {
        code: "9603301",
        nome: "Gestão e manutenção de cemitérios",
        active: false,
      },
      {
        code: "9603302",
        nome: "Serviços de cremação",
        active: false,
      },
      {
        code: "9603303",
        nome: "Serviços de sepultamento",
        active: false,
      },
      {
        code: "9603304",
        nome: "Serviços de funerárias",
        active: false,
      },
      {
        code: "9603305",
        nome: "Serviços de somatoconservação",
        active: false,
      },
      {
        code: "9603399",
        nome: "Atividades funerárias e serviços relacionados não especificados anteriormente",
        active: false,
      },
      {
        code: "9609202",
        nome: "Agências matrimoniais",
        active: false,
      },
      {
        code: "9609204",
        nome: "Exploração de máquinas de serviços pessoais acionadas por moeda",
        active: false,
      },
      {
        code: "9609205",
        nome: "Atividades de sauna e banhos",
        active: false,
      },
      {
        code: "9609206",
        nome: "Serviços de tatuagem e colocação de piercing",
        active: false,
      },
      {
        code: "9609207",
        nome: "Alojamento de animais domésticos",
        active: false,
      },
      {
        code: "9609208",
        nome: "Higiene e embelezamento de animais domésticos",
        active: false,
      },
      {
        code: "9609299",
        nome: "Outras atividades de serviços pessoais não especificadas anteriormente",
        active: false,
      },
      {
        code: "9700500",
        nome: "Serviços domésticos",
        active: false,
      },
    ],
  })
  console.log("✅ CNAEs criadas com sucesso!")

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
