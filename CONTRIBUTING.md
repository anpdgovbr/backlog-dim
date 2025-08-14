# Guia de Contribuição – Backlog DIM

Obrigado por contribuir com o **Backlog DIM**, sistema de gestão de processos administrativos da ANPD.

Este documento define como contribuir, preparar o ambiente, abrir issues e PRs, e seguir o fluxo de desenvolvimento.

---

## 📜 Código de Conduta

Todos os participantes devem seguir o [Código de Conduta](CODE_OF_CONDUCT.md) da ANPD e deste repositório.

---

## 🚀 Fluxo de Trabalho

### Branches

- **develop** – Integração de novas funcionalidades.
- **stable** – Releases aprovadas para produção.
- **feature/**, **fix/**, **chore/** – Branches de trabalho.

### Commits

Usamos o padrão **Conventional Commits**:

- `feat:` – Nova funcionalidade.
- `fix:` – Correção de bug.
- `docs:` – Alterações de documentação.
- `refactor:` – Refatoração sem alteração de comportamento.
- `chore:` – Tarefas gerais.

Exemplo:

```
feat: adiciona autenticação GovBR
```

---

## 🛠️ Ambiente Local

### Pré-requisitos

- Node.js 20+
- NPM 10+
- Docker (para infraestrutura padrão ANPD)

### Configuração

```bash
npm ci
cp .env.local.example .env.local
npm run infra:setup
npm run infra:db:init
npm run dev
```

---

## ✅ Qualidade de Código

Antes de abrir um PR:

```bash
npm run type-check
npm run lint
npm run build
```

- ESLint + Prettier para padronização.
- Husky e lint-staged para hooks de commit.

---

## 🔄 Pull Requests

1. Crie sua branch a partir de `develop`.
2. Descreva claramente **problema**, **solução** e **impactos**.
3. Marque checklist:
   - [ ] Lint e type-check OK.
   - [ ] Build OK.
   - [ ] Documentação atualizada.
4. O PR será revisado pelo **DDSS Team**.

---

## 🐛 Issues

Tipos:

- **bug**
- **enhancement**
- **documentation**
- **security**

Inclua **passos para reproduzir**, prints/logs e contexto.

---

## 🔒 Segurança

Não submeta dados sensíveis. Reporte vulnerabilidades conforme [SECURITY.md](SECURITY.md).

---

## 📩 Contato

- Time DDSS: desenvolvimento@anpd.gov.br
