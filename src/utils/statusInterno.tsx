/**
 * Converte um código de status interno (string) em uma label legível para exibição.
 *
 * Valores esperados para `status`:
 * - "IMPORTADO" -> "Importado"
 * - "NOVO" -> "Novo"
 * - "EM_PROCESSAMENTO" -> "Em Processamento"
 * - "PROCESSADO" -> "Processado"
 * - "CONSOLIDADO" -> "Consolidado"
 *
 * Se o valor não for reconhecido (incluindo undefined), retorna "Desconhecido".
 *
 * @param status - Código do status interno (opcional)
 * @returns Uma string com a versão legível do status
 */
export function formatarStatusInterno(status?: string): string {
  switch (status) {
    case "IMPORTADO":
      return "Importado"
    case "NOVO":
      return "Novo"
    case "EM_PROCESSAMENTO":
      return "Em Processamento"
    case "PROCESSADO":
      return "Processado"
    case "CONSOLIDADO":
      return "Consolidado"
    default:
      return "Desconhecido"
  }
}

/**
 * Mapeia um código de status interno para uma das variantes de cor/estilo usadas na UI.
 *
 * Valores possíveis de retorno:
 * - "default"
 * - "primary"
 * - "warning"
 * - "success"
 * - "info"
 *
 * Os mapeamentos seguem convenções visuais da aplicação para cada status.
 * Se o valor não for reconhecido (incluindo undefined), retorna "default".
 *
 * @param status - Código do status interno (opcional)
 * @returns Uma string literal representando a cor/variante a ser usada na UI
 */
export function definirCorStatusInterno(
  status?: string
): "default" | "primary" | "warning" | "success" | "info" {
  switch (status) {
    case "IMPORTADO":
      return "default"
    case "NOVO":
      return "primary"
    case "EM_PROCESSAMENTO":
      return "warning"
    case "PROCESSADO":
      return "success"
    case "CONSOLIDADO":
      return "info"
    default:
      return "default"
  }
}
