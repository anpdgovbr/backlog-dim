import { prisma } from "@/lib/prisma"
import { AcaoPermissao, PermissaoConcedida, RecursoPermissao } from "@/types/Permissao"

export function pode(
  permissoes: Partial<Record<PermissaoConcedida, boolean>>,
  chave: PermissaoConcedida
): boolean {
  return !!permissoes[chave]
}

export async function buscarPermissoesConcedidas(
  email: string
): Promise<Partial<Record<PermissaoConcedida, boolean>>> {
  const usuario = await prisma.user.findUnique({
    where: { email },
    include: {
      perfil: {
        include: {
          permissoes: true,
        },
      },
    },
  })

  if (!usuario?.perfil) return {}

  const resultado: Record<PermissaoConcedida, boolean> = {} as Record<
    PermissaoConcedida,
    boolean
  >

  for (const p of usuario.perfil.permissoes) {
    const chave = `${p.acao}_${p.recurso}` as PermissaoConcedida
    resultado[chave] = p.permitido
  }

  return resultado
}

export async function verificarPermissao(
  email: string,
  acao: AcaoPermissao,
  recurso: RecursoPermissao
): Promise<boolean> {
  const permissoes = await buscarPermissoesConcedidas(email)
  const chave = `${acao}_${recurso}` as PermissaoConcedida
  return pode(permissoes, chave)
}
