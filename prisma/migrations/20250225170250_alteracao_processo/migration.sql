-- AlterTable
ALTER TABLE "Processo" ADD COLUMN     "anonimo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "observacoes" TEXT;
