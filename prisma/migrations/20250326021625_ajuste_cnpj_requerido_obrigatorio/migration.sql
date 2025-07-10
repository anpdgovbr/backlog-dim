/*
  Warnings:

  - Made the column `cnpj` on table `Requerido` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Requerido" ALTER COLUMN "cnpj" SET NOT NULL;
