/*
  Warnings:

  - You are about to drop the column `cnae` on the `Requerido` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `Requerido` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Responsavel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Requerido_nome_key";

-- AlterTable
ALTER TABLE "Requerido" DROP COLUMN "cnae",
ADD COLUMN     "cnaeId" INTEGER;

-- AlterTable
ALTER TABLE "Responsavel" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nome" TEXT;

-- CreateTable
CREATE TABLE "CNAE" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "code" VARCHAR(10) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,

    CONSTRAINT "CNAE_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CNAE_code_key" ON "CNAE"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Requerido_cnpj_key" ON "Requerido"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_userId_key" ON "Responsavel"("userId");

-- AddForeignKey
ALTER TABLE "Requerido" ADD CONSTRAINT "Requerido_cnaeId_fkey" FOREIGN KEY ("cnaeId") REFERENCES "CNAE"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsavel" ADD CONSTRAINT "Responsavel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
