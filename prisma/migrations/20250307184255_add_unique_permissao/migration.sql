/*
  Warnings:

  - A unique constraint covering the columns `[perfilId,acao,recurso]` on the table `Permissao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Permissao" ALTER COLUMN "permitido" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Permissao_perfilId_acao_recurso_key" ON "Permissao"("perfilId", "acao", "recurso");
