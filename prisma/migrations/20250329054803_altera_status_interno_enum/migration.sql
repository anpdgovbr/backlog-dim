/*
  Warnings:

  - You are about to drop the column `statusInternoId` on the `Processo` table. All the data in the column will be lost.
  - You are about to drop the `StatusInterno` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusInterno" AS ENUM ('IMPORTADO', 'NOVO', 'EM_PROCESSAMENTO', 'PROCESSADO', 'CONSOLIDADO');

-- AlterTable
ALTER TABLE "Processo" ADD COLUMN "statusInterno" "StatusInterno";

