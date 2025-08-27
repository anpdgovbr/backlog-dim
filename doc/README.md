# 📚 Índice da Documentação - Backlog DIM

## 📋 Documentos Principais

### 🛠️ Desenvolvimento

- **[ESLINT.md](ESLINT.md)** - Configuração e uso do ESLint
  - Flat config implementação
  - Regras customizadas
  - Troubleshooting

### 🏗️ Infraestrutura

- **[MIGRACAO_DOCKER_INFRA_PG.md](MIGRACAO_DOCKER_INFRA_PG.md)** - Migração para docker-infra-pg
  - Implementação completa
  - Benefícios da migração
  - Fluxos de trabalho atualizados

### 🔧 Configuração Técnica

- **[VERSIONING.md](VERSIONING.md)** - Sistema de versionamento
  - Scripts de bump automático
  - Workflow de releases
  - Convenções de commits

### 📊 Histórico e Referência

- **[MODERNIZACAO_CONFIGURACOES.md](MODERNIZACAO_CONFIGURACOES.md)** - Histórico de modernização
  - Husky v9 upgrade
  - Configurações atualizadas
  - Antes vs depois

## 🎯 Guia de Uso

### 👨‍💻 Para Novos Desenvolvedores

1. Consulte o README.md principal do projeto primeiro
2. Configure com os scripts de infraestrutura (`npm run infra:setup`)
3. Familiarize-se com **[ESLINT.md](ESLINT.md)**

### 🔧 Para Configuração Avançada

1. **[VERSIONING.md](VERSIONING.md)** - Sistema de versões
2. **[MODERNIZACAO_CONFIGURACOES.md](MODERNIZACAO_CONFIGURACOES.md)** - Contexto histórico

### 🏗️ Para Infraestrutura

1. **[MIGRACAO_DOCKER_INFRA_PG.md](MIGRACAO_DOCKER_INFRA_PG.md)** - Implementação atual

## 📚 Documentação de API (TypeDoc)

A documentação de API gerada automaticamente pelo TypeDoc será colocada em `docs/api`.

Para gerar localmente:

```powershell
npm ci
npm run docs
```

Se preferir gerar em HTML estático ou Markdown (via plugins), ajuste `typedoc.json` com os plugins desejados.

## Publicação (GitHub Pages)

O workflow `Generate TypeDoc and Publish` gera a documentação e publica `docs/api` no branch `gh-pages` sempre que houver push para `main`.

Para testar manualmente sem merge, faça um push numa branch e abra um PR para `main` (o merge dispara o workflow), ou adicione um `workflow_dispatch` no arquivo de workflow para acionar manualmente.

Após o deploy, habilite GitHub Pages nas configurações do repositório apontando para a branch `gh-pages` (source: `gh-pages` / root).

## 📝 Documentos Removidos

Os seguintes documentos foram consolidados ou removidos por serem obsoletos/temporários:

- `FIXING_WARNINGS.md` - Informações temporárias integradas ao workflow
- `RESOLUCAO_WARNINGS.md` - Informações obsoletas
- `RESOLUCAO_ESLINT_MUI.md` - Consolidado no ESLINT.md
- `ESLINT_RESUMO.md` - Duplicado do ESLINT.md

## 🔄 Manutenção da Documentação

### ✅ Documentos Ativos (manter atualizados)

- README.md (principal)
- ESLINT.md
- VERSIONING.md

### 📚 Documentos de Referência (manter histórico)

- MIGRACAO_DOCKER_INFRA_PG.md
- MODERNIZACAO_CONFIGURACOES.md

### 🎯 Critérios para Novos Documentos

- **Útil a longo prazo**: Evitar documentos temporários
- **Não duplicar**: Consolidar informações relacionadas
- **Manter atualizado**: Revisar com mudanças significativas
- **Foco prático**: Documentar o que realmente ajuda desenvolvedores
