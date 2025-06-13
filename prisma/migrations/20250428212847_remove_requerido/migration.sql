/*
  Warnings:

  - You are about to drop the `CNAE` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Requerido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Setor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_requeridoFinalId_fkey";

-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_requeridoId_fkey";

-- DropForeignKey
ALTER TABLE "Requerido" DROP CONSTRAINT "Requerido_cnaeId_fkey";

-- DropForeignKey
ALTER TABLE "Requerido" DROP CONSTRAINT "Requerido_setorId_fkey";

-- DropTable
DROP TABLE "CNAE";

-- DropTable
DROP TABLE "Requerido";

-- DropTable
DROP TABLE "Setor";

-- DropEnum
DROP TYPE "TipoRequerido";
