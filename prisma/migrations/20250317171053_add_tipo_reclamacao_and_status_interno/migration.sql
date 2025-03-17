-- AlterTable
ALTER TABLE "Processo" ADD COLUMN     "statusInternoId" INTEGER,
ADD COLUMN     "tipoReclamacaoId" INTEGER;

-- CreateTable
CREATE TABLE "TipoReclamacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoReclamacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusInterno" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "StatusInterno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoReclamacao_nome_key" ON "TipoReclamacao"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "StatusInterno_nome_key" ON "StatusInterno"("nome");

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_tipoReclamacaoId_fkey" FOREIGN KEY ("tipoReclamacaoId") REFERENCES "TipoReclamacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_statusInternoId_fkey" FOREIGN KEY ("statusInternoId") REFERENCES "StatusInterno"("id") ON DELETE SET NULL ON UPDATE CASCADE;
