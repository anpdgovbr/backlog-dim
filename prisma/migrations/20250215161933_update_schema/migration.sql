/*
  Warnings:

  - You are about to drop the column `descricao` on the `ContatoPrevio` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Encaminhamento` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Evidencia` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `PedidoManifestacao` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Situacao` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome]` on the table `ContatoPrevio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Encaminhamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Evidencia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `PedidoManifestacao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Situacao` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nome` to the `ContatoPrevio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Encaminhamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Evidencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `PedidoManifestacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Situacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ContatoPrevio_descricao_key";

-- DropIndex
DROP INDEX "Encaminhamento_descricao_key";

-- DropIndex
DROP INDEX "Evidencia_descricao_key";

-- DropIndex
DROP INDEX "PedidoManifestacao_descricao_key";

-- DropIndex
DROP INDEX "Situacao_descricao_key";

-- AlterTable
ALTER TABLE "ContatoPrevio" DROP COLUMN "descricao",
ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Encaminhamento" DROP COLUMN "descricao",
ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Evidencia" DROP COLUMN "descricao",
ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PedidoManifestacao" DROP COLUMN "descricao",
ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Situacao" DROP COLUMN "descricao",
ADD COLUMN     "nome" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ContatoPrevio_nome_key" ON "ContatoPrevio"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Encaminhamento_nome_key" ON "Encaminhamento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Evidencia_nome_key" ON "Evidencia"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoManifestacao_nome_key" ON "PedidoManifestacao"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Situacao_nome_key" ON "Situacao"("nome");
