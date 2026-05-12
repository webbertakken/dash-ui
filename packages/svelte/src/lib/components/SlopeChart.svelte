<script context="module" lang="ts">
  export interface SlopeItem {
    label: string;
    before: number;
    after: number;
  }
</script>

<script lang="ts">

  export let items: SlopeItem[] = [];
  export let labelBefore: string = 'Before';
  export let labelAfter: string = 'After';
  export let unit: string = '';
  export let ariaLabel: string = 'Slope chart';
  export let positiveIsGood: boolean = false;

  const VW = 340;
  const COL_L = 108;
  const COL_R = 232;
  const PAD_T = 26;
  const CHART_H = 192;
  const PAD_B = 8;
  const SVG_H = PAD_T + CHART_H + PAD_B;
  const DOT_R = 4;
  const LABEL_GAP = 15;

  function nudge(ys: number[], gap: number): number[] {
    const out = [...ys];
    const ord = out.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
    for (let k = 1; k < ord.length; k++) {
      if (ord[k].y < ord[k - 1].y + gap) ord[k].y = ord[k - 1].y + gap;
    }
    for (let k = ord.length - 2; k >= 0; k--) {
      if (ord[k].y > ord[k + 1].y - gap) ord[k].y = ord[k + 1].y - gap;
    }
    const res: number[] = new Array(ys.length);
    ord.forEach(({ y, i }) => { res[i] = y; });
    return res;
  }

  $: allVals = items.flatMap((it) => [it.before, it.after]);
  $: minV = allVals.length ? Math.min(...allVals) : 0;
  $: maxV = allVals.length ? Math.max(...allVals) : 1;
  $: range = maxV - minV || 1;
  $: ty = (v: number) => PAD_T + (1 - (v - minV) / range) * CHART_H;

  $: leftDotY = items.map((it) => ty(it.before));
  $: rightDotY = items.map((it) => ty(it.after));
  $: leftLabelY = nudge(leftDotY, LABEL_GAP);
  $: rightLabelY = nudge(rightDotY, LABEL_GAP);

  $: colored = items.map((it, i) => {
    const diff = it.after - it.before;
    const c =
      diff === 0 ? '#A4A7B5' : diff > 0 === positiveIsGood ? '#00C875' : '#FF7B7B';
    return {
      ...it,
      c,
      ly: leftDotY[i],
      ry: rightDotY[i],
      lly: leftLabelY[i],
      rly: rightLabelY[i],
      delta: it.after - it.before,
    };
  });
</script>

{#if items.length}
  <div role="img" aria-label={ariaLabel} style="width:100%;">
    <svg viewBox="0 0 {VW} {SVG_H}" style="width:100%;height:auto;display:block;" aria-hidden="true" focusable="false">
      <text x={COL_L} y="14" fill="#6E7079" font-size="10" text-anchor="middle" font-family="inherit">{labelBefore}</text>
      <text x={COL_R} y="14" fill="#6E7079" font-size="10" text-anchor="middle" font-family="inherit">{labelAfter}</text>
      <line x1={COL_L} y1={PAD_T} x2={COL_L} y2={PAD_T + CHART_H} stroke="rgba(255,255,255,0.07)" stroke-width="1" />
      <line x1={COL_R} y1={PAD_T} x2={COL_R} y2={PAD_T + CHART_H} stroke="rgba(255,255,255,0.07)" stroke-width="1" />

      {#each colored as it, i (i)}
        <line x1={COL_L} y1={it.ly} x2={COL_R} y2={it.ry} stroke={it.c} stroke-width="1.5" opacity="0.65" />
        {#if Math.abs(it.lly - it.ly) > 1}
          <line x1={COL_L - 6} y1={it.ly} x2={COL_L - 6} y2={it.lly} stroke="rgba(255,255,255,0.12)" stroke-width="0.75" />
        {/if}
        {#if Math.abs(it.rly - it.ry) > 1}
          <line x1={COL_R + 6} y1={it.ry} x2={COL_R + 6} y2={it.rly} stroke="rgba(255,255,255,0.12)" stroke-width="0.75" />
        {/if}
        <circle cx={COL_L} cy={it.ly} r={DOT_R} fill={it.c} />
        <circle cx={COL_R} cy={it.ry} r={DOT_R} fill={it.c} />
        <text x={COL_L - 10} y={it.lly + 4} fill="#A4A7B5" font-size="9" text-anchor="end" font-family="inherit">{it.label}</text>
        <text x={COL_L - 10} y={it.lly + 15} fill="#6E7079" font-size="9" text-anchor="end" font-family="inherit" style="font-variant-numeric: tabular-nums">{it.before}{unit}</text>
        <text x={COL_R + 10} y={it.rly + 4} fill="#A4A7B5" font-size="9" text-anchor="start" font-family="inherit" style="font-variant-numeric: tabular-nums">{it.after}{unit}</text>
        <text x={COL_R + 10} y={it.rly + 15} fill={it.c} font-size="9" text-anchor="start" font-family="inherit" style="font-variant-numeric: tabular-nums">{it.delta > 0 ? '+' : ''}{it.delta}{unit}</text>
      {/each}
    </svg>
  </div>
{/if}
