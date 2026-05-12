<script context="module" lang="ts">
  export interface CirclePackItem {
    id: string;
    label: string;
    value: number;
    color?: string;
  }
</script>

<script lang="ts">

  export let items: CirclePackItem[];
  export let height = 200;
  export let ariaLabel = 'Circle packing chart';

  const PALETTE = ['#006FFF', '#00C875', '#F5A623', '#A78BFA', '#FF7B7B', '#00C8C8', '#FB923C', '#4797FF'];
  const VW = 360;
  const MAX_R = 72;
  const MIN_R = 10;

  function pack(radii: number[]): { cx: number; cy: number }[] {
    const pos: { cx: number; cy: number; r: number }[] = [];
    for (let i = 0; i < radii.length; i++) {
      const r = radii[i];
      if (i === 0) { pos.push({ cx: 0, cy: 0, r }); continue; }
      if (i === 1) { pos.push({ cx: pos[0].r + r, cy: 0, r }); continue; }

      const candidates: { cx: number; cy: number }[] = [];
      for (let a = 0; a < pos.length; a++) {
        for (let b = a + 1; b < pos.length; b++) {
          const pa = pos[a], pb = pos[b];
          const da = pa.r + r, db = pb.r + r;
          const dx = pb.cx - pa.cx, dy = pb.cy - pa.cy;
          const dist = Math.hypot(dx, dy);
          if (dist > da + db || dist < Math.abs(da - db)) continue;
          const cosA = (da * da + dist * dist - db * db) / (2 * da * dist);
          if (cosA < -1 || cosA > 1) continue;
          const acos = Math.acos(Math.max(-1, Math.min(1, cosA)));
          const base = Math.atan2(dy, dx);
          for (const sign of [1, -1]) {
            candidates.push({
              cx: pa.cx + da * Math.cos(base + sign * acos),
              cy: pa.cy + da * Math.sin(base + sign * acos),
            });
          }
        }
        const pa = pos[a];
        const ang = Math.atan2(-pa.cy, -pa.cx);
        candidates.push({
          cx: pa.cx + (pa.r + r) * Math.cos(ang),
          cy: pa.cy + (pa.r + r) * Math.sin(ang),
        });
      }

      let best: { cx: number; cy: number } | null = null;
      let bestDist = Infinity;
      for (const c of candidates) {
        const overlap = pos.some((p) => Math.hypot(c.cx - p.cx, c.cy - p.cy) < p.r + r - 0.4);
        if (!overlap) {
          const d = Math.hypot(c.cx, c.cy);
          if (d < bestDist) { bestDist = d; best = c; }
        }
      }
      const last = pos[pos.length - 1];
      pos.push({ cx: best?.cx ?? last.cx + last.r + r + 2, cy: best?.cy ?? 0, r });
    }
    return pos.map(({ cx, cy }) => ({ cx, cy }));
  }

  $: layout = (() => {
    if (!items.length) return null;
    const sorted = [...items].sort((a, b) => b.value - a.value);
    const maxV = sorted[0].value;
    const radii = sorted.map((it) => Math.max(MIN_R, Math.round(MAX_R * Math.sqrt(it.value / maxV))));
    const positions = pack(radii);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    positions.forEach((p, i) => {
      minX = Math.min(minX, p.cx - radii[i]);
      minY = Math.min(minY, p.cy - radii[i]);
      maxX = Math.max(maxX, p.cx + radii[i]);
      maxY = Math.max(maxY, p.cy + radii[i]);
    });
    const w = maxX - minX, h = maxY - minY;
    const pad = 8;
    const scale = Math.min((VW - pad * 2) / w, (height - pad * 2) / h);
    const offX = (VW - w * scale) / 2 - minX * scale;
    const offY = (height - h * scale) / 2 - minY * scale;

    return sorted.map((item, i) => {
      const r = radii[i] * scale;
      const cx = positions[i].cx * scale + offX;
      const cy = positions[i].cy * scale + offY;
      const color = item.color ?? PALETTE[i % PALETTE.length];
      return { id: item.id, label: item.label, value: item.value, cx, cy, r, color };
    });
  })();
</script>

{#if layout}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {height}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each layout as c (c.id)}
        <g>
          <circle cx={c.cx} cy={c.cy} r={c.r} fill={c.color} fill-opacity={0.25} stroke={c.color} stroke-width={1.5} />
          {#if c.r >= 18}
            <text x={c.cx} y={c.cy - (c.r >= 26 ? 5 : 0)} text-anchor="middle" dominant-baseline="middle"
              font-size={Math.min(11, c.r * 0.38)} fill="#E2E4ED" font-family="inherit" font-weight={500}>
              {c.label}
            </text>
          {/if}
          {#if c.r >= 26}
            <text x={c.cx} y={c.cy + 10} text-anchor="middle" dominant-baseline="middle"
              font-size={Math.min(9, c.r * 0.3)} fill={c.color} font-family="inherit">
              {c.value}
            </text>
          {/if}
        </g>
      {/each}
    </svg>
  </div>
{/if}
