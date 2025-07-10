/*
  Warnings:

  - Changed the type of `acao` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AcaoAuditoria" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'PATCH', 'GET');

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "ip" TEXT,
ADD COLUMN     "userAgent" TEXT,
DROP COLUMN "acao",
ADD COLUMN     "acao" "AcaoAuditoria" NOT NULL;
