-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_encaminhamentoId_fkey";

-- AlterTable
ALTER TABLE "Processo" ALTER COLUMN "encaminhamentoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_encaminhamentoId_fkey" FOREIGN KEY ("encaminhamentoId") REFERENCES "Encaminhamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
