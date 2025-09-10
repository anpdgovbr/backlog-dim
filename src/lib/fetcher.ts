/**
 * Fetcher padrão para requisições HTTP simples.
 *
 * Uso comum: passar para SWR ou para abstrair chamadas fetch que retornam JSON.
 *
 * - Recebe uma URL e realiza fetch.
 * - Lança um Error quando a resposta HTTP não for OK (status >= 400).
 * - Retorna o corpo da resposta já parseado como JSON.
 *
 * @param url - URL a ser requisitada.
 * @returns Uma Promise que resolve com o JSON retornado pela resposta.
 * @throws Error quando a resposta não é ok.
 */
export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Erro ao buscar dados")
    return res.json()
  })
