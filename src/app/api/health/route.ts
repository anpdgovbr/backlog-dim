// app/api/health/route.ts
/**
 * Health check do serviço.
 *
 * Retorna { status: 'ok', timestamp: ISOString } com cache-control no-store.
 * Exemplo: GET /api/health
 */
export async function GET() {
  return new Response(
    JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
    {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    }
  )
}
