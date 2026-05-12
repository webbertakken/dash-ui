<script context="module" lang="ts">
  export interface PolarCell {
    row: number;
    col: number;
    value: number;
  }
</script>

<script lang="ts">

  export let data: PolarCell[] = [];
  export let rows: number = 7;
  export let cols: number = 24;
  export let colLabels: string[] = [];
  export let color: string = '#006FFF';
  export let ariaLabel: string = 'Polar heatmap';

  const SIZE = 280;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const MIN_R = 24;
  const MAX_R = 110;
  const BASE = -Math.PI / 2;

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function annularSector(ir: number, or: number, sa: number, ea: number): string {
    const { cos, sin } = Math;
    const f = (v: number) => v.toFixed(2);
    return [
      `M ${f(CX + ir * cos(sa))} ${f(CY + ir * sin(sa))}`,
      `A ${f(ir)} ${f(ir)} 0 0 1 ${f(CX + ir * cos(ea))} ${f(CY + ir * sin(ea))}`,
      `L ${f(CX + or * cos(ea))} ${f(CY + or * sin(ea))}`,
      `A ${f(or)} ${f(or)} 0 0 0 ${f(CX + or * cos(sa))} ${f(CY + or * sin(sa))}`,
      'Z',
    ].join(' ');
  }

  $: maxVal = data.length ? Math.max(...data.map((d) => d.value), 1) : 1;
  $: ringH = (MAX_R - MIN_R) / rows;
  $: segA = (2 * Math.PI) / cols;
  $: [rC, gC, bC] = hexToRgb(color);
  $: LABEL_R = MAX_R + 14;
  $: labelEvery = cols <= 12 ? 1 : cols <= 24 ? 3 : Math.round(cols / 8);
  $: rings = Array.from({ length: rows + 1 }, (_, i) => +(MIN_R + i * ringH).toFixed(2));
  $: cells = data.map((cell) => {
    const ir = MIN_R + cell.row * ringH;
    const or = ir + ringH - 0.5;
    const sa = BASE + cell.col * segA + 0.01;
    const ea = BASE + (cell.col + 1) * segA - 0.01;
    const norm = cell.value / maxVal;
    return {
      d: annularSector(ir, or, sa, ea),
      fill: `rgba(${rC},${gC},${bC},${(0.08 + 0.92 * norm).toFixed(3)})`,
    };
  });
  $: visibleColLabels = colLabels
    .map((label, i) => {
      if (i % labelEvery !== 0) return null;
      const a = BASE + (i + 0.5) * segA;
      return {
        x: (CX + LABEL_R * Math.cos(a)).toFixed(1),
        y: (CY + LABEL_R * Math.sin(a)).toFixed(1),
        label,
      };
    })
    .filter(Boolean) as { x: string; y: string; label: string }[];
</script>

{#if data.length}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {SIZE} {SIZE}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each rings as r, i (i)}
        <circle cx={CX} cy={CY} r={r} fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
      {/each}
      {#each cells as cell, i (i)}
        <path d={cell.d} fill={cell.fill} />
      {/each}
      {#each visibleColLabels as lbl, i (i)}
        <text x={lbl.x} y={lbl.y} fill="#6E7079" font-size="7" text-anchor="middle" dominant-baseline="middle" font-family="inherit">{lbl.label}</text>
      {/each}
      <circle cx={CX} cy={CY} r={MIN_R} fill="#13131A" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
    </svg>
  </div>
{/if}
