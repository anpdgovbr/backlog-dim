export const validateEmail = (email: string) => {
  if (email === "") return undefined
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email) ? undefined : "E-mail inválido"
}

export const validateSite = (site: string) => {
  if (site === "") return undefined
  try {
    const url = new URL(site.includes("://") ? site : `http://${site}`)
    if (!["http:", "https:"].includes(url.protocol)) {
      return "Protocolo inválido (use http:// ou https://)"
    }
    if (!url.hostname.includes(".")) {
      return "Domínio inválido"
    }
    return undefined
  } catch (e) {
    console.error(e)
    return "Site inválido"
  }
}
