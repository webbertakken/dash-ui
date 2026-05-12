<script module lang="ts">
  export interface NightingaleSegment {
    label: string;
    value: number;
    color?: string;
  }
</script>

<script lang="ts">

  interface Props {
    segments?: NightingaleSegment[];
    color?: string;
    ariaLabel?: string;
  }

  let { segments = [], color = '#006FFF', ariaLabel = 'Nightingale chart' }: Props = $props();

  const SIZE = 280;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const MAX_R = 108;
  const MIN_R = 8;
  const LABEL_R = MAX_R + 16;

  function wedgePath(r: number, sa: number, ea: number): string {
    const x1 = CX + r * Math.cos(sa);
    const y1 = CY + r * Math.sin(sa);
    const x2 = CX + r * Math.cos(ea);
    const y2 = CY + r * Math.sin(ea);
    return `M ${CX} ${CY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
  }

  let n = $derived(segments.length);
  let maxVal = $derived(n ? Math.max(...segments.map((s) => s.value), 1) : 1);
  let step = $derived(n ? (2 * Math.PI) / n : 0);
  let labelEvery = $derived(n <= 8 ? 1 : Math.round(n / 8));
  let wedges = $derived(segments.map((seg, i) => {
    const sa = -Math.PI / 2 + i * step;
    const ea = -Math.PI / 2 + (i + 1) * step;
    const r = MIN_R + (seg.value / maxVal) * (MAX_R - MIN_R);
    const mid = sa + step / 2;
    return {
      d: wedgePath(r, sa, ea),
      c: seg.color ?? color,
      opacity: 0.3 + 0.7 * (seg.value / maxVal),
      lx: CX + LABEL_R * Math.cos(mid),
      ly: CY + LABEL_R * Math.sin(mid),
      label: seg.label,
      showLabel: i % labelEvery === 0,
    };
  }));
</script>

{#if segments.length}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {SIZE} {SIZE}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      {#each [0.25, 0.5, 0.75, 1] as f}
        <circle cx={CX} cy={CY} r={MIN_R + (MAX_R - MIN_R) * f} fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      {/each}
      {#each wedges as w, i (i)}
        <path d={w.d} fill={w.c} opacity={w.opacity} />
        {#if w.showLabel}
          <text x={w.lx.toFixed(1)} y={w.ly.toFixed(1)} fill="#6E7079" font-size="8" text-anchor="middle" dominant-baseline="middle" font-family="inherit">{w.label}</text>
        {/if}
      {/each}
      <circle cx={CX} cy={CY} r={MIN_R} fill="#13131A" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
    </svg>
  </div>
{/if}
