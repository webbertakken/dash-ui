#!/usr/bin/env bash
# autoresearch driver: run N iterations, ~5 min each, on a dedicated branch.
#
# Usage:
#   ./run-loop.sh                       # tag = today (e.g. may09), 200 iters
#   ./run-loop.sh may09-v2              # custom tag
#   ./run-loop.sh may09-v2 50           # custom tag + iteration count
#   ./run-loop.sh may09-v2 50 480       # custom tag + iters + per-iter timeout (sec)
#
# Flags (may appear before or after positional args):
#   --tag <name>                        # same as positional TAG
#   --iterations <n>                    # same as positional ITERATIONS
#   --timeout <sec>                     # same as positional ITER_TIMEOUT
#   --model <name>                      # override the default (sonnet 4.6)
#   --effort <level>                    # low | medium | high | xhigh | max
#   --continue                          # resume: skip existing iter-NNN.log files
#
# Env overrides (flags win over env):
#   CLAUDE_MODEL=claude-opus-4-7        # override the default (sonnet 4.6)
#   CLAUDE_EFFORT=high                  # low | medium | high | xhigh | max
#   CLAUDE_BIN=claude                   # path to claude CLI

set -euo pipefail

# `claude -p` swallows SIGINT, so Ctrl-C alone won't break the loop.
# Convert INT/TERM into SIGTERM for the whole subtree, then exit.
# Hit Ctrl-C twice if the first round doesn't catch a stuck child.
INTERRUPTED=0
on_signal() {
  if [[ ${INTERRUPTED} -eq 1 ]]; then
    echo
    echo "→ second signal — SIGKILL to subtree" >&2
    pkill -KILL -P $$ 2>/dev/null || true
    exit 137
  fi
  INTERRUPTED=1
  echo
  echo "→ stopping — SIGTERM to subtree (Ctrl-C again for SIGKILL)" >&2
  pkill -TERM -P $$ 2>/dev/null || true
  exit 130
}
trap on_signal INT TERM

# Parse flags out of the arg list; collect remaining args positionally.
CLI_TAG=""
CLI_ITERATIONS=""
CLI_TIMEOUT=""
CLI_MODEL=""
CLI_EFFORT=""
CONTINUE=0
POSITIONAL=()

require_value() {
  # $1 = flag name, $2 = value
  if [[ -z "${2:-}" || "${2:0:1}" == "-" ]]; then
    echo "error: ${1} requires a value" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tag)         require_value "--tag"        "${2:-}"; CLI_TAG="$2";        shift 2 ;;
    --tag=*)       CLI_TAG="${1#--tag=}";                                       shift   ;;
    --iterations)  require_value "--iterations" "${2:-}"; CLI_ITERATIONS="$2"; shift 2 ;;
    --iterations=*) CLI_ITERATIONS="${1#--iterations=}";                        shift   ;;
    --timeout)     require_value "--timeout"    "${2:-}"; CLI_TIMEOUT="$2";    shift 2 ;;
    --timeout=*)   CLI_TIMEOUT="${1#--timeout=}";                               shift   ;;
    --model)       require_value "--model"      "${2:-}"; CLI_MODEL="$2";      shift 2 ;;
    --model=*)     CLI_MODEL="${1#--model=}";                                   shift   ;;
    --effort)      require_value "--effort"     "${2:-}"; CLI_EFFORT="$2";     shift 2 ;;
    --effort=*)    CLI_EFFORT="${1#--effort=}";                                 shift   ;;
    --continue)    CONTINUE=1;                                                  shift   ;;
    --)
      shift
      while [[ $# -gt 0 ]]; do POSITIONAL+=("$1"); shift; done
      ;;
    -*)
      echo "error: unknown flag '$1'" >&2
      exit 1
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

# Named flags win over positionals; positionals win over defaults.
TAG="${CLI_TAG:-${POSITIONAL[0]:-$(date +%b%d | tr '[:upper:]' '[:lower:]')}}"
ITERATIONS="${CLI_ITERATIONS:-${POSITIONAL[1]:-200}}"
ITER_TIMEOUT="${CLI_TIMEOUT:-${POSITIONAL[2]:-600}}"   # 10 min hard kill (5 min budget + buffer)
BRANCH="autoresearch/${TAG}"
LOG_DIR="runs/${TAG}"
CLAUDE_BIN="${CLAUDE_BIN:-claude}"

# CLI flags win over env vars.
[[ -n "${CLI_MODEL}" ]]  && CLAUDE_MODEL="${CLI_MODEL}"
[[ -n "${CLI_EFFORT}" ]] && CLAUDE_EFFORT="${CLI_EFFORT}"

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

# Install a pre-push hook that blocks pushes from autoresearch/* branches.
# Idempotent: re-written every run.
HOOK_PATH=".git/hooks/pre-push"
cat > "${HOOK_PATH}" <<'HOOK'
#!/usr/bin/env bash
# Installed by run-loop.sh — blocks pushes from autoresearch/* branches.
while read -r local_ref local_sha remote_ref remote_sha; do
  case "${local_ref}" in
    refs/heads/autoresearch/*)
      echo "pre-push: refusing to push ${local_ref} (autoresearch branch)" >&2
      echo "pre-push: remove .git/hooks/pre-push to override" >&2
      exit 1
      ;;
  esac
done
exit 0
HOOK
chmod +x "${HOOK_PATH}"

PROMPT='Read program.md and OBJECTIVES.md. Run exactly ONE iteration of the autoresearch loop as described in program.md: pick an experiment, edit in-scope files, commit, verify, append a row to results.tsv, then keep or git reset. Return as soon as that single iteration is done. Do not loop. Do not ask the human anything. NEVER run git push under any circumstance — commits stay local.'

CLAUDE_MODEL="${CLAUDE_MODEL:-claude-sonnet-4-6}"
MODEL_FLAG=(--model "${CLAUDE_MODEL}")

EFFORT_FLAG=()
if [[ -n "${CLAUDE_EFFORT:-}" ]]; then
  case "${CLAUDE_EFFORT}" in
    low|medium|high|xhigh|max)
      EFFORT_FLAG=(--effort "${CLAUDE_EFFORT}")
      ;;
    *)
      echo "error: effort must be one of: low, medium, high, xhigh, max (got '${CLAUDE_EFFORT}')" >&2
      exit 1
      ;;
  esac
fi

START_IDX=1
if [[ ${CONTINUE} -eq 1 ]]; then
  # Resume from NNN+1 where NNN is the highest iter-NNN.log that is non-empty.
  # Zero-byte logs (e.g. cut off mid-write by Ctrl-C) are treated as incomplete
  # and will be redone.
  LAST=$(find "${LOG_DIR}" -maxdepth 1 -type f -name 'iter-[0-9][0-9][0-9].log' -size +0c 2>/dev/null \
           | sed -n 's@.*/iter-\([0-9]\{3\}\)\.log$@\1@p' \
           | sort -n | tail -n 1 || true)
  if [[ -n "${LAST}" ]]; then
    # 10# forces base-10 so leading zeros don't trigger octal parsing.
    START_IDX=$(( 10#${LAST} + 1 ))
  fi
  if [[ ${START_IDX} -gt ${ITERATIONS} ]]; then
    echo "→ --continue: ${LAST} already at or past ITERATIONS=${ITERATIONS}, nothing to do"
    exit 0
  fi
  echo "→ --continue: resuming at iter ${START_IDX} (last completed: ${LAST:-none})"
fi

START_EPOCH=$(date +%s)
echo "→ running iters ${START_IDX}..${ITERATIONS} on ${BRANCH} (timeout ${ITER_TIMEOUT}s each)"
echo "→ logs: ${LOG_DIR}/iter-NNN.log"

for i in $(seq "${START_IDX}" "${ITERATIONS}"); do
  IDX=$(printf '%03d' "${i}")
  LOG="${LOG_DIR}/iter-${IDX}.log"
  STAMP=$(date -Iseconds)
  echo "=== iter ${IDX}/${ITERATIONS} @ ${STAMP} ==="

  # Run the iteration in the background and `wait` for it. `wait` is
  # interruptible by traps; a synchronous foreground call would queue the
  # SIGINT trap until the child exits, but `claude -p` swallows SIGINT so
  # that never happens. Background + wait makes Ctrl-C actually fire the trap.
  set +e
  timeout "${ITER_TIMEOUT}" "${CLAUDE_BIN}" \
    -p "${PROMPT}" \
    --dangerously-skip-permissions \
    "${MODEL_FLAG[@]}" \
    ${EFFORT_FLAG[@]+"${EFFORT_FLAG[@]}"} \
    > "${LOG}" 2>&1 &
  CHILD_PID=$!
  wait "${CHILD_PID}"
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
