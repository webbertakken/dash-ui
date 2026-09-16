---
'@w5-ui/fleet': patch
---

Type-check the package under the flags a strict consumer runs.

`@w5-ui/fleet` ships its source, so a consumer compiles these files with
THEIR compiler options - and until now nothing type-checked them here at
all (no tsconfig, no `typecheck` script). Three unchecked index reads in
`helpers.ts` and `topology-layout.ts` were therefore errors inside every
consumer's `node_modules`, at a path they cannot edit.

The package now has a tsconfig pinned to the strictest flags a consumer
is likely to use (`strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noImplicitReturns`,
`noFallthroughCasesInSwitch`) and a `typecheck` script that the repo's
`yarn typecheck` picks up, so this class of breakage cannot come back.

No behaviour change: `rowsByDepth` / `laneSpec` build a row on demand
instead of indexing a pre-sized array, and `groupedComponents` uses
`??=` for the same bucket it created before.
