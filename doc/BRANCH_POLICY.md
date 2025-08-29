# 📚 Política de Branches – Backlog DIM

Este documento define a estratégia oficial de branches do repositório **@anpdgovbr/backlog-dim** e as regras de proteção correspondentes.

## 🌳 Estrutura de Branches

| Branch    | Propósito                      | Origem de Merge | Público-alvo       |
| --------- | ------------------------------ | --------------- | ------------------ |
| `main`    | **Produção**                   | `stable`        | Releases aprovadas |
| `stable`  | **Homologação / Pré-produção** | `develop`       | Release Candidates |
| `develop` | **Integração contínua**        | feature/fix/... | Dev diário         |

Branches de trabalho:

- `feature/<slug>` – novas funcionalidades
- `fix/<slug>` – correção de bugs
- `chore/<slug>` – tarefas diversas (infra, build)
- `hotfix/<slug>` – correções urgentes (merge direto para `main` + backmerge)

## 🔄 Fluxo de Integração

1. Trabalho em feature/fix → PR para `develop`
2. Quando testável em hml → PR `develop` → `stable`
3. Quando validado para prod → PR `stable` → `main` + tag/release

```
feature → develop → stable → main (tag)
                 ↘ backmerge quando necessário ↗
```

## 🧭 Regras de Merge

- **Sempre via Pull Request** (sem commits diretos nas branches protegidas)
- **Squash merge** preferencial em `develop` e `stable`
- **Merge commit** ou **rebase** permitido em `main` apenas quando necessário para releases
- **Backmerge** obrigatório após releases:
  - `main` → `stable`
  - `stable` → `develop`

## ✅ Checks obrigatórios (CI)

Os PRs nas branches protegidas devem ter **checks verdes** antes do merge. Checks padrão esperados:

- `CI / build`
- `CI / lint`
- `CI / type-check`
- `gitleaks`
- `codeql`

> Ajuste os nomes dos checks conforme seus workflows (veja “Actions → run name”).

## 🔖 Versionamento & Tags

- Tags semânticas: `v<major>.<minor>.<patch>` (ex.: `v0.3.0`)
- Releases: criadas a partir da `main` após merge de `stable`
- Scripts úteis: `npm run bump:*`

## 🛡 Proteção de Branch (resumo)

| Regra                             | main | stable | develop |
| --------------------------------- | :--: | :----: | :-----: |
| Exigir PR                         |  ✅  |   ✅   |   ✅    |
| Aprovações mínimas                |  2   |   1    |    1    |
| Dismiss stale reviews             |  ✅  |   ✅   |   ✅    |
| CI verde obrigatório              |  ✅  |   ✅   |   ✅    |
| Resolver conversas antes de merge |  ✅  |   ✅   |   ✅    |
| Impedir force-push                |  ✅  |   ✅   |   ✅    |
| Impedir deletar branch            |  ✅  |   ✅   |   ✅    |
| Linear history                    |  ✅  |   ✅   |   ✅    |
| Enforce admins                    |  ✅  |   ✅   |   ✅    |

## 🔐 LGPD e Segurança

- Proibido incluir dados pessoais reais em PRs/issues.
- Nunca versionar `.env`/segredos/certificados.
- Siga `SECURITY.md` para reportes de vulnerabilidades.

---

> Última revisão: 2025-08-14 (DDSS/CGTI).
