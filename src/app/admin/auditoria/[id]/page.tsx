import type { JsonObject } from "@prisma/client/runtime/library"
import type { AuditLogDto } from "@anpdgovbr/shared-types"

import { notFound } from "next/navigation"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import dayjs from "dayjs"

import { prisma } from "@/lib/prisma"
import { renderJsonColor } from "@/utils/renderJsonColor"

type AuditLogTyped = Omit<AuditLogDto, "antes" | "depois"> & {
  antes: JsonObject | null
  depois: JsonObject | null
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const log = await prisma.auditLog.findUnique({
    where: { id: Number(id) },
  })

  if (!log) return notFound()

  const typedLog: AuditLogTyped = {
    id: String(log.id),
    tabela: log.tabela,
    acao: log.acao as unknown as AuditLogDto["acao"],
    registroId: log.registroId ?? undefined,
    userId: log.userId != null ? String(log.userId) : undefined,
    email: log.email ?? undefined,
    contexto: log.contexto ?? undefined,
    ip: log.ip ?? undefined,
    userAgent: log.userAgent ?? undefined,
    criadoEm: log.criadoEm,
    antes: log.antes as unknown as JsonObject,
    depois: log.depois as unknown as JsonObject,
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom>
        Log de Auditoria #{typedLog.id}
      </Typography>

      <Typography>
        <strong>Ação:</strong> {typedLog.acao}
      </Typography>
      <Typography>
        <strong>Tabela:</strong> {typedLog.tabela}
      </Typography>
      <Typography>
        <strong>Registro ID:</strong> {typedLog.registroId ?? "-"}
      </Typography>
      <Typography>
        <strong>Usuário:</strong> {typedLog.email ?? "Desconhecido"}
      </Typography>
      <Typography>
        <strong>IP:</strong> {typedLog.ip ?? "-"}
      </Typography>
      <Typography>
        <strong>Dispositivo:</strong> {typedLog.userAgent ?? "-"}
      </Typography>
      <Typography>
        <strong>Data/Hora:</strong>{" "}
        {dayjs(typedLog.criadoEm).format("DD/MM/YYYY HH:mm:ss")}
      </Typography>

      {typedLog.contexto && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Contexto</Typography>
          <Box
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              backgroundColor: "grey.100",
              borderRadius: 2,
              p: 2,
              fontFamily: "monospace",
              fontSize: "0.875rem",
              overflowX: "auto",
            }}
          >
            {typedLog.contexto}
          </Box>
        </>
      )}

      {typedLog.antes && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Antes
          </Typography>
          <Box
            sx={{
              backgroundColor: "grey.100",
              borderRadius: 2,
              p: 2,
              fontFamily: "monospace",
              fontSize: "0.875rem",
              overflowX: "auto",
            }}
          >
            {renderJsonColor(typedLog.antes)}
          </Box>
        </>
      )}

      {typedLog.depois && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Depois
          </Typography>
          <Box
            sx={{
              backgroundColor: "grey.100",
              borderRadius: 2,
              p: 2,
              fontFamily: "monospace",
              fontSize: "0.875rem",
              overflowX: "auto",
            }}
          >
            {renderJsonColor(typedLog.depois)}
          </Box>
        </>
      )}
    </Container>
  )
}
