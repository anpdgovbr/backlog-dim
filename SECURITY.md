# Política de Segurança – Backlog DIM

Obrigado por ajudar a manter o Backlog DIM seguro.

## Como Reportar Vulnerabilidades

- Envie para **desenvolvimento@anpd.gov.br** com o assunto: `[SECURITY][backlog-dim] <título breve>`.
- Preferimos também o fluxo de **GitHub Security Advisory** (Private Vulnerability Reporting) quando disponível.
- Inclua: descrição, impacto, versão/commit afetado, PoC, mitigação sugerida.

**Por favor, não abra issues públicas** para vulnerabilidades.

## Escopo

- Código deste repositório.
- Fluxos de build/CI configurados aqui.
- Não inclui serviços de terceiros fora do controle direto do projeto.

## Suporte de Versões

- Monitoramos e corrigimos a **última versão** na branch `stable`.
- Correções podem ser aplicadas retroativamente a depender do impacto.

## Divulgações

- Seguimos **divulgação responsável**: trataremos o reporte, prepararemos correção e publicaremos nota/release.
- Sem programa de bug bounty.

## Boas Práticas Recomendadas

- Não commitar segredos (`.env`, chaves, tokens).
- Usar variáveis de ambiente seguras em produção.
- Rotacionar credenciais após incidentes.
