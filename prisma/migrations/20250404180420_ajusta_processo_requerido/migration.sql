/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Requerido` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TipoRequerimento" AS ENUM ('PETICAO_TITULAR', 'DENUNCIA_LGPD');

-- CreateEnum
CREATE TYPE "TipoRequerido" AS ENUM ('PESSOA_FISICA', 'PESSOA_JURIDICA', 'ESTRANGEIRO');

-- AlterTable
ALTER TABLE "Processo" ADD COLUMN     "dataConclusao" TIMESTAMP(3),
ADD COLUMN     "dataEnvioPedido" TIMESTAMP(3),
ADD COLUMN     "prazoPedido" INTEGER,
ADD COLUMN     "requeridoFinalId" INTEGER,
ADD COLUMN     "resumo" TEXT,
ADD COLUMN     "tipoRequerimento" "TipoRequerimento";

-- AlterTable
ALTER TABLE "Requerido" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "politicaPrivacidadeUrl" TEXT,
ADD COLUMN     "tipo" "TipoRequerido" NOT NULL DEFAULT 'PESSOA_JURIDICA',
ALTER COLUMN "cnpj" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "CNAE_active_idx" ON "CNAE"("active");

-- CreateIndex
CREATE INDEX "ContatoPrevio_active_idx" ON "ContatoPrevio"("active");

-- CreateIndex
CREATE INDEX "Encaminhamento_active_idx" ON "Encaminhamento"("active");

-- CreateIndex
CREATE INDEX "Evidencia_active_idx" ON "Evidencia"("active");

-- CreateIndex
CREATE INDEX "FormaEntrada_active_idx" ON "FormaEntrada"("active");

-- CreateIndex
CREATE INDEX "PedidoManifestacao_active_idx" ON "PedidoManifestacao"("active");

-- CreateIndex
CREATE INDEX "Perfil_active_idx" ON "Perfil"("active");

-- CreateIndex
CREATE INDEX "Permissao_active_idx" ON "Permissao"("active");

-- CreateIndex
CREATE INDEX "Processo_active_idx" ON "Processo"("active");

-- CreateIndex
CREATE INDEX "ProcessoStatus_active_idx" ON "ProcessoStatus"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Requerido_cpf_key" ON "Requerido"("cpf");

-- CreateIndex
CREATE INDEX "Requerido_active_idx" ON "Requerido"("active");

-- CreateIndex
CREATE INDEX "Responsavel_active_idx" ON "Responsavel"("active");

-- CreateIndex
CREATE INDEX "Setor_active_idx" ON "Setor"("active");

-- CreateIndex
CREATE INDEX "Situacao_active_idx" ON "Situacao"("active");

-- CreateIndex
CREATE INDEX "TipoReclamacao_active_idx" ON "TipoReclamacao"("active");

-- CreateIndex
CREATE INDEX "User_active_idx" ON "User"("active");

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_requeridoFinalId_fkey" FOREIGN KEY ("requeridoFinalId") REFERENCES "Requerido"("id") ON DELETE SET NULL ON UPDATE CASCADE;
