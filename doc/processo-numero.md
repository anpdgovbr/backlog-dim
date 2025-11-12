# Numeração de Processos

A geração do número do processo hoje segue um formato simples e previsível:

- `PYYYYMM-NNNN` (ex.: `P202504-0001`)
  - `P`: prefixo fixo
  - `YYYY`: ano com 4 dígitos
  - `MM`: mês com 2 dígitos
  - `NNNN`: sequência no mês, com padding de 4 dígitos

Implementação atual: `src/app/api/processos/route.ts` (função `gerarNumeroProcesso`).

Limitações conhecidas:

- A sequência é derivada da contagem de registros no mês (sem lock/sequence). Em alta concorrência, pode haver colisão esporádica (tratada pelo unique do banco).

Diretriz organizacional:

- O padrão oficial de numeração da organização será integrado assim que definido. Até lá, não altere a semântica de geração sem alinhamento prévio com a equipe responsável.

Próximos passos sugeridos (quando a política for concluída):

- Implementar sequence transacional por competência (ano/mês) ou serviço dedicado de numeração.
- Caso permaneça no banco, usar `SELECT … FOR UPDATE` em tabela de "contador mensal" para garantir unicidade sob concorrência.
