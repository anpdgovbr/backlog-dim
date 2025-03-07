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

  // Setores
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

  // Formas de Entrada
  await prisma.formaEntrada.createMany({
    data: [
      { nome: "Ouvidoria" },
      { nome: "SEI" },
      { nome: "SEI - CIS" },
      { nome: "Sistema de Requerimentos" }
    ],
    skipDuplicates: true
  })

  // Encaminhamentos
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

  // Situações do Processamento
  await prisma.situacao.createMany({
    data: [
      { nome: "Em trâmite - aguardando análise" },
      { nome: "Em trâmite - aguardando FIS/TIS" },
      { nome: "Encaminhado para fiscalização" }
    ],
    skipDuplicates: true
  })

  // Pedidos de Manifestação
  await prisma.pedidoManifestacao.createMany({
    data: [
      { nome: "Sim - Controlador Respondeu" },
      { nome: "Sim - Controlador não Respondeu" },
      { nome: "Não se aplica" }
    ],
    skipDuplicates: true
  })

  // Contatos Prévios
  await prisma.contatoPrevio.createMany({
    data: [
      { nome: "Correio Eletrônico (e-mail)" },
      { nome: "Ligação telefônica" },
      { nome: "Reclame Aqui/Procon" },
      { nome: "N/A" }
    ],
    skipDuplicates: true
  })

  // Evidências
  await prisma.evidencia.createMany({
    data: [
      { nome: "Boletim de Ocorrência" },
      { nome: "Print de e-mail" },
      { nome: "Processo Judicial" }
    ],
    skipDuplicates: true
  })

  // ================================
  // 🌟 Adicionando Perfis e Permissões
  // ================================
  
  console.log("🔹 Criando Perfis...")

  const leitor = await prisma.perfil.upsert({
    where: { nome: 'Leitor' },
    update: {},
    create: { nome: 'Leitor' }
  });

  const atendente = await prisma.perfil.upsert({
    where: { nome: 'Atendente' },
    update: {},
    create: { nome: 'Atendente' }
  });

  const supervisor = await prisma.perfil.upsert({
    where: { nome: 'Supervisor' },
    update: {},
    create: { nome: 'Supervisor' }
  });

  const administrador = await prisma.perfil.upsert({
    where: { nome: 'Administrador' },
    update: {},
    create: { nome: 'Administrador' }
  });

  console.log("🔹 Criando Permissões...")

  const permissoes = [
    // Permissões de Processo
    { acao: 'Exibir', recurso: 'Processo', permitido: true, perfilId: leitor.id },
    { acao: 'Exibir', recurso: 'Processo', permitido: true, perfilId: atendente.id },
    { acao: 'Inserir', recurso: 'Processo', permitido: false, perfilId: leitor.id },
    { acao: 'Inserir', recurso: 'Processo', permitido: true, perfilId: atendente.id },
    { acao: 'Editar Geral', recurso: 'Processo', permitido: false, perfilId: leitor.id },
    { acao: 'Editar Geral', recurso: 'Processo', permitido: true, perfilId: supervisor.id },
    { acao: 'Excluir', recurso: 'Processo', permitido: false, perfilId: atendente.id },
    { acao: 'Excluir', recurso: 'Processo', permitido: true, perfilId: administrador.id },
    // Permissões de Relatórios
    { acao: 'Exibir Relatórios', recurso: 'Relatorios', permitido: true, perfilId: leitor.id },
    { acao: 'Criar Relatórios', recurso: 'Relatorios', permitido: false, perfilId: leitor.id },
    { acao: 'Criar Relatórios', recurso: 'Relatorios', permitido: true, perfilId: supervisor.id },
    { acao: 'Editar Relatórios', recurso: 'Relatorios', permitido: false, perfilId: atendente.id },
    { acao: 'Editar Relatórios', recurso: 'Relatorios', permitido: true, perfilId: supervisor.id },
    { acao: 'Desabilitar Relatórios', recurso: 'Relatorios', permitido: false, perfilId: supervisor.id },
    { acao: 'Desabilitar Relatórios', recurso: 'Relatorios', permitido: true, perfilId: administrador.id },
  ];

  await prisma.permissao.createMany({ data: permissoes });

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
