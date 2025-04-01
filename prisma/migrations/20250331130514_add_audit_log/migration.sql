-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "tabela" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "registroId" INTEGER,
    "userId" TEXT,
    "email" TEXT,
    "antes" JSONB,
    "depois" JSONB,
    "contexto" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
