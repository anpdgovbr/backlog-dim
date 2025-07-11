import { PrismaClient } from "@prisma/client"
import { skip } from "node:test"

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
      { nome: "Fernanda Pereira" },
      { nome: "Jean Frederick" },
      { nome: "Kelly Resqueti Paz" },
      { nome: "Tatiana Silva" },
      { nome: "Vanessa Mendes" },
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
      { nome: "Não se aplica" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Tipos de Reclamação...")
  await prisma.tipoReclamacao.createMany({
    data: [
      { nome: "Acesso indevido a dados pessoais" },
      { nome: "Ausência de medidas de segurança adequadas" },
      { nome: "Ausência de política de privacidade/cookies" },
      { nome: "Coleta excessiva de dados pessoais e/ou sensíveis" },
      { nome: "Compartilhamento indevido de dados pessoais e/ou sensíveis" },
      { nome: "Contato não solicitado" },
      { nome: "Dificuldade de acesso a dados pessoais" },
      {
        nome: "Dificuldade de exercer direito de informação sobre uso compartilhado de dados",
      },
      {
        nome: "Dificuldade em exercer direito de acesso às informações sobre o tratamento de dados pessoais",
      },
      {
        nome: "Dificuldade em exercer direito de confirmação da existência de tratamento de dados",
      },
      { nome: "Dificuldade em exercer direito de correção de dados pessoais" },
      {
        nome: "Dificuldade em exercer direito de eliminação de dados (inclusive tratados com consentimento)",
      },
      { nome: "Dificuldade em exercer direito de portabilidade" },
      { nome: "Dificuldade em exercer direito de revisão de decisão automatizada" },
      { nome: "Dificuldade em exercer direito de revogação do consentimento" },
      { nome: "Dificuldade em exercer direitos" },
      {
        nome: "Dificuldade em obter informações sobre cláusulas-padrão contratuais em transferência internacional de dados pessoais",
      },
      { nome: "Exposição de dados pessoais e/ou sensíveis" },
      { nome: "Fraude" },
      { nome: "Não adequação à LGPD" },
      { nome: "Não identificada" },
      { nome: "Não LGPD" },
      { nome: "Tratamento de dados pessoais sem hipótese legal" },
      { nome: "Tratamento discriminatório/Uso de dados para fins discriminatórios" },
      { nome: "Vazamento de Dados/Incidente de Segurança" },
      { nome: "Venda de dados pessoais" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Encaminhamentos...")
  await prisma.encaminhamento.createMany({
    data: [
      { nome: "Aguardando análise" },
      { nome: "Cancelado pelo titular/denunciante" },
      { nome: "Cancelado por ausência de correção" },
      { nome: "Cancelado por duplicidade" },
      { nome: "Encaminhado para FIS" },
      { nome: "Encaminhado para TIS" },
      { nome: "Requerimento individualizado" },
      { nome: "Não admissível" },
    ],
    skipDuplicates: true,
  })

  console.log("🔹 Criando Situações do Processamento...")
  await prisma.situacao.createMany({
    data: [
      { nome: "Em trâmite - aguardando análise" },
      { nome: "Em trâmite - aguardando FIS/TIS" },
      { nome: "Em trâmite - pedido de manifestação enviado" },
      { nome: "Em trâmite - solicitação de correção para o requerente" },
      { nome: "Em trâmite - solicitação de informações do encarregado" },
      {
        nome: "Encaminhado para consideração no planejamento de fiscalização/ações educativas",
      },
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

  console.log("🔹 Criando ProcessoStatus...")
  await prisma.processoStatus.createMany({
    data: [
      {
        nome: "Solicitação",
      },
      { nome: "Aguardando preenchimento do despacho" },
      { nome: "Arquivamento" },
      { nome: "Aguardando correção do solicitante" },
      { nome: "Concluído" },
      { nome: "Aguardando manifestação do controlador" },
    ],
    skipDuplicates: true,
  })

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
      acao: "Cadastrar",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Cadastrar",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Cadastrar",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Cadastrar",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "VerHistorico",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "VerHistorico",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "VerHistorico",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "VerHistorico",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "EditarProprio",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "EditarProprio",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "EditarProprio",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "EditarProprio",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "EditarGeral",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "EditarGeral",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "EditarGeral",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "EditarGeral",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.administrador.id,
    },

    {
      acao: "Desabilitar",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Processo",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Desabilitar",
      recurso: "Processo",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Desabilitar",
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

    // 🔹 Permissões de Usuarios-pERMISSOES

    {
      acao: "Exibir",
      recurso: "Usuario",
      permitido: true,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Exibir",
      recurso: "Usuario",
      permitido: true,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Exibir",
      recurso: "Usuario",
      permitido: true,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Exibir",
      recurso: "Usuario",
      permitido: true,
      perfilId: perfis.administrador.id,
    },
    {
      acao: "Exibir",
      recurso: "Usuario",
      permitido: true,
      perfilId: perfis.superAdmin.id,
    },
    {
      acao: "Alterar",
      recurso: "Usuario",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Alterar",
      recurso: "Usuario",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Alterar",
      recurso: "Usuario",
      permitido: false,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Alterar",
      recurso: "Usuario",
      permitido: true,
      perfilId: perfis.administrador.id,
    },
    {
      acao: "Alterar",
      recurso: "Usuario",
      permitido: true,
      perfilId: perfis.superAdmin.id,
    },
    {
      acao: "Alterar",
      recurso: "Permissoes",
      permitido: false,
      perfilId: perfis.leitor.id,
    },
    {
      acao: "Alterar",
      recurso: "Permissoes",
      permitido: false,
      perfilId: perfis.atendente.id,
    },
    {
      acao: "Alterar",
      recurso: "Permissoes",
      permitido: false,
      perfilId: perfis.supervisor.id,
    },
    {
      acao: "Alterar",
      recurso: "Permissoes",
      permitido: true,
      perfilId: perfis.administrador.id,
    },
    {
      acao: "Alterar",
      recurso: "Permissoes",
      permitido: true,
      perfilId: perfis.superAdmin.id,
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

  console.log("🔹 Criando Usuários Iniciais...")
  await Promise.all([
    prisma.user.upsert({
      where: { email: "luciano.psilva@anpd.gov.br" },
      update: {},
      create: {
        email: "luciano.psilva@anpd.gov.br",
        perfilId: perfis.administrador.id,
        nome: "Luciano Édipo",
      },
    }),
    prisma.user.upsert({
      where: { email: "fabricio.lopes@anpd.gov.br" },
      update: {},
      create: {
        email: "fabricio.lopes@anpd.gov.br",
        perfilId: perfis.administrador.id,
        nome: "Fabrício Lopes",
      },
    }),
    prisma.user.upsert({
      where: { email: "arthur.vasconcelos@anpd.gov.br" },
      update: {},
      create: {
        email: "arthur.vasconcelos@anpd.gov.br",
        perfilId: perfis.administrador.id,
        nome: "Arthur Oliveira Vasconcelos",
      },
    }),
    prisma.user.upsert({
      where: { email: "henrique.silva@anpd.gov.br" },
      update: {},
      create: {
        email: "henrique.silva@anpd.gov.br",
        perfilId: perfis.supervisor.id,
        nome: "Henrique Adriano Santos Silva",
      },
    }),
    prisma.user.upsert({
      where: { email: "thatyane.batista@anpd.gov.br" },
      update: {},
      create: {
        email: "thatyane.batista@anpd.gov.br",
        perfilId: perfis.supervisor.id,
        nome: "Thatyane Oliveira Campos Batista",
      },
    }),
    prisma.user.upsert({
      where: { email: "daniel.chaves@anpd.gov.br" },
      update: {},
      create: {
        email: "daniel.chaves@anpd.gov.br",
        nome: "Daniel Guimaraes Chaves",
        perfilId: perfis.administrador.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "jorge.lima@anpd.gov.br" },
      update: {},
      create: {
        email: "jorge.lima@anpd.gov.br",
        nome: "Jorge Andre Ferreira Fontelles de Lima",
        perfilId: perfis.administrador.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "gustavo.lima@anpd.gov.br" },
      update: {},
      create: {
        email: "gustavo.lima@anpd.gov.br",
        nome: "Gustavo Fernades Lima",
        perfilId: perfis.administrador.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "eduardo.anjos@anpd.gov.br" },
      update: {},
      create: {
        email: "eduardo.anjos@anpd.gov.br",
        nome: "Eduardo Anjos",
        perfilId: perfis.administrador.id,
      },
    }),
  ])

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
