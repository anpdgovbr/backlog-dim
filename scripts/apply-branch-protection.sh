#!/usr/bin/env bash
# Apply GitHub Branch Protection (compatível com Git Bash no Windows)
# Uso:
#   Dentro do repositório:
#     ORG=anpdgovbr REPO=backlog-dim bash apply-branch-protection.sh
#   Fora do repositório (apontando para a pasta que contém os JSONs):
#     ORG=anpdgovbr REPO=backlog-dim JSON_DIR="/c/Users/<vc>/anpdgovbr/backlog-dim/.github" bash apply-branch-protection.sh
#
# Observação importante (Git Bash):
# - NÃO use endpoint começando com '/repos/...'. Use 'repos/...'
#   pois o Git Bash reescreve '/repos' como caminho de arquivo (ex.: C:/Program Files/Git/repos/...)
set -euo pipefail

ORG="${ORG:-anpdgovbr}"
REPO="${REPO:-backlog-dim}"

# Detecta raiz do repo se possível; caso contrário, usa diretório atual
if ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"; then
  REPO_ROOT="$ROOT"
else
  REPO_ROOT="$(pwd)"
fi

JSON_DIR="${JSON_DIR:-$REPO_ROOT/.github}"

MAIN_JSON="$JSON_DIR/branch-protection-main.json"
STABLE_JSON="$JSON_DIR/branch-protection-stable.json"
DEVELOP_JSON="$JSON_DIR/branch-protection-develop.json"

for f in "$MAIN_JSON" "$STABLE_JSON" "$DEVELOP_JSON"; do
  if [ ! -f "$f" ]; then
    echo "❌ Arquivo não encontrado: $f"
    echo "   Dica: defina JSON_DIR apontando para a pasta .github que contém os JSONs."
    exit 1
  fi
done

# Verifica gh CLI
if ! command -v gh >/dev/null 2>&1; then
  echo "❌ gh CLI não encontrado. Instale via https://cli.github.com/"
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  echo "❌ gh não autenticado. Rode: gh auth login"
  exit 1
fi

apply_rule () {
  local BRANCH="$1"
  local FILE="$2"
  local ENDPOINT="repos/${ORG}/${REPO}/branches/${BRANCH}/protection"  # sem barra inicial!

  echo "→ Protegendo ${BRANCH} usando ${FILE}"
  gh api \
    -X PUT \
    -H "Accept: application/vnd.github+json" \
    "${ENDPOINT}" \
    --input "${FILE}" \
    >/dev/null

  echo "✔ ${BRANCH} protegido"
}

echo "Aplicando branch protection em ${ORG}/${REPO}"
apply_rule "main"    "$MAIN_JSON"
apply_rule "stable"  "$STABLE_JSON"
apply_rule "develop" "$DEVELOP_JSON"
echo "✅ Concluído."
