# autoresearch

Autonomous design-system experiment loop. Human edits `OBJECTIVES.md` to steer the
loop; agent runs **one** iteration per invocation. The shell driver
(`run-loop.sh`) handles iteration count and per-iteration timeout.

## Per-iteration workflow

1. **Read context** (in this order):
   - `OBJECTIVES.md` — current goals + success criteria (human-edited)
   - `results.tsv` — log of prior iterations on this branch
   - `git log --oneline -20` — recent experiments on this branch
2. **Pick the next experiment.** Avoid repeating ideas already in `results.tsv`
   unless combining them or going deeper. Bias toward simple changes first.
3. **Edit code.**
   - In-scope: `apps/**`, `packages/**`, `design-bundle/**`.
   - Out-of-scope: `program.md`, `OBJECTIVES.md`, `results.tsv`, `run-loop.sh`,
     `runs/**`. Do not edit.
4. **Commit.** Single commit per iteration, one-line message describing the
   experiment.
5. **Verify.** Run whatever the objectives demand. Default checks:
   - `pnpm install --frozen-lockfile` (only if `package.json` changed)
   - `pnpm build` must pass
   - any extra check `OBJECTIVES.md` specifies
6. **Append to `results.tsv`.** One row, tab-separated:
   ```
   commit<TAB>status<TAB>metric<TAB>description
   ```
   - `commit`: 7-char hash
   - `status`: `keep` | `discard` | `crash`
   - `metric`: number (per `OBJECTIVES.md`) or `n/a`
   - `description`: short, no tabs
7. **Decide.**
   - Improved against `OBJECTIVES.md` → `keep`, commit stays.
   - Equal/worse, build broke, or crashed → `git reset --hard HEAD~1`.
8. **Return.** One iteration only. The shell driver will invoke you again.

## Hard rules

- Time budget: ~5 min wall clock. The driver kills the process at 10 min.
- Never push. Never edit the gitignored files. Never modify `program.md`,
  `OBJECTIVES.md`, `run-loop.sh`.
- No new runtime dependencies without an explicit note in the commit message
  AND a measurable benefit recorded in `results.tsv`.
- **Simplicity wins.** A simplification that holds the metric flat = keep.
  A 0.001 improvement that adds 50 ugly lines = discard.
- If you crash twice on the same idea, log `crash`, revert, move on.
- Do not stop to ask the human for confirmation. The driver loops; you do one
  unit of work and exit.

## Baseline

The first row in `results.tsv` is the baseline (status=`keep`, no code change,
metric measured against the as-is build). If `results.tsv` is missing or empty,
your first iteration is to establish that baseline.
