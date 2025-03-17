-- AlterTable
ALTER TABLE "Processo" ADD COLUMN     "dataVencimento" TIMESTAMP(3),
ADD COLUMN     "envioPedido" TIMESTAMP(3),
ADD COLUMN     "prazo" INTEGER,
ADD COLUMN     "processoStatusId" INTEGER,
ADD COLUMN     "temaRequerimento" TEXT;

-- CreateTable
CREATE TABLE "ProcessoStatus" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "ProcessoStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessoStatus_nome_key" ON "ProcessoStatus"("nome");

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_processoStatusId_fkey" FOREIGN KEY ("processoStatusId") REFERENCES "ProcessoStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
