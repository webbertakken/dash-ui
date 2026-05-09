#!/usr/bin/env bash
# autoresearch driver: run N iterations, ~5 min each, on a dedicated branch.
#
# Usage:
#   ./run-loop.sh                       # tag = today (e.g. may09), 200 iters
#   ./run-loop.sh may09-v2              # custom tag
#   ./run-loop.sh may09-v2 50           # custom tag + iteration count
#   ./run-loop.sh may09-v2 50 480       # custom tag + iters + per-iter timeout (sec)
#
# Env overrides:
#   CLAUDE_MODEL=claude-sonnet-4-6      # pin a cheaper model
#   CLAUDE_BIN=claude                   # path to claude CLI

set -euo pipefail

TAG="${1:-$(date +%b%d | tr '[:upper:]' '[:lower:]')}"
ITERATIONS="${2:-200}"
ITER_TIMEOUT="${3:-600}"   # 10 min hard kill (5 min budget + buffer)
BRANCH="autoresearch/${TAG}"
LOG_DIR="runs/${TAG}"
CLAUDE_BIN="${CLAUDE_BIN:-claude}"

if ! command -v "$CLAUDE_BIN" >/dev/null 2>&1; then
  echo "error: $CLAUDE_BIN not found on PATH" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree is dirty. commit or stash first." >&2
  git status --short
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/${BRANCH}"; then
  echo "→ resuming existing branch ${BRANCH}"
  git checkout "${BRANCH}"
else
  echo "→ creating branch ${BRANCH}"
  git checkout -b "${BRANCH}"
fi

mkdir -p "${LOG_DIR}"

if [[ ! -f results.tsv ]]; then
  printf 'commit\tstatus\tmetric\tdescription\n' > results.tsv
  echo "→ initialised results.tsv"
fi

PROMPT='Read program.md and OBJECTIVES.md. Run exactly ONE iteration of the autoresearch loop as described in program.md: pick an experiment, edit in-scope files, commit, verify, append a row to results.tsv, then keep or git reset. Return as soon as that single iteration is done. Do not loop. Do not ask the human anything.'

MODEL_FLAG=()
if [[ -n "${CLAUDE_MODEL:-}" ]]; then
  MODEL_FLAG=(--model "${CLAUDE_MODEL}")
fi

START_EPOCH=$(date +%s)
echo "→ starting ${ITERATIONS} iterations on ${BRANCH} (timeout ${ITER_TIMEOUT}s each)"
echo "→ logs: ${LOG_DIR}/iter-NNN.log"

for i in $(seq 1 "${ITERATIONS}"); do
  IDX=$(printf '%03d' "${i}")
  LOG="${LOG_DIR}/iter-${IDX}.log"
  STAMP=$(date -Iseconds)
  echo "=== iter ${IDX}/${ITERATIONS} @ ${STAMP} ==="

  set +e
  timeout "${ITER_TIMEOUT}" "${CLAUDE_BIN}" \
    -p "${PROMPT}" \
    --dangerously-skip-permissions \
    "${MODEL_FLAG[@]}" \
    > "${LOG}" 2>&1
  RC=$?
  set -e

  if [[ ${RC} -eq 124 ]]; then
    echo "  ! timed out after ${ITER_TIMEOUT}s"
  elif [[ ${RC} -ne 0 ]]; then
    echo "  ! exit ${RC}"
  fi

  # Surface the latest results.tsv row so a human watching can see progress.
  if [[ -f results.tsv ]]; then
    tail -n 1 results.tsv | sed 's/^/  last: /'
  fi
done

ELAPSED=$(( $(date +%s) - START_EPOCH ))
echo "→ done. ${ITERATIONS} iterations in $((ELAPSED / 60))m $((ELAPSED % 60))s on ${BRANCH}"
echo "→ review:  git log --oneline ${BRANCH}"
echo "→ results: column -t -s $'\\t' results.tsv | less"
