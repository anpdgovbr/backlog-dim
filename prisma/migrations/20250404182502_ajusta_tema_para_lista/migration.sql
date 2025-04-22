/*
  Warnings:

  - The `temaRequerimento` column on the `Processo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Processo" DROP COLUMN "temaRequerimento",
ADD COLUMN     "temaRequerimento" TEXT[] DEFAULT ARRAY[]::TEXT[];
