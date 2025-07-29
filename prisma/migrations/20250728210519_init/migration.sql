-- CreateEnum
CREATE TYPE "TipoRequerimento" AS ENUM ('PETICAO_TITULAR', 'DENUNCIA_LGPD');

-- CreateEnum
CREATE TYPE "StatusInterno" AS ENUM ('IMPORTADO', 'NOVO', 'EM_PROCESSAMENTO', 'PROCESSADO', 'CONSOLIDADO');

-- CreateEnum
CREATE TYPE "AcaoAuditoria" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'PATCH', 'GET');

-- CreateTable
CREATE TABLE "Processo" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL,
    "requerente" TEXT,
    "formaEntradaId" INTEGER NOT NULL,
    "responsavelId" INTEGER NOT NULL,
    "requeridoId" INTEGER,
    "requeridoFinalId" INTEGER,
    "situacaoId" INTEGER NOT NULL,
    "encaminhamentoId" INTEGER,
    "pedidoManifestacaoId" INTEGER,
    "contatoPrevioId" INTEGER,
    "evidenciaId" INTEGER,
    "anonimo" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "temaRequerimento" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "envioPedido" TIMESTAMP(3),
    "prazo" INTEGER,
    "dataVencimento" TIMESTAMP(3),
    "processoStatusId" INTEGER,
    "tipoReclamacaoId" INTEGER,
    "statusInterno" "StatusInterno",
    "tipoRequerimento" "TipoRequerimento",
    "resumo" TEXT,
    "dataConclusao" TIMESTAMP(3),
    "dataEnvioPedido" TIMESTAMP(3),
    "prazoPedido" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "Processo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoStatus" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "ProcessoStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoReclamacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "TipoReclamacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormaEntrada" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "FormaEntrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Situacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "Situacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encaminhamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "Encaminhamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoManifestacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "PedidoManifestacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContatoPrevio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "ContatoPrevio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidencia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissao" (
    "id" SERIAL NOT NULL,
    "acao" TEXT NOT NULL,
    "recurso" TEXT NOT NULL,
    "permitido" BOOLEAN NOT NULL,
    "perfilId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "Permissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsavel" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "userId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "Responsavel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "perfilId" INTEGER,
    "nome" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "exclusionDate" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "tabela" TEXT NOT NULL,
    "acao" "AcaoAuditoria" NOT NULL,
    "registroId" INTEGER,
    "userId" TEXT,
    "email" TEXT,
    "antes" JSONB,
    "depois" JSONB,
    "contexto" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Processo_numero_key" ON "Processo"("numero");

-- CreateIndex
CREATE INDEX "Processo_active_idx" ON "Processo"("active");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessoStatus_nome_key" ON "ProcessoStatus"("nome");

-- CreateIndex
CREATE INDEX "ProcessoStatus_active_idx" ON "ProcessoStatus"("active");

-- CreateIndex
CREATE UNIQUE INDEX "TipoReclamacao_nome_key" ON "TipoReclamacao"("nome");

-- CreateIndex
CREATE INDEX "TipoReclamacao_active_idx" ON "TipoReclamacao"("active");

-- CreateIndex
CREATE UNIQUE INDEX "FormaEntrada_nome_key" ON "FormaEntrada"("nome");

-- CreateIndex
CREATE INDEX "FormaEntrada_active_idx" ON "FormaEntrada"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Situacao_nome_key" ON "Situacao"("nome");

-- CreateIndex
CREATE INDEX "Situacao_active_idx" ON "Situacao"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Encaminhamento_nome_key" ON "Encaminhamento"("nome");

-- CreateIndex
CREATE INDEX "Encaminhamento_active_idx" ON "Encaminhamento"("active");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoManifestacao_nome_key" ON "PedidoManifestacao"("nome");

-- CreateIndex
CREATE INDEX "PedidoManifestacao_active_idx" ON "PedidoManifestacao"("active");

-- CreateIndex
CREATE UNIQUE INDEX "ContatoPrevio_nome_key" ON "ContatoPrevio"("nome");

-- CreateIndex
CREATE INDEX "ContatoPrevio_active_idx" ON "ContatoPrevio"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Evidencia_nome_key" ON "Evidencia"("nome");

-- CreateIndex
CREATE INDEX "Evidencia_active_idx" ON "Evidencia"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_nome_key" ON "Perfil"("nome");

-- CreateIndex
CREATE INDEX "Perfil_active_idx" ON "Perfil"("active");

-- CreateIndex
CREATE INDEX "Permissao_active_idx" ON "Permissao"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Permissao_perfilId_acao_recurso_key" ON "Permissao"("perfilId", "acao", "recurso");

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_nome_key" ON "Responsavel"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_userId_key" ON "Responsavel"("userId");

-- CreateIndex
CREATE INDEX "Responsavel_active_idx" ON "Responsavel"("active");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_active_idx" ON "User"("active");

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_contatoPrevioId_fkey" FOREIGN KEY ("contatoPrevioId") REFERENCES "ContatoPrevio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_encaminhamentoId_fkey" FOREIGN KEY ("encaminhamentoId") REFERENCES "Encaminhamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_evidenciaId_fkey" FOREIGN KEY ("evidenciaId") REFERENCES "Evidencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_formaEntradaId_fkey" FOREIGN KEY ("formaEntradaId") REFERENCES "FormaEntrada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_pedidoManifestacaoId_fkey" FOREIGN KEY ("pedidoManifestacaoId") REFERENCES "PedidoManifestacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Responsavel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_situacaoId_fkey" FOREIGN KEY ("situacaoId") REFERENCES "Situacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_processoStatusId_fkey" FOREIGN KEY ("processoStatusId") REFERENCES "ProcessoStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_tipoReclamacaoId_fkey" FOREIGN KEY ("tipoReclamacaoId") REFERENCES "TipoReclamacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissao" ADD CONSTRAINT "Permissao_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsavel" ADD CONSTRAINT "Responsavel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
