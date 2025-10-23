-- Conversão dos campos de requerido para texto (armazenam UUIDs externos)
ALTER TABLE "Processo"
  ALTER COLUMN "requeridoId" TYPE TEXT USING "requeridoId"::text,
  ALTER COLUMN "requeridoFinalId" TYPE TEXT USING "requeridoFinalId"::text;

-- Atualiza registroId da auditoria para texto, permitindo armazenar UUIDs
ALTER TABLE "AuditLog"
  ALTER COLUMN "registroId" TYPE TEXT USING "registroId"::text;
