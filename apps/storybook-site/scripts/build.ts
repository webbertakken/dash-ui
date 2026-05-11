#!/usr/bin/env tsx
// Assembles a single static site from all three Storybook builds plus a
// top-level landing page.
//
// Layout:
//   dist/
//   ├── index.html         (landing page; framework picker)
//   ├── react/             (storybook-react/storybook-static)
//   ├── svelte/            (storybook-svelte/storybook-static)
//   └── wc/                (storybook-wc/storybook-static)
//
// We expect each Storybook to have already been built. The build script in
// the workspace root takes care of that order.

import { cp, mkdir, rm, stat, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..', '..');
const DIST = path.join(REPO_ROOT, 'apps/storybook-site/dist');

const SOURCES = [
  { from: 'apps/storybook-react/storybook-static', to: 'react' },
  { from: 'apps/storybook-svelte/storybook-static', to: 'svelte' },
  { from: 'apps/storybook-wc/storybook-static', to: 'wc' },
] as const;

async function exists(p: string) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

for (const { from, to } of SOURCES) {
  const src = path.join(REPO_ROOT, from);
  if (!(await exists(src))) {
    console.warn(`SKIP: ${from} not found - did you build it?`);
    continue;
  }
  await cp(src, path.join(DIST, to), { recursive: true });
  console.log(`Copied ${from} -> dist/${to}/`);
}

const tokensCss = await readFile(path.join(REPO_ROOT, 'packages/tokens/src/tokens.css'), 'utf8');

// Landing page is fully self-contained: inlines the tokens CSS so motif
// variables work without any extra requests, and uses no JS frameworks.
const indexHtml = `<!doctype html>
<html lang="en" data-motif="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dash UI design system</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%231C1C1E'/%3E%3Crect x='22' y='12' width='30' height='22' rx='3' fill='white' fill-opacity='0.16'/%3E%3Crect x='12' y='28' width='30' height='22' rx='3' fill='white'/%3E%3Cpath d='M17 43 L22 39 L27 41 L32 35 L37 38' stroke='%23006FFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E" />
  <style>
    ${tokensCss}
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background: var(--bg-page);
      color: var(--text-1);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 64px 24px;
    }
    main { width: 100%; max-width: 920px; }
    .topbar { width: 100%; max-width: 920px; display: flex; justify-content: flex-end; margin-bottom: 16px; }
    .motif-toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: var(--radius-pill);
      border: 1px solid var(--border-2);
      background: var(--depthBg-1);
      color: var(--text-2);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .motif-toggle:hover { color: var(--text-1); border-color: var(--brand-05); }
    .brand { display: flex; align-items: center; gap: 16px; margin: 0 0 24px; }
    .brand svg { width: 56px; height: 56px; border-radius: 12px; box-shadow: var(--shadow-card); }
    h1 { font-size: 32px; margin: 0; letter-spacing: -0.01em; }
    p.lead { color: var(--text-2); font-size: 16px; margin: 0 0 32px; max-width: 640px; }
    .pickers { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    a.card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 20px;
      border: 1px solid var(--border-2);
      border-radius: var(--radius-lg);
      background: var(--depthBg-2);
      color: var(--text-1);
      text-decoration: none;
      transition: border-color 120ms ease, transform 120ms ease;
      box-shadow: var(--shadow-card);
    }
    a.card:hover { border-color: var(--brand-05); transform: translateY(-1px); }
    a.card:focus-visible { outline: 2px solid var(--brand-05); outline-offset: 2px; }
    .badge {
      align-self: flex-start;
      padding: 2px 10px;
      border-radius: var(--radius-pill);
      font-size: 11px;
      font-weight: 500;
      background: var(--status-info-bg);
      color: var(--brand-06);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    h2 { font-size: 18px; margin: 4px 0 0; }
    .desc { color: var(--text-2); font-size: 14px; margin: 0; }
    .meta { color: var(--text-3); font-size: 12px; margin-top: 12px; font-family: var(--font-mono); }
    footer { margin-top: 64px; color: var(--text-3); font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="topbar">
    <button class="motif-toggle" type="button" id="motif">Switch to light</button>
  </div>
  <main>
    <div class="brand">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#1C1C1E"/>
        <rect x="22" y="12" width="30" height="22" rx="3" fill="#FFFFFF" fill-opacity="0.16"/>
        <rect x="12" y="28" width="30" height="22" rx="3" fill="#FFFFFF"/>
        <path d="M17 43 L22 39 L27 41 L32 35 L37 38" stroke="#006FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      <h1>Dash UI design system</h1>
    </div>
    <p class="lead">Dash-inspired components for dashboards. Subtle, clean and factual style. Pick a renderer to browse the catalogue, or jump to the live dashboard examples in any of them.</p>
    <div class="pickers">
      <a class="card" href="./react/">
        <span class="badge">React</span>
        <h2>@dash-ui/react</h2>
        <p class="desc">168 React 18 components. Render via JSX, full TS types, server-rendering tested.</p>
        <p class="meta">storybook \u2192 ./react/</p>
      </a>
      <a class="card" href="./svelte/">
        <span class="badge">Svelte</span>
        <h2>@dash-ui/svelte</h2>
        <p class="desc">168 Svelte 4 components mirroring the React API. SvelteKit ready.</p>
        <p class="meta">storybook \u2192 ./svelte/</p>
      </a>
      <a class="card" href="./wc/">
        <span class="badge">Web Components</span>
        <h2>@dash-ui/wc</h2>
        <p class="desc">166 framework-agnostic custom elements compiled from the Svelte source.</p>
        <p class="meta">storybook \u2192 ./wc/</p>
      </a>
    </div>
    <footer>
      Dash UI is a recreation of the Dash design system as a portable, multi-framework library.
    </footer>
  </main>
  <script>
    const html = document.documentElement;
    const btn = document.getElementById('motif');
    const stored = localStorage.getItem('motif');
    if (stored) html.setAttribute('data-motif', stored);
    function syncLabel() {
      const m = html.getAttribute('data-motif');
      btn.textContent = m === 'light' ? 'Switch to dark' : 'Switch to light';
    }
    syncLabel();
    btn.addEventListener('click', () => {
      const next = html.getAttribute('data-motif') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-motif', next);
      localStorage.setItem('motif', next);
      syncLabel();
    });
  </script>
</body>
</html>
`;

await writeFile(path.join(DIST, 'index.html'), indexHtml);
console.log('Wrote dist/index.html');
console.log(`\nTotal site at: ${DIST}`);
