/*
  Warnings:

  - Changed the type of `acao` on the `Permissao` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `recurso` on the `Permissao` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AcaoPermissao" AS ENUM ('Exibir', 'Cadastrar', 'Editar', 'Desabilitar', 'VerHistorico', 'EditarProprio', 'EditarGeral', 'Alterar', 'Registrar', 'Acessar', 'Criar');

-- CreateEnum
CREATE TYPE "public"."RecursoPermissao" AS ENUM ('Processo', 'Responsavel', 'Metadados', 'Relatorios', 'Usuario', 'Permissoes', 'Auditoria', 'Admin');

-- AlterTable: alterar tipo com CAST, preservando dados
ALTER TABLE "public"."Permissao"
  ALTER COLUMN "acao" TYPE "public"."AcaoPermissao" USING "acao"::"public"."AcaoPermissao",
  ALTER COLUMN "recurso" TYPE "public"."RecursoPermissao" USING "recurso"::"public"."RecursoPermissao";
