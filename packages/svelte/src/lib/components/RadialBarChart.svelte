<script module lang="ts">
  export interface RadialBarItem {
    label: string;
    value: number;
    max: number;
    color?: string;
    unit?: string;
  }
</script>

<script lang="ts">

  interface Props {
    items?: RadialBarItem[];
    ariaLabel?: string;
  }

  let { items = [], ariaLabel = 'Radial bar chart' }: Props = $props();

  const W = 280;
  const H = 160;
  const CX = 80;
  const CY = 80;
  const RING_W = 9;
  const RING_GAP = 5;
  const MIN_R = 20;
  const LABEL_X = 170;
  const ITEM_H = 22;

  function arcPath(r: number, frac: number): string {
    if (frac <= 0) return '';
    const start = -Math.PI / 2;
    const clamped = Math.min(frac, 1);
    const x1 = (CX + r * Math.cos(start)).toFixed(2);
    const y1 = (CY + r * Math.sin(start)).toFixed(2);
    if (clamped >= 1) {
      const xm = (CX + r * Math.cos(start + Math.PI)).toFixed(2);
      const ym = (CY + r * Math.sin(start + Math.PI)).toFixed(2);
      return `M${x1},${y1} A${r},${r} 0 1 1 ${xm},${ym} A${r},${r} 0 1 1 ${x1},${y1}`;
    }
    const sweep = clamped * 2 * Math.PI;
    const end = start + sweep;
    const x2 = (CX + r * Math.cos(end)).toFixed(2);
    const y2 = (CY + r * Math.sin(end)).toFixed(2);
    return `M${x1},${y1} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2},${y2}`;
  }

  let n = $derived(items.length);
  let yStart = $derived(CY - ((n - 1) * ITEM_H) / 2);
  let rings = $derived(items.map((item, i) => {
    const r = MIN_R + (n - 1 - i) * (RING_W + RING_GAP);
    const frac = Math.min(item.value / (item.max || 1), 1);
    const color = item.color ?? '#006FFF';
    const ly = yStart + i * ITEM_H;
    return {
      r,
      frac,
      color,
      ly,
      d: arcPath(r, frac),
      pct: Math.round(frac * 100),
      label: item.label,
      value: item.value,
      unit: item.unit ?? '',
    };
  }));
</script>

{#if items.length}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {W} {H}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each rings as ring, i (i)}
        <circle cx={CX} cy={CY} r={ring.r} fill="none" stroke="rgba(255,255,255,0.06)" stroke-width={RING_W} />
        {#if ring.d}
          <path d={ring.d} fill="none" stroke={ring.color} stroke-width={RING_W} stroke-linecap="round" />
        {/if}
        <circle cx={LABEL_X} cy={ring.ly} r="3.5" fill={ring.color} />
        <text x={LABEL_X + 10} y={ring.ly - 2} fill="#C8C9D0" font-size="9" font-family="inherit" dominant-baseline="auto">{ring.label}</text>
        <text x={LABEL_X + 10} y={ring.ly + 9} fill="#6E7079" font-size="8" font-family="inherit" dominant-baseline="auto">{ring.value}{ring.unit} · {ring.pct}%</text>
      {/each}
    </svg>
  </div>
{/if}
