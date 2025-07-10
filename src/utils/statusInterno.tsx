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
