-- AlterTable
ALTER TABLE "CNAE" ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ContatoPrevio" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Encaminhamento" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Evidencia" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FormaEntrada" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PedidoManifestacao" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Perfil" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Permissao" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Processo" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProcessoStatus" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Requerido" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Responsavel" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Setor" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Situacao" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "StatusInterno" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TipoReclamacao" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "exclusionDate" TIMESTAMP(3);
