-- AlterTable
ALTER TABLE "Processo" ADD COLUMN "tipoReclamacaoId" INTEGER;

-- CreateTable
CREATE TABLE "TipoReclamacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoReclamacao_pkey" PRIMARY KEY ("id")
);



-- CreateIndex
CREATE UNIQUE INDEX "TipoReclamacao_nome_key" ON "TipoReclamacao"("nome");



-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_tipoReclamacaoId_fkey" FOREIGN KEY ("tipoReclamacaoId") REFERENCES "TipoReclamacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

