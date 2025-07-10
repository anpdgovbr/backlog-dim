-- CreateTable
CREATE TABLE "Processo" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL,
    "requerente" TEXT,
    "formaEntradaId" INTEGER NOT NULL,
    "responsavelId" INTEGER NOT NULL,
    "requeridoId" INTEGER,
    "situacaoId" INTEGER NOT NULL,
    "encaminhamentoId" INTEGER NOT NULL,
    "pedidoManifestacaoId" INTEGER,
    "contatoPrevioId" INTEGER,
    "evidenciaId" INTEGER,

    CONSTRAINT "Processo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormaEntrada" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "FormaEntrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsavel" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Responsavel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requerido" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "cnae" TEXT,
    "site" TEXT,
    "email" TEXT,
    "setorId" INTEGER,

    CONSTRAINT "Requerido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Setor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Situacao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Situacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encaminhamento" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Encaminhamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoManifestacao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "PedidoManifestacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContatoPrevio" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "ContatoPrevio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidencia" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Processo_numero_key" ON "Processo"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "FormaEntrada_nome_key" ON "FormaEntrada"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_nome_key" ON "Responsavel"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Requerido_nome_key" ON "Requerido"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Setor_nome_key" ON "Setor"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Situacao_descricao_key" ON "Situacao"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Encaminhamento_descricao_key" ON "Encaminhamento"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoManifestacao_descricao_key" ON "PedidoManifestacao"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "ContatoPrevio_descricao_key" ON "ContatoPrevio"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Evidencia_descricao_key" ON "Evidencia"("descricao");

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_formaEntradaId_fkey" FOREIGN KEY ("formaEntradaId") REFERENCES "FormaEntrada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Responsavel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_requeridoId_fkey" FOREIGN KEY ("requeridoId") REFERENCES "Requerido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_situacaoId_fkey" FOREIGN KEY ("situacaoId") REFERENCES "Situacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_encaminhamentoId_fkey" FOREIGN KEY ("encaminhamentoId") REFERENCES "Encaminhamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_pedidoManifestacaoId_fkey" FOREIGN KEY ("pedidoManifestacaoId") REFERENCES "PedidoManifestacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_contatoPrevioId_fkey" FOREIGN KEY ("contatoPrevioId") REFERENCES "ContatoPrevio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_evidenciaId_fkey" FOREIGN KEY ("evidenciaId") REFERENCES "Evidencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requerido" ADD CONSTRAINT "Requerido_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
