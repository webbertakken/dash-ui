#!/usr/bin/env tsx
// For each .tsx file in packages/react/src/components, extract the
// surface signatures of exported components + their Props interfaces.
// Output: human-readable text grouped by file.

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const dir = path.resolve('packages/react/src/components');
const files = (await readdir(dir)).filter((f) => f.endsWith('.tsx')).sort();

for (const file of files) {
  const src = await readFile(path.join(dir, file), 'utf8');
  console.log(`\n===== ${file} =====`);
  // export interface XxxProps { ... }
  const ifaceRe = /^export\s+interface\s+([A-Z]\w*)\s*(?:extends[^{]*)?\{([\s\S]*?)^\}/gm;
  for (const m of src.matchAll(ifaceRe)) {
    const name = m[1]!;
    if (!/Props$|Item$|Option$|Node$|Link$|Segment$|Series$|Range$|Menu$|Card$|Column$|Rule$|Field$|Definition$|Def$/.test(name)) continue;
    const body = m[2]!.trim().split(/\n/).map((l) => l.trim()).filter(Boolean).join(' | ');
    console.log(`interface ${name}: ${body}`);
  }
  // export function Xxx(...): ...
  const fnRe = /^export\s+function\s+([A-Z]\w*)\s*\(([^)]*?)\)/gm;
  for (const m of src.matchAll(fnRe)) {
    const name = m[1]!;
    const params = m[2]!.replace(/\s+/g, ' ').trim();
    console.log(`fn ${name}(${params})`);
  }
}
